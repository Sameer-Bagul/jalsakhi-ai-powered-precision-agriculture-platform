"""
Train crop water requirement model and save pipeline + config for the API.
"""
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

# Paths
DATA_PATH = Path(__file__).resolve().parent / "DATASET - Sheet1.csv"
MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"

CATEGORICAL_COLS = ["CROP TYPE", "SOIL TYPE", "REGION", "WEATHER CONDITION"]
TARGET_COL = "WATER REQUIREMENT"


def parse_temperature_midpoint(temp_str: str) -> float:
    """Parse '10-20' -> 15, '20-30' -> 25, etc."""
    low, high = temp_str.strip().split("-")
    return (int(low) + int(high)) / 2.0


def load_and_prepare_data() -> tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=[TARGET_COL])
    # Aggregate duplicate (crop, soil, region, temp, weather) -> mean water requirement
    key = CATEGORICAL_COLS + ["TEMPERATURE"]
    df = df.groupby(key, as_index=False)[TARGET_COL].mean()
    df["TEMPERATURE"] = df["TEMPERATURE"].astype(str)
    X = df[CATEGORICAL_COLS + ["TEMPERATURE"]].copy()
    X["temp_mid"] = X["TEMPERATURE"].map(parse_temperature_midpoint)
    X_feat = X[CATEGORICAL_COLS + ["temp_mid"]]
    y = df[TARGET_COL]
    return X_feat, y, X


def get_allowed_categories(X_with_temp: pd.DataFrame) -> dict:
    return {
        "crop_type": sorted(X_with_temp["CROP TYPE"].dropna().unique().tolist()),
        "soil_type": sorted(X_with_temp["SOIL TYPE"].dropna().unique().tolist()),
        "region": sorted(X_with_temp["REGION"].dropna().unique().tolist()),
        "weather_condition": sorted(X_with_temp["WEATHER CONDITION"].dropna().unique().tolist()),
        "temperature": sorted(X_with_temp["TEMPERATURE"].dropna().unique().tolist()),
    }


def main():
    X, y, X_with_temp = load_and_prepare_data()

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    preprocessor = ColumnTransformer(
        [
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_COLS,
            ),
            ("num", "passthrough", ["temp_mid"]),
        ],
        remainder="drop",
    )

    model = Pipeline(
        [
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(n_estimators=200, max_depth=20, random_state=42)),
        ]
    )

    model.fit(X_train, y_train)
    val_score = model.score(X_val, y_val)
    print(f"Validation R²: {val_score:.4f}")
    # Refit on full data for production model
    model.fit(X, y)
    train_score = model.score(X, y)
    print(f"Train R² (full data): {train_score:.4f}")

    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

    config = get_allowed_categories(X_with_temp)
    config["target_col"] = TARGET_COL
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)
    print(f"Config saved to {CONFIG_PATH}")


if __name__ == "__main__":
    main()
