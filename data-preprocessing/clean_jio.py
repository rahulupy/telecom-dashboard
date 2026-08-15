import pandas as pd

# Load Jio CDR
jio_cdr = pd.read_csv("data/raw/jio_cdr.csv", skiprows=18)

# Remove duplicate rows
jio_cdr.drop_duplicates(inplace=True)

# Remove extra spaces from column names
jio_cdr.columns = jio_cdr.columns.str.strip()

# Check missing values
print("\nMissing Values:")
print(jio_cdr.isnull().sum())

# Check data types
print("\nData Types:")
print(jio_cdr.dtypes)

# Save cleaned file
jio_cdr.to_csv("data/cleaned/jio_cdr_cleaned.csv", index=False)

print("\nJio CDR cleaned successfully!")
print("Final Shape:", jio_cdr.shape)
