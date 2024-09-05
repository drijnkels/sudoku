## Wingu Sudoku
A simple Sudoku app meant to work well on a mobile device without all the ads. A work in progress, currently the app 
is usable and the puzzles can be solved. Progress is stored locally on a single device.

Play on: https://sudoku.wingusol.com/

### Features
- Error detection after the next move
- 3 Levels of hints, Cell indication, Strategy Suggestion, Digit or notes suggested
- 4 difficulty levels
- Mobile / Tablet friendly
- Notes
- Progress saved in localStorage on a single device


### Development
**Wishlist for v1:**
- Add a timer

**Wishlist future**
- Conflict detection
- Increase number of Sudoku available (Open source lib?) or use a generator
- Add [capacitorjs](https://capacitorjs.com) + turn into PWA
- Settings
  - Turn error detection on/off
  - Turn conflict detection on/off
  - Auto generate notes?
- Add keyboard support

**Recently finished**
- Layout updated
- Hints added
- Solve board uses more strategies

## Running locally

Clone the repository and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start playing
