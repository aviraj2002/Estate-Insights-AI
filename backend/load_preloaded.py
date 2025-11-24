from api.utils import parse_excel_to_rows, save_processed_json
parse_path = "media/datasets/dataset.xlsx"
rows = parse_excel_to_rows(parse_path)
save_processed_json(rows)
print("Processed rows:", len(rows))
