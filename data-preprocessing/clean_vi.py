import pandas as pd

# Load cleaned VI CDR
df = pd.read_csv("data/cleaned/vi_cdr.csv")

# Rename columns to standard schema
df.rename(columns={
    "Target /A PARTY NUMBER": "msisdn",
    "B PARTY NUMBER": "other_party",
    "Call date": "call_date",
    "Call Initiation Time": "call_time",
    "Call Duration": "duration",
    "First Cell Global Id": "first_cell_id",
    "Last Cell Global Id": "last_cell_id",
    "CALL_TYPE": "call_type",
    "IMEI": "imei",
    "IMSI": "imsi",
    "Roaming Network/Circle": "circle"
}, inplace=True)

# Add end_time column (not available in VI CDR)
df["end_time"] = pd.NA

# Keep only the standardized columns
df = df[
    [
        "msisdn",
        "other_party",
        "call_date",
        "call_time",
        "end_time",
        "duration",
        "first_cell_id",
        "last_cell_id",
        "call_type",
        "imei",
        "imsi",
        "circle",
    ]
]

# Save standardized file
df.to_csv("data/cleaned/vi_cdr.csv", index=False)

print("✅ VI CDR standardized successfully!")
print(df.head())
