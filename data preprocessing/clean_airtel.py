import pandas as pd

# Load Airtel CDR
airtel_cdr = pd.read_csv("data/raw/airtel_cdr.csv", skiprows=6)

# Remove duplicate rows
airtel_cdr.drop_duplicates(inplace=True)

# Remove extra spaces from column names
airtel_cdr.columns = airtel_cdr.columns.str.strip()

# Check missing values
print("\nMissing Values:")
print(airtel_cdr.isnull().sum())

# Check data types
print("\nData Types:")
print(airtel_cdr.dtypes)

# Save cleaned file
airtel_cdr.to_csv("data/cleaned/airtel_cdr_cleaned.csv", index=False)

print("\n✅ Airtel CDR cleaned successfully!")
print("Final Shape:", airtel_cdr.shape)
