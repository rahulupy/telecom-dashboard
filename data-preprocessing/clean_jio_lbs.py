import pandas as pd

# Read the CSV
df = pd.read_csv("data/raw/jio_lbs.csv")

# Remove extra spaces from column names
df.columns = df.columns.str.strip()

# Remove duplicate rows
df = df.drop_duplicates()

# Display basic information
print("\nShape of dataset:", df.shape)

print("\nColumn Names:")
print(df.columns.tolist())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nData Types:")
print(df.dtypes)

# Save cleaned file
df.to_csv("data/cleaned/jio_lbs_cleaned.csv", index=False)

print("\nJio LBS cleaned successfully!")
