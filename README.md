# Lumen

An installable, mobile-first emotional scrapbook and wellbeing PWA. It uses plain HTML, CSS, and JavaScript, so hosting requires no build step or paid service.

**Live demo:** [Open Lumen](https://lumen-rishika.yuvrajv474.chatgpt.site)

**Submission profile:** Rishika

Lumen is for students, young professionals, and anyone who wants a creative space to capture feelings, keep meaningful moments, and discover activities that help. Its scrapbook approach combines emotional check-ins, photos, music, drawings, memories, and playful pauses.

## Project structure

- `index.html`: app entry point and mobile metadata
- `styles.css`: responsive interface, scrapbook styling, and animations
- `app.js`: core app shell, onboarding, and seeded demo content
- `features.js`: functional journal tools, recommendations, resets, games, and personal logs
- `manifest.webmanifest`, `service-worker.js`, and `icons/`: app installation and offline assets
- `serve.ps1`: local Windows server
- `tests/`: browser interaction checks

No API key, build step, or account registration is required to try the app.

## Run

Open `index.html` directly for a quick preview. PWA installation and offline support require serving the folder over HTTP/HTTPS.

If Python is installed, preview locally with:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a GitHub repository and upload all files from this folder.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main`, choose `/ (root)`, then save.
5. Open the Pages URL GitHub provides.

All paths are relative, so the app works correctly from a GitHub project subdirectory such as `username.github.io/lumen/`.

## Install on a phone

- Android/Chrome: open the hosted URL and choose **Install app** or use **Install Lumen** under the Me tab.
- iPhone/Safari: open the hosted URL, tap **Share**, then **Add to Home Screen**.

Once opened successfully online, the core app works offline through its service worker.

The app stores onboarding, check-ins, and journal entries in `localStorage`. Data stays on that device and browser. To restart the first-time experience, clear the site's local storage.

## Working interactive features

The submission profile is Rishika. Home offers different recommendations for each need, and Reset selects from 28 ideas using need, available time, location, and saved feedback. The selected duration drives a real countdown.

Journal supports up to six uploaded photos per entry, compressed locally for storage. Write, Photo dump, and Scrapbook allow song attachments, stickers, and finger/mouse drawing. Saved entries display their real attachments. Settings can export a JSON backup.

The song picker has a small curated collection and accepts Spotify track, album, and playlist share links. Spotify's official embed provides playback controls and an Open in Spotify link. This does not connect to a user's Spotify library or use the Spotify Web API. Playback requires internet and may be limited to previews or sign-in by Spotify.

Social Rhythm and Mental Nutrition accept and save personal logs. Pocket games include Flower Pairs, Bubble Garden, and a guided breathing circle. Reset and game feedback is stored and used to rank future activity suggestions.

## Local server on Windows

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1
```

Open `http://localhost:8080`. The browser test harness is at `http://localhost:8080/tests/browser.html`; it uses in-memory storage and does not alter your journal.
