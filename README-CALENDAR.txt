BEAUTY LODGE CALENDAR SYNC

Upload every file and folder in this package to the root of the GitHub repository.
The .github folder must also be uploaded.

This setup does not use Google Cloud or an API key.

How it works:
1. Anna adds or edits events in the public Google Calendar.
2. GitHub Actions checks the calendar every 15 minutes.
3. The workflow updates assets/events.json.
4. The website automatically creates the event cards from that local file.

After uploading:
1. Open the repository on GitHub.
2. Open the Actions tab.
3. Select "Update Beauty Lodge Calendar".
4. Click "Run workflow" once to populate the first calendar sync.

GitHub scheduled workflows can occasionally run a few minutes late.
