# Bingo site

Simple static bingo site that builds a random 5x5 bingo card from `words.txt`.

Features
- Random board each time you click "New Board" or reload
- Center cell is a FREE space and is automatically marked
- Click squares to mark them
- When a row, column, or diagonal completes, an overlay proclaims "BINGO!" with a simple confetti effect

Files
- `index.html` — main page
- `styles.css` — styles and animation
- `app.js` — logic: fetch `words.txt`, shuffle, build board, handle clicks
- `words.txt` — plain text list of words/phrases (one per line). Keep at least 24 lines; the center is FREE.

Run locally
1. From this directory, start a simple HTTP server. With Python 3:

```sh
python3 -m http.server 8000
```

2. Open your browser to `http://localhost:8000/`.

 Notes
 - The page fetches `words.txt` from the server; for security browsers won't load local files without a server.
 - Replace `words.txt` with your own list (one entry per line). At least 24 unique entries are recommended.
 - Exporting: Click the "Export PDF" button to capture the current board and download it as a PDF. This uses html2canvas and jsPDF delivered from CDN; you must be online the first time to fetch those libraries (or download and host them locally).
 - Persistence: The site saves the current board (words + marked squares) to your browser's localStorage. Marks and the chosen board will persist across reloads. Use the "Clear Saved" button to clear the saved board and generate a new one.
 - Offline vendor copies: To make the Export PDF feature work fully offline, you can download the required libraries locally into `vendor/`.
	 A helper script `scripts/fetch_vendors.sh` is included to fetch the minified files from CDNJS into `vendor/`.

	 From the project root run:

	 ```sh
	 sh scripts/fetch_vendors.sh
	 ```

	 After that, the page will load `vendor/html2canvas.min.js` and `vendor/jspdf.umd.min.js` instead of the CDN versions. If the local files are not present the page will automatically fall back to the CDN.

	Configuration
	-------------

	You can customize the site by editing `config.json` in the project root. Available options:

	- `boardTitle` — string shown as the page title (default: "Bingo!")
	- `freeTileName` — string used for the center tile (default: "FREE")
	- `headerImage` — optional path or URL to an image/logo shown above the title (default: empty)
	- `colors` — object of color hex values to override UI colors. Supported keys:
		- `bg`, `card`, `accent`, `marked`, `text`

	Example `config.json`:

	```json
	{
		"boardTitle": "Office Bingo",
		"freeTileName": "FREE SPACE",
		"headerImage": "logo.png",
		"colors": {
			"bg": "#081226",
			"card": "#071026",
			"accent": "#ff9f1c",
			"marked": "#14b8a6",
			"text": "#f1f5f9"
		}
	}
	```

	After editing `config.json`, refresh the page. The site loads the config on startup and applies the settings.

Enjoy!
