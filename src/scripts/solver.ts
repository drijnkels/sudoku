import {Board} from "@/types/types";
import {getAllNotes, removeNotesAfterDigit, testMove} from "@/scripts/utils";
import cell from "@/components/Board/Cell";

const getCellsInBlock = (r: number, c: number, boardData: Board) => {
  const first_r = Math.floor(r / 3) * 3;
  const first_c = Math.floor(c / 3) * 3;
  const square = [];

  // Check square
  for (let r = first_r; r < first_r + 3; r++) {
    for (let c = first_c; c < first_c + 3; c++) {
      let cellCopy = boardData[r][c];
      cellCopy.r = r;
      cellCopy.c = c;
      square.push(cellCopy);
    }
  }

  return square
}

export const mediumSolver = (boardState: Board, solutionBoard: Board) => {
  let empty_cells = true;
// Get all notes in the current board
  let boardWithNotes = getAllNotes(boardState);
  let changedBoard = false;

  // while (empty_cells) {
  for(let rounds = 0; rounds < 1; rounds++){
    let rows_with_empty_cells = 0;
    for (let r = 0; r < 9; r++) {
      if (boardState[r].find((c) => c.digit == 0) ) {
        rows_with_empty_cells++;
      }
    }

    if (rows_with_empty_cells == 0) {
      console.log('Board complete');
      empty_cells = false;
      break;
    }

    if (!boardWithNotes) {
      empty_cells = false;
      console.error('Error in board with notes');
      break;
    }

    // Check all cell to see if they have only one note left
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (boardWithNotes[r][c].digit === 0 && boardWithNotes[r][c].notes.length == 1) {
          const newDigit = boardWithNotes[r][c].notes[0];

          if (!testMove(solutionBoard, {r: r, c: c}, newDigit)) {
            console.error('Invalid solution')
            return
          }

          // Update the cell with the new digit
          boardWithNotes[r][c].digit = newDigit;
          boardWithNotes[r][c].notes = [];

          // Update notes in the row, column and block to remove the digit
          boardWithNotes = removeNotesAfterDigit(boardWithNotes, {r: r, c: c}, newDigit);
          changedBoard = true;
          break;
        }
      }
    }

    // For each cell see if it has a unique digit in its notes
    for (let r = 0; r < 9; r++) {

      const checkedRowDigits: Set<number> = new Set();
      for (let c = 0; c < 9; c++) {

        if (boardWithNotes[r][c].digit !== 0) {
          continue;
        }

        const cellNotes = boardWithNotes[r][c].notes;

        // For each note on a cell check the row if any other cell has it in their notes too
        for (let cellNote of cellNotes) {
          // Ignore already checked digits
          // if (checkedRowDigits.has(cellNote)) {
          //   continue;
          // }

          let unique_digit = true;

          // Check all the neighbour cells to check if they contain
          for (let nc = 0; nc < 9; nc++) {
            // Ignore cells with no notes and the current cell
            if (boardWithNotes[r][nc].digit !== 0 || nc == c) {
              continue;
            }

            // Found the digit in another cell's note than it cannot be unique
            if (boardWithNotes[r][nc].notes.indexOf(cellNote) > -1) {
              checkedRowDigits.add(cellNote);
              nc = 9;
              unique_digit = false;
              break;
            }
          }

          // If we found a unique digit in the notes for a row assign that digit to the current cell and move on
          if (unique_digit) {
            if (!testMove(solutionBoard, {r: r, c: c}, cellNote)) {
              console.error('Invalid solution')
              return
            }

            boardWithNotes[r][c].digit = cellNote;
            boardWithNotes[r][c].notes = [];
            boardWithNotes = removeNotesAfterDigit(boardWithNotes, {r: r, c: c}, cellNote);
            changedBoard = true;
            break;
          }

          // Reset unique flag for column
          unique_digit = true;

          // Check columns
          for (let nr = 0; nr < 9; nr++) {
            // Skip same row or already filled cells
            if (nr == r || boardWithNotes[nr][c].digit !== 0) {
              continue;
            }

            // Found the digit in another cell's note than it cannot be unique
            if (boardWithNotes[nr][c].notes.indexOf(cellNote) > -1) {
              nr = 12;
              unique_digit = false;
              break;
            }
          }

          // If we found a unique digit in the notes for a column assign that digit to the current cell and move on
          if (unique_digit) {
            if (!testMove(solutionBoard, {r: r, c: c}, cellNote)) {
              console.error('Invalid solution')
              return
            }

            boardWithNotes[r][c].digit = cellNote;
            boardWithNotes[r][c].notes = [];
            boardWithNotes = removeNotesAfterDigit(boardWithNotes, {r: r, c: c}, cellNote);
            changedBoard = true;
            break;
          }

          // Reset unique flag for block
          unique_digit = true;

          // Check block
          const cellsInBlock = getCellsInBlock(r, c, boardWithNotes);
          for (let cellInBlock of cellsInBlock) {
            if ((cellInBlock.r == r && cellInBlock.c == c) || cellInBlock.digit !== 0) {
              continue;
            }

            // Found the digit in another cell's note than it cannot be unique
            if (cellInBlock.notes.indexOf(cellNote) > -1) {
              unique_digit = false;
              break;
            }
          }

          // If we found a unique digit in the notes for a block assign that digit to the current cell and move on
          if (unique_digit) {
            if (!testMove(solutionBoard, {r: r, c: c}, cellNote)) {
              console.error('Invalid solution')
              return
            }

            boardWithNotes[r][c].digit = cellNote;
            boardWithNotes[r][c].notes = [];
            boardWithNotes = removeNotesAfterDigit(boardWithNotes, {r: r, c: c}, cellNote);
            changedBoard = true;
            break;
          }
        }
      }
    }

    if (!changedBoard) {
      console.warn('No move was found');
      empty_cells = false;
      break;
    }
  }

  return boardWithNotes;
}

export const easySolver = (boardState: Board, solutionBoard: Board) => {
  let empty_cells = true;
  let boardWithNotes = getAllNotes(boardState);
  let changedBoard = false;

  while (empty_cells) {
    let rows_with_empty_cells = 0;
    for (let r = 0; r < 9; r++) {
      if (boardState[r].find((c) => c.digit == 0)) {
        rows_with_empty_cells++;
      }
    }

    if (rows_with_empty_cells == 0) {
      console.log('Board complete');
      empty_cells = false;
      break;
    }

    if (!boardWithNotes) {
      empty_cells = false;
      console.error('Error in board with notes');
      break;
    }

    // Check all cell to see if they have only one note left
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (boardWithNotes[r][c].digit === 0 && boardWithNotes[r][c].notes.length == 1) {
          const newDigit = boardWithNotes[r][c].notes[0];

          if (!testMove(solutionBoard, {r: r, c: c}, newDigit)) {
            console.error('Invalid solution')
            return
          }

          // Update the cell with the new digit
          boardWithNotes[r][c].digit = newDigit;
          boardWithNotes[r][c].notes = [];

          // Update notes in the row, column and block to remove the digit
          boardWithNotes = removeNotesAfterDigit(boardWithNotes, {r: r, c: c}, newDigit);
          changedBoard = true;
          break;
        }
      }
    }

    if (!changedBoard) {
      console.warn('No move was found, not an easy board');
      empty_cells = false;
      break;
    }
  }

  return boardWithNotes;
}