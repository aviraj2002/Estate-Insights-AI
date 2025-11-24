import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from pathlib import Path
from .utils import parse_excel_to_rows, save_processed_json, load_processed_json, group_avg_by_year
import pandas as pd

MEDIA_DIR = Path(settings.MEDIA_ROOT)
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

@csrf_exempt
def upload_file(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST allowed")

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file provided"}, status=400)

    file = request.FILES["file"]
    datasets_dir = MEDIA_DIR / "datasets"
    datasets_dir.mkdir(parents=True, exist_ok=True)
    save_path = datasets_dir / file.name
    with open(save_path, "wb") as f:
        for chunk in file.chunks():
            f.write(chunk)

    try:
        rows = parse_excel_to_rows(save_path)
    except Exception as e:
        return JsonResponse({"error": "Failed to parse Excel", "details": str(e)}, status=500)

    save_processed_json(rows)
    areas = sorted({str(r.get("Area", "")).strip() for r in rows if r.get("Area")})

    return JsonResponse({
        "message": "Uploaded and processed",
        "rows_count": len(rows),
        "areas": areas
    })

def list_areas(request):
    rows = load_processed_json()
    areas = sorted({str(r.get("Area", "")).strip() for r in rows if r.get("Area")})
    return JsonResponse({"areas": areas})

def analyze(request):
    primary = request.GET.get("primary", "").strip()
    comparison = request.GET.get("comparison", "").strip()

    rows = load_processed_json()
    if not rows:
        return JsonResponse({"error": "No dataset loaded"}, status=400)

    def filter_rows(area):
        if not area:
            return rows
        return [r for r in rows if str(r.get("Area", "")).strip().lower() == area.lower()]

    def trends_for(area_rows):
        if not area_rows:
            return {"rows": [], "priceTrend": [], "demandTrend": []}
        priceTrend = []
        demandTrend = []
        df = pd.DataFrame(area_rows)
        if "Year" in df.columns and "Price" in df.columns:
            grp = df.groupby("Year")["Price"].mean().reset_index().sort_values("Year")
            priceTrend = [{"year": int(r["Year"]), "avgPrice": float(r["Price"])} for _, r in grp.iterrows()]
        if "Year" in df.columns and "Demand" in df.columns:
            gd = df.groupby("Year")["Demand"].mean().reset_index().sort_values("Year")
            demandTrend = [{"year": int(r["Year"]), "avgDemand": float(r["Demand"])} for _, r in gd.iterrows()]

        return {"rows": area_rows, "priceTrend": priceTrend, "demandTrend": demandTrend}

    primary_rows = filter_rows(primary)
    comparison_rows = filter_rows(comparison)

    result = {
        "summaryInput": {"primary": primary, "comparison": comparison},
        "primary": trends_for(primary_rows),
        "comparison": trends_for(comparison_rows),
    }
    return JsonResponse(result, safe=False)

def price_growth(request):
    location = request.GET.get("location", "").strip()
    years = int(request.GET.get("years", 3))
    rows = load_processed_json()
    if not rows:
        return JsonResponse({"error": "No dataset loaded"}, status=400)

    filtered = [r for r in rows if str(r.get("Area", "")).strip().lower() == location.lower()]
    if not filtered:
        return JsonResponse({"error": "Location not found", "location": location}, status=404)

    df = pd.DataFrame(filtered)
    if "Year" not in df.columns or "Price" not in df.columns:
        return JsonResponse({"error": "Dataset missing Year or Price columns"}, status=400)

    grp = df.groupby("Year")["Price"].mean().reset_index().sort_values("Year")
    grp_list = [{"year": int(r["Year"]), "avgPrice": float(r["Price"])} for _, r in grp.iterrows()]

    if len(grp_list) < 2:
        growth = 0.0
    else:
        recent = grp_list[-years:]
        if len(recent) >= 2:
            start = recent[0]["avgPrice"]
            end = recent[-1]["avgPrice"]
            growth = ((end - start) / start * 100) if start else 0.0
        else:
            growth = 0.0

    return JsonResponse({"location": location, "trend": grp_list, "growthPercentage": growth})
