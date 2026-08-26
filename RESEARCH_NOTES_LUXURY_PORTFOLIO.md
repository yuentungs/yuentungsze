# Luxury Product Portfolio — Research Notes

**Research capture date:** 2026-08-26 (GMT+8)

This note records the externally verified inputs used in the public-facing portfolio. It distinguishes sourced observations from portfolio-model assumptions.

## 1. Product assortment observations

| Brand | Sourced observation | Portfolio interpretation | Source |
| --- | --- | --- | --- |
| Cartier | The official US jewellery catalogue separates High Jewelry and Jewelry, lists core categories including bracelets, rings, necklaces, earrings and bridal, and exposes collection-level navigation across icons such as LOVE, Juste un Clou, Trinity, Panthère de Cartier and Clash de Cartier. | Cartier uses a broad, icon-led architecture spanning accessible precious entry points, statement creations, bridal and high jewellery. | [Cartier: All Jewelry](https://www.cartier.com/en-us/jewelry/all-collections/) |
| Cartier | On the official US catalogue capture, sampled price points ranged from a LOVE Unlimited ring at USD 2,670 to a Juste un Clou small diamond bracelet at USD 7,350 and a paved Trinity cushion ring at USD 30,300. | These examples are used only to illustrate a price ladder, not to estimate revenue, sell-through or global price parity. | [Cartier: All Jewelry](https://www.cartier.com/en-us/jewelry/all-collections/) |
| Van Cleef & Arpels | The US site presents High Jewelry, Jewelry, Wedding & Celebrations and Watches. Its Alhambra collection page identifies the motif as an emblem of luck created in 1968, and shows category extension into necklaces, bracelets, rings, earrings and watches. | Van Cleef & Arpels uses a motif-first architecture: an emotionally legible visual code is scaled through formats, materials and price tiers. | [VCA: Alhambra](https://www.vancleefarpels.com/us/en/collections/jewelry/alhambra.html) |
| Van Cleef & Arpels | At capture, the official Alhambra collection page displayed 204 creations and a USD 1,630–206,000 range. | The portfolio uses this as evidence of a wide ladder within a single signature code. It does not assert availability or price in any other market. | [VCA: Alhambra](https://www.vancleefarpels.com/us/en/collections/jewelry/alhambra.html) |

## 2. Southeast Asia market inputs

### World Bank macroeconomic data

The repository contains a reproducible World Bank API fetcher at `scripts/fetch_market_indicators.py`. The latest values returned on 2026-08-26 are held in `assets/data/sea_market_indicators.csv` and are used in the interactive country comparison.

| Market | GDP per capita (current USD) | Data year | Population | GDP growth | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Singapore | 98,813.98 | 2025 | 6,111,175 | 5.03% | Same-year macro data from World Bank API. |
| Thailand | 8,056.56 | 2025 | 71,619,863 | 2.44% | Same-year macro data from World Bank API. |
| Malaysia | 13,124.56 | 2025 | 35,977,838 | 5.17% | Same-year macro data from World Bank API. |
| Indonesia | 5,059.63 | 2025 | 285,721,236 | 5.11% | Same-year macro data from World Bank API. |

> Tourism arrival series are not current and comparable for every market in the World Bank indicator feed. The website therefore uses tourism as a qualitative route-to-market and clienteling consideration, rather than making a false-precision numerical ranking.

### Wealth and gold context

| Input | Definition and use | Source |
| --- | --- | --- |
| HNWI proxy | The market scorecard uses **wealth depth** rather than country HNWI headcounts. Singapore is assessed as a regional wealth-management and clienteling hub; Thailand, Malaysia and Indonesia are assessed for local affluent density and growth. This avoids mixing inconsistent wealth definitions. | [Henley, World’s Wealthiest Cities Report 2025](https://www.henleyglobal.com/publications/wealthiest-cities-2025) |
| HNWI definition | Henley/New World Wealth defines a millionaire as an individual with at least USD 1m in liquid investable wealth, excluding real estate. This definition is included in the source reference so it is not confused with net-worth or income statistics. | [Henley methodology](https://www.henleyglobal.com/publications/wealthiest-cities-2025) |
| Gold sensitivity | Gold is treated as a shared material-cost driver in the simulator and as a country-level behavioural lens, not as four separate spot prices. The World Gold Council data page is the reference for country/sector gold-demand data. | [World Gold Council: Gold demand by country](https://www.gold.org/goldhub/data/gold-demand-by-country) |
| Tourism | Tourism is treated as a source of luxury exposure and clienteling opportunity. ASEAN provides a visitor-arrivals dashboard and Tourism Malaysia publishes an arrivals dashboard/statistics library. | [ASEAN Visitor Arrivals Dashboard](https://data.aseanstats.org/dashboard/tourism); [Tourism Malaysia Statistics](https://www.tourism.gov.my/statistics) |

## 3. Portfolio model assumptions

The pricing case is intentionally an **illustrative SKU-level contribution model**, not a representation of Cartier, Van Cleef & Arpels, Tiffany & Co. or any other brand’s confidential economics. Default values are designed to make the math transparent:

| Variable | Default | Reason |
| --- | ---: | --- |
| Retail price | USD 9,800 | A realistic fine-jewellery ticket for a signature necklace case, not a quoted competitor price. |
| COGS | 31% of retail | Combines metal/stone, labour, manufacturing and packaging for modelling only. |
| Distribution | 5% of retail | Represents freight, insurance and payment/channel cost for modelling only. |
| Retail cost | 24% of retail | Represents store labour, rent and related selling costs for modelling only. |
| Marketing | 10% of retail | Represents launch and ongoing demand generation for modelling only. |
| Demand elasticity case | Price +10%; volume -5% | Demonstrates contribution sensitivity; it is not a forecast. |

## 4. Sources

1. [World Bank Open Data API — GDP per capita, population and GDP growth](https://api.worldbank.org/v2/country/SGP;THA;MYS;IDN/indicator/NY.GDP.PCAP.CD?format=json)
2. [Cartier — All Jewelry](https://www.cartier.com/en-us/jewelry/all-collections/)
3. [Van Cleef & Arpels — Alhambra](https://www.vancleefarpels.com/us/en/collections/jewelry/alhambra.html)
4. [Van Cleef & Arpels — Home](https://www.vancleefarpels.com/us/en/home.html)
5. [Henley & Partners — World’s Wealthiest Cities Report 2025](https://www.henleyglobal.com/publications/wealthiest-cities-2025)
6. [World Gold Council — Gold Demand by Country](https://www.gold.org/goldhub/data/gold-demand-by-country)
7. [ASEAN Visitor Arrivals Dashboard](https://data.aseanstats.org/dashboard/tourism)
8. [Tourism Malaysia Statistics](https://www.tourism.gov.my/statistics)
