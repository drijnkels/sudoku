import {Board} from "@/types/types";
import {getAllNotes, removeNotesAfterDigit, testMove} from "@/scripts/utils";

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

  // Running the solver will reset all notes on the board, it does not account for naked triples
  // This means that the solve loop needs to run at least twice
  // Once to clear notes for triples and the second time to use the result of the triples

  // Get all notes in the current board
  let boardWithNotes = getAllNotes(boardState);
  let changedBoard = false;

  if ('error' in boardWithNotes) {
    console.error('Error in board with notes');
    return boardWithNotes
  }

  // Loop through the solving steps a max of 10 times before giving up
  for (let rounds = 0; rounds < 4; rounds++) {
    let rows_with_empty_cells = 0;
    let moves = [];

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

    // Check for solved Cells
    const solvedResult = fillSolvedCells(boardWithNotes, solutionBoard);
    if (solvedResult && solvedResult.made_changes) {
      changedBoard = solvedResult.made_changes
      moves = solvedResult.moves
    }

    // Detect Hidden Singles
    let singlesResult = solveHiddenSingles(boardWithNotes, solutionBoard)
    if (singlesResult && singlesResult.made_changes) {
      changedBoard = singlesResult.made_changes
      moves = [...moves, ...solvedResult.moves]
    }

    // Find Naked Pairs and eliminate notes
    const nakedPairResult = findNakedPairs(boardWithNotes)
    if (nakedPairResult && nakedPairResult.made_changes) {
      changedBoard = nakedPairResult.made_changes
    }

    const nakedTriplesResult = findNakedTriples(boardWithNotes)
    if (nakedTriplesResult && nakedPairResult.made_changes) {
      changedBoard = nakedTriplesResult.made_changes;
    }

    const pointing_doubles_triples = findPointingPairs(boardWithNotes)

    // If no changes were made to the board, the solver got stuck
    if (!changedBoard) {
      console.warn('No move was found');
      empty_cells = false;
      break;
    }
  }

  // Return the last state of the board after the solver did its thing
  return boardWithNotes;
}

/**
 * For any cell that has a single possible digit left fill in the cell and remove digit from neighbours
 * @param board
 * @param solution
 */
const fillSolvedCells = (board: Board, solution: Board) => {
  let made_changes = false;
  const moves = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].digit === 0 && [...board[r][c].notes].length == 1) {
        const newDigit = [...board[r][c].notes][0];

        moves.push(`Set row: ${r}, col: ${c} to ${newDigit} - solve`)

        if (!testMove(solution, {r: r, c: c}, newDigit)) {
          console.error('Invalid solution', {r: r, c: c}, newDigit)
          return
        }

        // Update the cell with the new digit
        board[r][c].digit = newDigit;
        board[r][c].notes.clear();

        // Update notes in the row, column and block to remove the digit
        board = removeNotesAfterDigit(board, {r: r, c: c}, newDigit);
        made_changes = true;
        break;
      }
    }
  }

  return {made_changes, moves}
}

/**
 * Find the Hidden Singles in a board, complete the cells and remove the digit from neighbours
 * @param board
 * @param solution
 */
