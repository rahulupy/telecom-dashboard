import pandas as pd
import re

# Load raw BSNL LBS
df = pd.read_csv("data/raw/bsnl_lbs.csv")

# Remove extra spaces from column names
df.columns = df.columns.str.strip()

# Remove duplicate rows
df.drop_duplicates(inplace=True)

# Extract latitude and longitude from LAT LONG column


def extract_lat_long(value):
    if pd.isna(value):
        return pd.Series([None, None])

    value = str(value)

    coords = re.findall(r'-?\d+\.\d+', value)

    if len(coords) >= 2:
        return pd.Series([coords[0], coords[1]])

    return pd.Series([None, None])


# Create separate LAT and LONG columns
df[["LAT", "LONG"]] = df["LAT LONG"].apply(extract_lat_long)

# Remove old combined column
df.drop(columns=["LAT LONG"], inplace=True)

# Drop rows only if essential localization fields are missing
df.dropna(
    subset=[
        "MSISDN",
        "TS",
        "Cell ID",
        "LAT",
        "LONG"
    ],
    inplace=True
)

# Reset index
df.reset_index(drop=True, inplace=True)

# Save cleaned file
df.to_csv("data/cleaned/bsnl_lbs.csv", index=False)

print("✅ BSNL LBS cleaned successfully!")
print(df.head())
