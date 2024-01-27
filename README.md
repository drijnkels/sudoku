## Wingu Sudoku
A simple Sudoku app meant to work well on a mobile device without all the ads. A work in progress, currently the app 
is usable and the puzzles can be solved. Progress is stored locally on a single device.
The app does not require an internet connection once downloaded.

Play on: https://sudoku.wingusol.com/

### Features
- Instant error detection
- 4 difficulty levels
- Mobile / Tablet friendly
- Notes
- Saves progress on a single device


### Development
**Todo for v1:**
- Add a timer
- Improve buttons size and location for mobile

**Todos future**
- Conflict detection
- Increase number of Sudoku available (Open source lib?) or use a generator
- Add [capacitorjs](https://capacitorjs.com) + turn into PWA
- Hints?
- Settings
  - Turn error detection on/off
  - Turn conflict detection on/off
  - Auto generate notes?
- Add keyboard support

**Recently finished**
- Store progress per Sudoku
- Clear progress on a puzzle
- Clear progress on the entire app
- Remove notes if a digit is entered on the same row, col or square
- Error check on each new digit entered with actual solution
- Indicate that note mode is active by turning buttons green
- Remove notes on new digit

## Running locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `/src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
