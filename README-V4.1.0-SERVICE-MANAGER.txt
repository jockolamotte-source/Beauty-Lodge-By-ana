Beauty Lodge by Anna — V4.1.0 Service Manager
================================================

WHAT CHANGED
- assets/services.json is now the single source of truth for service availability, price, duration, and optional special pricing.
- Service cards load those values automatically.
- Find Your Lash Style uses the same values, so prices cannot drift between the card and lash picker.
- GitHub Actions > Manage Website Services can change these settings without editing code.

HOW TO CHANGE A PRICE
1. Open the repository on GitHub.
2. Click Actions.
3. Open Manage Website Services.
4. Click Run workflow.
5. Select the service.
6. Leave Availability on Keep current.
7. Enter a price such as 70 or $70.
8. Leave fields you do not want to change blank.
9. Click Run workflow.

HOW TO CHANGE DURATION
Use the same workflow and enter text such as: 1 hr 30 min

HOW TO RUN A SPECIAL
Enter a Special price. The website will show the regular price crossed out next to the special price.
To remove the special later, enter CLEAR in the Special price field.

AVAILABILITY
The same workflow can mark a service Available, Temporarily unavailable, or Hidden.

IMPORTANT
This changes the Beauty Lodge website only. It does not change pricing inside Setmore.
