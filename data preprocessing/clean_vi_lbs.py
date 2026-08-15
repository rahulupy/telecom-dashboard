import pandas as pd
import re

# Load raw VI LBS
df = pd.read_csv("data/raw/vi_lbs.csv")

# Remove extra spaces from column names
df.columns = df.columns.str.strip()

# Remove duplicate rows
df = df.drop_duplicates()

# Function to extract latitude and longitude


def extract_lat_long(value):
    if pd.isna(value):
        return pd.Series([None, None])

    value = str(value)

    # Find decimal numbers (latitude & longitude)
    coords = re.findall(r'-?\d+\.\d+', value)

    if len(coords) >= 2:
        return pd.Series([coords[0], coords[1]])

    return pd.Series([None, None])


# Create LAT and LONG columns
df[["LAT", "LONG"]] = df["LAT LONG"].apply(extract_lat_long)

# Optional: remove old combined column
df.drop(columns=["LAT LONG"], inplace=True)

# Save cleaned file
df.to_csv("data/cleaned/vi_lbs.csv", index=False)

print("✅ VI LBS cleaned successfully!")
print(df[["LAT", "LONG"]].head())