export const solveHiddenSingles = (board, solution) => {
  let made_changes = false;
  const moves = [];

  for (let r = 0; r < 9; r++) {

    const checkedRowDigits: Set<number> = new Set();
    for (let c = 0; c < 9; c++) {

      if (board[r][c].digit !== 0) {
        continue;
      }

      const cellNotes = board[r][c].notes;

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
          if (board[r][nc].digit !== 0 || nc == c) {
            continue;
          }

          // Found the digit in another cell's note than it cannot be unique
          if (board[r][nc].notes.has(cellNote)) {
            checkedRowDigits.add(cellNote);
            nc = 9;
            unique_digit = false;
            break;
          }
        }

        // If we found a unique digit in the notes for a row assign that digit to the current cell and move on
        if (unique_digit) {
          if (!testMove(solution, {r: r, c: c}, cellNote)) {
            console.error('Invalid solution')
            return
          }

          moves.push(`Set Row: ${r}, Col: ${c} to ${cellNote} - hidden single in row`)

          board[r][c].digit = cellNote;
          board[r][c].notes.clear();
          board = removeNotesAfterDigit(board, {r: r, c: c}, cellNote);
          made_changes = true;
          break;
        }

        // Reset unique flag for column
        unique_digit = true;

        // Check columns
        for (let nr = 0; nr < 9; nr++) {
          // Skip same row or already filled cells
          if (nr == r || board[nr][c].digit !== 0) {
            continue;
          }

          // Found the digit in another cell's note than it cannot be unique
          if (board[nr][c].notes.has(cellNote)) {
            nr = 12;
            unique_digit = false;
            break;
          }
        }

        // If we found a unique digit in the notes for a column assign that digit to the current cell and move on
        if (unique_digit) {
          if (!testMove(solution, {r: r, c: c}, cellNote)) {
            console.error('Invalid solution')
            return
          }

          moves.push(`Set Row: ${r}, Col: ${c} to ${cellNote} - hidden single in col`)

          board[r][c].digit = cellNote;
          board[r][c].notes.clear();
          board = removeNotesAfterDigit(board, {r: r, c: c}, cellNote);
          made_changes = true;
          break;
        }

        // Reset unique flag for block
        unique_digit = true;

        // Check block
        const cellsInBlock = getCellsInBlock(r, c, board);
        for (let cellInBlock of cellsInBlock) {
          if ((cellInBlock.r == r && cellInBlock.c == c) || cellInBlock.digit !== 0) {
            continue;
          }

          // Found the digit in another cell's note than it cannot be unique
          if (cellInBlock.notes.has(cellNote)) {
            unique_digit = false;
            break;
          }
        }

        // If we found a unique digit in the notes for a block assign that digit to the current cell and move on
        if (unique_digit) {
          if (!testMove(solution, {r: r, c: c}, cellNote)) {
            console.error('Invalid solution')
            return
          }

          moves.push(`Set Row: ${r}, Col: ${c} to ${cellNote} - hidden single in block`)

          board[r][c].digit = cellNote;
          board[r][c].notes.clear();
          board = removeNotesAfterDigit(board, {r: r, c: c}, cellNote);
          made_changes = true;
          break;
        }
      }
    }
  }

  return {made_changes, moves}
}

/**
 * Find Naked Pairs and eliminate the digits from neighbouring notes
 * TODO: Could this handle Blind Pairs?
 * @param board
 */
const findNakedPairs = (board) => {
  let made_changes = false;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].digit === 0 && [...board[r][c].notes].length === 2) {
        const pair = [...board[r][c].notes];

        // Check row for another identical pair
        for (let cc = 0; cc < 9; cc++) {
          if (cc !== c && board[r][cc].digit === 0 && arraysEqual([...board[r][cc].notes], pair)) {
            removeNotesFromOthersInRow(board, r, pair, [c, cc]);
            made_changes = true;
            break;
          }
        }

        // Check column for another identical pair
        for (let rr = 0; rr < 9; rr++) {
          if (rr !== r && board[rr][c].digit === 0 && arraysEqual([...board[rr][c].notes], pair)) {
            removeNotesFromOthersInColumn(board, c, pair, [r, rr]);
            made_changes = true;
            break;
          }
        }

        // Check block for another identical pair
        const cellsInBlock = getCellsInBlock(r, c, board);
        for (let cellInBlock of cellsInBlock) {
          if ((cellInBlock.r !== r || cellInBlock.c !== c) && cellInBlock.digit === 0 && arraysEqual([...cellInBlock.notes], pair)) {
            removeNotesFromOthersInBlock(board, r, c, pair, [cellInBlock.r, cellInBlock.c]);
            made_changes = true;
            break;
          }
        }
      }

    }
  }

  return {made_changes}
}

/**
 * Find Naked Triples and eliminate the digits from neighbouring notes
 * TODO: Could this also handle Naked Pairs?
 * TODO: Could this handle Blind Triples?
 * @param board
 */
