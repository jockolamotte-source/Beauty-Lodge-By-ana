Beauty Lodge by Anna — Hybrid Service Update

UPLOAD THESE FILES TO GITHUB:
- index.html -> repository root
- script.js -> repository root
- assets/card-fullset.jpg -> assets/
- assets/card-naturalrefill.jpg -> assets/
- assets/card-hybrid.jpg -> assets/
- assets/card-hybrid-refill.jpg -> assets/

PRICES VERIFIED IN index.html:
- Natural Full Set: $140
- Natural Refill: $65
- Hybrid: $150
- Hybrid Refill: $70
- Volume Set: $155
- Volume Refill: $75

LASH STYLE PICKER VERIFIED IN script.js:
- Lash Lift & Tint: $100
- Natural Full Set: $140
- Volume Set: $155

IMAGE MAPPING:
- card-fullset.jpg = first new Natural image supplied
- card-naturalrefill.jpg = second new Natural image supplied
- card-hybrid-refill.jpg = reused prior Natural card image, per request
- card-hybrid.jpg = TEMPORARY prior Natural image because the separate Hybrid photo was not attached with this request.

When you have the actual Hybrid photo, rename it exactly:
    card-hybrid.jpg
and replace assets/card-hybrid.jpg in GitHub. No HTML or JavaScript changes will be required.

NOTE ON DURATIONS:
The request specified prices but not durations for the new Hybrid services. This package uses:
- Hybrid: 1 hr 45 min
- Hybrid Refill: 1 hr 15 min
Change those two values in index.html if Anna's booking durations differ.

The service availability JavaScript defaults unknown service IDs to available, so Hybrid and Hybrid Refill will display even if assets/services.json has not been updated yet. If you later want the GitHub service-management workflow to hide/disable these services, add hybridSet and hybridRefill to that configuration.
