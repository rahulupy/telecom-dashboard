import pandas as pd

# Load BSNL CDR
bsnl_cdr = pd.read_csv("data/raw/bsnl_cdr.csv", skiprows=5)

# Remove duplicate rows
bsnl_cdr.drop_duplicates(inplace=True)

# Remove extra spaces from column names
bsnl_cdr.columns = bsnl_cdr.columns.str.strip()

# Check missing values
print("\nMissing Values:")
print(bsnl_cdr.isnull().sum())

# Check data types
print("\nData Types:")
print(bsnl_cdr.dtypes)

# Save cleaned file
bsnl_cdr.to_csv("data/cleaned/bsnl_cdr_cleaned.csv", index=False)

print("\n✅ BSNL CDR cleaned successfully!")
print("Final Shape:", bsnl_cdr.shape)
