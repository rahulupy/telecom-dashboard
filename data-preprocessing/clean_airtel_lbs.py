import pandas as pd

# Load raw Airtel LBS
df = pd.read_csv("data/raw/airtel_lbs.csv")

# Remove extra spaces from column names
df.columns = df.columns.str.strip()

# Remove duplicate rows
df.drop_duplicates(inplace=True)

# Drop rows only if essential localization fields are missing
df.dropna(
    subset=[
        "MSISDN",
        "Last Activity",
        "CGI",
        "Lat",
        "Long"
    ],
    inplace=True
)

# Reset index
df.reset_index(drop=True, inplace=True)

# Save cleaned file
df.to_csv("data/cleaned/airtel_lbs.csv", index=False)

print("✅ Airtel LBS cleaned successfully!")
print(df.isnull().sum())
