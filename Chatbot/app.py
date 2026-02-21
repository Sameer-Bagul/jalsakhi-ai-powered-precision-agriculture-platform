import streamlit as st
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# load .env file
load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")

if not groq_key:
    st.error("GROQ_API_KEY not found in .env file")
    st.stop()

# streamlit UI
st.title("Groq Chatbot 🚀")
user_input = st.text_input("Ask something")

# setup groq model
llm = ChatGroq(
    groq_api_key=groq_key,
    model_name="llama-3.1-8b-instant"
)

# simple prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Give clear answers."),
    ("user", "{question}")
])

chain = prompt | llm | StrOutputParser()

# run model
if user_input:
    try:
        response = chain.invoke({"question": user_input})
        st.write(response)
    except Exception as e:
        st.error(f"Error: {e}")