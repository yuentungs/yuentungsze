# Editorial Redesign Validation Notes

| Page | Check | Result |
| --- | --- | --- |
| Home | Featured Insight appears above the editorial thesis, selected insight cards, Case Studies spotlight, Market Signal, data-tool CTA and author / contact CTA. The global navigation starts with Insights. | Passed locally |
| Insights | Editorial index shows taxonomy, a featured analysis, the published SEA employment analysis, an explicitly non-clickable Research Note, and clear paths to Case Studies and author credentials. | Passed locally |
| AI & Cost Restructuring article | Article header, Chinese-only generated table of contents, preserved bilingual source content, author module and related-reading links render correctly. | Passed locally |
| Market Dashboard | Global navigation, market-signal structure, World Bank dashboard CTA, market-observation cards and author CTA load locally. Chart library and chart instance are initialized; visual recheck follows asynchronous rendering. | Passed structurally |
| Market Dashboard chart | Resolved canvas-id collision by storing the Chart.js instance as `marketChartInstance`; the 2022–2026 bar chart now renders correctly. | Passed locally |
| Mobile Home (390px) | The header collapses to YT + Menu, while the editorial hero and Featured Insight remain readable without clipped text. | Passed locally |
| Mobile Case Studies (390px) | The portfolio header collapses to wordmark + Menu and the casebook hero, role lens and case index preserve a readable single-column flow. | Passed locally |
| Public Home | GitHub Pages serves the Insights-first editorial home, unified navigation, Featured Insight, case-study spotlight and Market Signal structure from commit `75beef7`. | Passed publicly |
| Public Market Dashboard | GitHub Pages serves the standalone dashboard and the 2022–2026 market-size bar chart correctly from commit `75beef7`. | Passed publicly |
| Chinese typography — Home | Computed styles confirm `JF Open Huninn` for the Chinese editorial title and `Noto Sans TC` for body copy. | Passed locally |
| Chinese typography — Case Studies | Computed styles confirm `JF Open Huninn` for Chinese case titles and `Noto Sans TC` for analytical body copy. English editorial typography remains available after language switching. | Passed locally |
| Chinese typography — Public Home | GitHub Pages computed styles confirm `JF Open Huninn` for the Chinese Hero title and `Noto Sans TC` for body copy from commit `45e2952`. | Passed publicly |
