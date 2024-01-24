## Simple Sudoku
A simple Sudoku app meant to work well on a mobile device without all the ads. Currently, a work in progress.

**Todos:**
- Error check on each new digit entered with actual solutions
- Store progress per Sudoku
- Add a timer
- Increase number of Sudoku available (Open source lib?)
- Sort Sudoku by difficulty
- Hints?

**Recently finished**
- Make the app mobile / tablet friendly
- Indicate that note mode is active by turning buttons green
- Let users switch Sudokus
- Obvious error checks of a new digit with already entered digits
- Remove notes on new digit
- Add label and turn board green on completion

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
