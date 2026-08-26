#!/usr/bin/env python3
"""Fetch latest comparable macro indicators from the World Bank API.

Outputs a small audited JSON/CSV dataset for the Luxury Product Portfolio.
Indicators:
- NY.GDP.PCAP.CD: GDP per capita (current USD)
- SP.POP.TOTL: total population
- ST.INT.ARVL: international tourism arrivals
- NY.GDP.MKTP.KD.ZG: GDP growth (annual %)
"""
from __future__ import annotations

import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

COUNTRIES = {
    "SGP": "Singapore",
    "THA": "Thailand",
    "MYS": "Malaysia",
    "IDN": "Indonesia",
}
INDICATORS = {
    "gdp_per_capita_usd": "NY.GDP.PCAP.CD",
    "population": "SP.POP.TOTL",
    "tourism_arrivals": "ST.INT.ARVL",
    "gdp_growth_pct": "NY.GDP.MKTP.KD.ZG",
}
BASE_URL = "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}"
OUT_DIR = Path(__file__).resolve().parents[1] / "assets" / "data"


def latest_value(country_code: str, indicator: str) -> dict[str, Any]:
    response = requests.get(
        BASE_URL.format(country=country_code, indicator=indicator),
        params={"format": "json", "per_page": 100},
        timeout=30,
    )
    response.raise_for_status()
    payload = response.json()
    observations = payload[1] if isinstance(payload, list) and len(payload) > 1 else []
    for observation in observations:
        value = observation.get("value")
        if value is not None:
            return {
                "value": value,
                "year": int(observation["date"]),
                "source": "World Bank Open Data",
                "indicator": indicator,
            }
    return {"value": None, "year": None, "source": "World Bank Open Data", "indicator": indicator}


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    captured_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    rows: list[dict[str, Any]] = []
    raw: dict[str, Any] = {"captured_at_utc": captured_at, "markets": {}}

    for code, market in COUNTRIES.items():
        values = {key: latest_value(code, indicator) for key, indicator in INDICATORS.items()}
        raw["markets"][code] = {"market": market, **values}
        rows.append(
            {
                "market": market,
                "country_code": code,
                "gdp_per_capita_usd": values["gdp_per_capita_usd"]["value"],
                "gdp_per_capita_year": values["gdp_per_capita_usd"]["year"],
                "population": values["population"]["value"],
                "population_year": values["population"]["year"],
                "tourism_arrivals": values["tourism_arrivals"]["value"],
                "tourism_arrivals_year": values["tourism_arrivals"]["year"],
                "gdp_growth_pct": values["gdp_growth_pct"]["value"],
                "gdp_growth_year": values["gdp_growth_pct"]["year"],
            }
        )

    json_path = OUT_DIR / "sea_market_indicators.json"
    csv_path = OUT_DIR / "sea_market_indicators.csv"
    json_path.write_text(json.dumps(raw, indent=2), encoding="utf-8")
    with csv_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {json_path}")
    print(f"Wrote {csv_path}")


if __name__ == "__main__":
    main()
