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
