import pandas as pd
import json
from django.conf import settings
from pathlib import Path

DATA_FILE = Path(settings.DATA_DIR) / "processed.json"

def save_processed_json(rows):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)

def load_processed_json():
    if not DATA_FILE.exists():
        return []
    import json
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_excel_to_rows(excel_file):
    df = pd.read_excel(excel_file, engine="openpyxl")
    df.columns = [str(c).strip() for c in df.columns]
    if "Year" in df.columns:
        df["Year"] = df["Year"].astype(int)
    if "Price" in df.columns:
        df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
    if "Demand" in df.columns:
        df["Demand"] = pd.to_numeric(df["Demand"], errors="coerce")
    rows = df.fillna("").to_dict(orient="records")
    return rows

def group_avg_by_year(rows, value_field):
    import pandas as pd
    df = pd.DataFrame(rows)
    if df.empty or "Year" not in df.columns or value_field not in df.columns:
        return []
    grouped = df.groupby("Year")[value_field].mean().reset_index().sort_values("Year")
    grouped_list = grouped.to_dict(orient="records")
    return [{"year": int(r["Year"]), value_field: float(r[value_field])} for r in grouped_list]
