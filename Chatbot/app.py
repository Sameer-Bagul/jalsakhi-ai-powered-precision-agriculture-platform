import os
from typing import Any

import streamlit as st
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_groq import ChatGroq

from ml_tools import get_jalsakhi_tools

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")

if not groq_key:
    st.error("GROQ_API_KEY not found in .env file")
    st.stop()

JALSAKHI_SYSTEM = """You are Jalsakhi, a helpful water and agriculture assistant for farmers and village planners in India.

You have access to these tools when needed:

1. **Crop water requirement** (predict_crop_water): Use when the user asks how much water a crop needs. You need: crop_type (e.g. MAIZE, RICE, WHEAT), soil_type (DRY, WET, HUMID), region (one of 15 India agro-climatic zones, e.g. "Trans-Gangetic Plain Region", "Western Himalayan Region"), temperature (10-20, 20-30, 30-40, 40-50), weather_condition (NORMAL, SUNNY, WINDY, RAINY). Explain the result in mm/day and L/acre/day clearly.

2. **Soil moisture from sensors** (predict_soil_moisture_sensor): Use when the user provides sensor readings (PM1, PM2, PM3, AM, luminosity, temperature, humidity, pressure) and wants a soil moisture forecast for the next 3–7 days. Optional: avg_sm_lag1, avg_sm_lag2 for previous days' soil moisture.

3. **Soil moisture from location** (predict_soil_moisture_location): Use when the user gives state, district, and the last 7 observed soil moisture values, and wants a forecast for days 3–7. sm_history must be exactly 7 numbers (most recent last); pass as JSON array string e.g. "[25,26,27,28,29,30,31]" or describe how to format it.

4. **Village water allocation** (optimize_village_water): Use when the user wants to distribute a fixed amount of village reservoir water across multiple farms. You need total_available_water_liters and a JSON array of farms. Each farm: farm_id, area_ha or area_acre, crop_type, soil_type, region, temperature, weather_condition, priority_score (1=low, 2=medium, 3=high). Explain allocations, deficit/met status, and village efficiency score.

If a tool returns an error (e.g. "service unavailable"), say so clearly and do not invent numbers. Be concise and use simple language. When you use a tool, summarize the result in a helpful way for the user."""

# Streamlit UI
st.title("Jalsakhi Chatbot")
st.caption("Water and agriculture assistant — crop water, soil moisture, village allocation.")
user_input = st.text_input("Ask something (e.g. crop water for maize, soil moisture forecast, or village water allocation)")

tools = get_jalsakhi_tools()
tool_map = {t.name: t for t in tools}

llm = ChatGroq(
    groq_api_key=groq_key,
    model_name="llama-3.1-8b-instant",
)
llm_with_tools = llm.bind_tools(tools)

if user_input:
    try:
        messages: list[Any] = [
            SystemMessage(content=JALSAKHI_SYSTEM),
            HumanMessage(content=user_input),
        ]
        tools_used: list[str] = []
        max_rounds = 10

        while max_rounds > 0:
            max_rounds -= 1
            response = llm_with_tools.invoke(messages)

            if not getattr(response, "tool_calls", None):
                break

            tool_messages = []
            for tc in response.tool_calls:
                if hasattr(tc, "get"):
                    name = tc.get("name", "")
                    args = tc.get("args") or {}
                    tid = tc.get("id", "")
                else:
                    name = getattr(tc, "name", "")
                    args = getattr(tc, "args", None) or {}
                    tid = getattr(tc, "id", "")
                if name in tool_map:
                    tools_used.append(name)
                    try:
                        result = tool_map[name].invoke(args)
                    except Exception as e:
                        result = str(e)
                else:
                    result = f"Unknown tool: {name}"
                tool_messages.append(
                    ToolMessage(content=result if isinstance(result, str) else str(result), tool_call_id=tid)
                )

            messages.append(response)
            messages.extend(tool_messages)

        final_content = getattr(response, "content", None) or ""
        if isinstance(final_content, list):
            final_content = " ".join(
                (c.get("text", "") if isinstance(c, dict) else str(c) for c in final_content)
            )
        st.write(final_content)

        if tools_used:
            st.caption(f"Tools used: {', '.join(tools_used)}")

    except Exception as e:
        st.error(f"Error: {e}")
