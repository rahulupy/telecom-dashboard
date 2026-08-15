import pandas as pd
from pathlib import Path

files = [
    "data/cleaned/airtel_cdr.csv",
    "data/cleaned/bsnl_cdr.csv",
    "data/cleaned/vi_cdr.csv",
]

for file in files:
    df = pd.read_csv(file)

    # Convert call_time to datetime
    df["call_time"] = pd.to_datetime(
        df["call_time"],
        format="%H:%M:%S",
        errors="coerce"
    )

    # Convert duration to numeric (seconds)
    df["duration"] = pd.to_numeric(df["duration"], errors="coerce")

    # Calculate end_time
    df["end_time"] = (
        df["call_time"] + pd.to_timedelta(df["duration"], unit="s")
    ).dt.strftime("%H:%M:%S")

    # Convert call_time back to HH:MM:SS
    df["call_time"] = df["call_time"].dt.strftime("%H:%M:%S")

    # Save back to the same file
    df.to_csv(file, index=False)

    print(f"✅ Updated: {Path(file).name}")

print("\n🎉 End time added successfully!")
