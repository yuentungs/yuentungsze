# Validation Notes — Luxury Product Portfolio

## Local browser verification

| Check | Result | Evidence |
| --- | --- | --- |
| Chinese default rendering | Passed | The local `portfolio.html` loads in Traditional Chinese without duplicate English content after changing the selector to `[lang^="zh"]`. |
| English language switch | Passed | The language control switched all visible interface and case-study content into English, and the control label changed to `中文`. |
| Hero / desktop hierarchy | Passed | The hero presents an editorial dark atelier layout, primary navigation, three case links and an immediate Project 01 entry without overlap. |
| Source links | Passed | The five source links are exposed at the bottom of the document and the inline numbered citations appear in the relevant cases. |
| Pricing defaults | Passed | With the default case—US$9,800 price, +10% scenario price and −5% volume—the dynamic model computes US$294,000 baseline contribution, US$336,091 scenario contribution, a contribution-rate move from 30.0% to 32.8%, and a +14.3% total-contribution change. |

**Remaining validation:** verify slider event response, mobile layout and final GitHub Pages deployment.
| Pricing slider event | Passed | Changing the English scenario from +10% price / −5% volume to +15% / −8% refreshed the display to 92 units, US$352,976 scenario contribution, 34.0% contribution rate and +20.1% contribution change. |
| GitHub Pages deployment | Passed | Commit `80f8bde` was pushed to `main`. GitHub Pages reported `built`, and the public portfolio URL returned the new bilingual Luxury Product Portfolio with the three case links and active pricing controls. |
| Site-style alignment refresh | Passed locally | The revised portfolio now uses the site’s white sticky header, lapis-blue primary color, gold accent line/button detail, pale blue-grey background, Georgia headings, rounded white cards and restrained shadows. The local hero and Project 01 layout visually align with the existing homepage design language. |
| Public style refresh | Passed | After cache-busting the stylesheet reference, the public GitHub Pages portfolio loaded the intended white header, pale blue-grey page background, lapis-blue headings and controls, gold accent details, Georgia typography, rounded white cards and soft shadows consistent with the existing YT homepage. |
| Unit-volume and COGS controls | Passed locally | Case 03 now presents five inputs: baseline units, unit COGS, base retail price, price change and volume change. At the default 100 units and US$3,000 COGS, the model recalculates US$297,800 baseline contribution, US$339,701 scenario contribution and a +14.1% contribution change. |
| Unit-volume and COGS scenario response | Passed locally | Changing the model to 200 baseline units and US$4,000 unit COGS updated the scenario to 190 units, US$395,600 baseline contribution, US$489,402 scenario contribution, 20.2% / 23.9% contribution rates and a +23.7% contribution change. |
| Public model-control availability | Passed | The deployed Case 03 presents baseline units and unit COGS sliders alongside price and volume assumptions. A public 200-unit / US$4,000 COGS scenario recalculated to 190 scenario units, US$395,600 baseline contribution, US$489,402 scenario contribution and a +23.7% contribution change. |
| Distribution and retail-rate controls | Passed locally | With distribution cost rate set to 10.0% and retail cost rate set to 30.0%, the model calculated US$98,000 / US$294,000 baseline costs and US$102,410 / US$307,230 scenario costs. Gross-margin rates remained 69.4% / 72.2%; final contributions updated to US$190,000 / US$227,050. |
| Public cost-rate controls | Passed | A public-page scenario of 10.0% distribution cost rate and 30.0% retail cost rate recalculated to US$98,000 / US$294,000 baseline costs, US$102,410 / US$307,230 scenario costs, 69.4% / 72.2% gross-margin rates and US$190,000 / US$227,050 final contributions. |
| Combined retail-cost control | Passed locally | A retail-cost rate including marketing of 40.0% produced US$392,000 / US$409,640 retail-cost lines, US$239,000 / US$278,255 final contributions and a +16.4% contribution change. No separate marketing row is rendered. |
| Public combined retail-cost model | Passed | GitHub Pages shows the retail-cost slider and P&L row as including marketing at a 34.0% default rate. The public baseline / scenario retail-cost values are US$333,200 / US$348,194; no independent marketing row is displayed. |