const findNakedTriples = (board) => {
  let made_changes = false;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].digit === 0 && [...board[r][c].notes].length <= 3) {
        const triple = [...board[r][c].notes]

        // # Row
        // Check row for another two identical or subset triples
        const rowTripleMatches = [];
        let foundRowSet;
        for (let cc = 0; cc < 9; cc++) {
          // Ignore current cell, completed cell or cell with 4 or more notes
          if (cc == c || board[r][cc].digit !== 0 || [...board[r][cc].notes].length > 3) {
            continue
          }

          if (!foundRowSet) {
            const combinedSet = new Set([...triple, ...board[r][cc].notes])
            if ([...combinedSet].length == 3) {
              foundRowSet = combinedSet
              rowTripleMatches.push(cc)
            }
          } else {
            const cellSet = new Set([...board[r][cc].notes]);
            if (foundRowSet.isSupersetOf(cellSet)) {
              rowTripleMatches.push(cc)
              break;
            }
          }
        }

        if (rowTripleMatches.length === 2) { // Found a Naked Triple
          removeNotesFromOthersInRow(board, r, triple, [c, ...rowTripleMatches]);
          made_changes = true;
          break;
        }

        // # Column
        // Check column for another two identical or subset triples
        const columnTripleMatches = [];
        let foundColSet;
        for (let rr = 0; rr < 9; rr++) {
          // Ignore cells with too many notes, these could be hidden triples though
          if (rr == r || board[rr][c].digit !== 0 || [...board[rr][c].notes].length > 3) {
            continue
          }

          if (!foundColSet) {
            // If no set of 3 has been found yet, try a combination of the current cells
            const combinedSet = new Set([...triple, ...board[rr][c].notes])
            // If the combined cell end up with exactly 3 unique numbers we may have found a potential triple
            if ([...combinedSet].length === 3) {
              foundColSet = combinedSet
              columnTripleMatches.push(rr)
            }
          } else {
            // Convert cell notes into a Set to be able to use the isSupersetOf function
            // If current cell notes are equal too or in the existing set -> found a triple
            const cellSet = new Set([...board[rr][c].notes]);
            if (foundColSet.isSupersetOf(cellSet)) {
              columnTripleMatches.push(rr)
              // Limit code to finding a single triple per column
              break;
            }
          }
        }

        if (columnTripleMatches.length === 2) { // Found a Naked Triple
          removeNotesFromOthersInColumn(board, c, triple, [r, ...columnTripleMatches]);
          made_changes = true;
          break;
        }

        // # Block
        // Check block for another two identical or subset triples
        // const blockTripleMatches = [];
        // let foundBlockSet;
        // const cellsInBlock = getCellsInBlock(r, c, board);
        // for (let cellInBlock of cellsInBlock) {
        //   // Ignore cells with too many notes, these could be hidden triples though
        //   if ((cellInBlock.r === r && cellInBlock.c !== c) ||  cellInBlock.digit !== 0 || cellInBlock.notes.length > 3) {
        //     continue
        //   }
        //
        //   if (!foundBlockSet) {
        //     // If no set of 3 has been found yet, try a combination of the current cells
        //     const combinedSet = new Set([...triple, ...cellInBlock.notes])
        //     // If the combined cells end up with exactly 3 unique numbers we may have found a potential triple
        //     if ([...combinedSet].length === 3) {
        //       foundBlockSet = combinedSet
        //       blockTripleMatches.push({r: cellInBlock.r, c: cellInBlock.c})
        //     }
        //   } else {
        //     // Convert cell notes into a Set to be able to use the isSupersetOf function
        //     // If current cell notes are equal too or in the existing set -> found a triple
        //     const cellSet = new Set(cellInBlock.notes);
        //     if (foundBlockSet.isSupersetOf(cellSet)) {
        //       blockTripleMatches.push({r: cellInBlock.r, c: cellInBlock.c})
        //       // Limit code to finding a single triple per block
        //       break;
        //     }
        //   }
        // }
        //
        // if (blockTripleMatches.length === 2) { // Found a Naked Triple
        //   removeNotesFromOthersInBlock(board, r, c, triple, blockTripleMatches);
        //   made_changes = true;
        //   break;
        // }
      }
    }
  }

  return {made_changes}
}

const findPointingPairs = (board) => {
  let made_changes = false;

  for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
      const allCellsInBlock = getCellsInBlock(r, c, board);

      // Since we're looping over these so often let only keep the relevant ones
      const cellsInBlock = allCellsInBlock.filter(cellInBlock => cellInBlock.digit === 0);

      const cellsChecked = [];

      for(let cellInBlock of cellsInBlock) {
        const cellId = cellInBlock.r+''+cellInBlock.c;
        cellsChecked.push(cellId);

        for (const neighbourCellInBlock of cellsInBlock) {
          const ngbId = neighbourCellInBlock.r+''+neighbourCellInBlock.c;
          // Only check cells in the same row or column
          if (
            (cellInBlock.r == neighbourCellInBlock.r && cellInBlock.c == neighbourCellInBlock.c) || // Do not check same cell
            (cellInBlock.r != neighbourCellInBlock.r && cellInBlock.c != neighbourCellInBlock.c) || // Do not check cells not in the same row / col
            cellsChecked.includes(ngbId)
          ) {
            continue;
          }

          // Get the overlapping notes of these cells
          const overlapping_notes = cellInBlock.notes.intersection(neighbourCellInBlock.notes)

          // For each overlapping note check if it appears in another column or row
          for (const overlapNote of [...overlapping_notes]) {
            for (const otherCellInBlock of cellsInBlock) {
              if (otherCellInBlock.digit !== 0) {
                continue;
              }
              // Only check for cells that are not in the same row or column
              if (
                (cellInBlock.r == neighbourCellInBlock.r && otherCellInBlock.r != neighbourCellInBlock.r) ||
                (cellInBlock.c == neighbourCellInBlock.c && otherCellInBlock.c != neighbourCellInBlock.c)
              ){
                // If we find overlap than this digit is of no interest
                if (otherCellInBlock.notes.has(overlapNote)) {
                  overlapping_notes.delete(overlapNote)
                  break;
                }
              }
            }
          }

          if ([...overlapping_notes].length > 0) {
            if (cellInBlock.r === neighbourCellInBlock.r) {
              removeNotesFromOthersInRow(board, cellInBlock.r, [...overlapping_notes], [c, c+1, c+2])
            } else if (cellInBlock.c === neighbourCellInBlock.c) {
              removeNotesFromOthersInColumn(board, cellInBlock.c, [...overlapping_notes], [r, r+1, r+2])
            }
          }
        }

      }
    }
  }

  return {made_changes, board}
}

const arraysEqual = (a: number[], b: number[]): boolean => {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

const removeNotesFromOthersInRow = (board: Board, row: number, pair: number[], excludeCols: number[]) => {
  for (let c = 0; c < 9; c++) {
    if (!excludeCols.includes(c) && board[row][c].digit === 0) {
      pair.forEach(digit => board[row][c].notes.delete(digit))
    }
  }
}

const removeNotesFromOthersInColumn = (board: Board, col: number, pair: number[], excludeRows: number[]) => {
  for (let r = 0; r < 9; r++) {
    if (!excludeRows.includes(r) && board[r][col].digit === 0) {
      pair.forEach(digit => board[r][col].notes.delete(digit))
    }
  }
}

const removeNotesFromOthersInBlock = (board: Board, row: number, col: number, pair: number[], excludeCells: number[]) => {
  const cellsInBlock = getCellsInBlock(row, col, board);
  for (let cell of cellsInBlock) {
    if (!excludeCells.includes(cell.r) && !excludeCells.includes(cell.c) && cell.digit === 0) {
      pair.forEach(digit => cell.notes.delete(digit))
    }
  }
}
