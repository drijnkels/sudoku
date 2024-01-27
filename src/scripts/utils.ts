import {GridLoc, DigitCount, Board} from "@/types/types";
import Cell from "@/components/Board/Cell";

export const deepCopy = (object: any) => {
  return JSON.parse(JSON.stringify(object));
}

export const stringToBoard = (boardString: string): false | Board => {
    if (boardString.length != 89) {
        return false;
    }
    return boardString
      .split(' ')
      // @ts-ignore
      .map((row) => [...row].map(
        (digit) => (
          { digit: parseInt(digit), state: (digit == 0 ? 'free' : 'locked'), notes: []}
        )
      ));
}

const validateGroup = (group: number[]) => {
    group = group.filter((n) => n != 0);
    return group.length === new Set(group).size;
}

// Checks the validity of the move against currently visible digits
// Increases the difficulty level slightly as only obvious mistakes are caught
export const validateMove = (boardData: Board, gridLoc: GridLoc) => {
    // Test row
    if (!validateGroup(boardData[gridLoc.r].map((c) => c.digit))) {
        return false;
    }

    const column = boardData.map((row) => row[gridLoc.c]);
    if (!validateGroup(column.map((c) => c.digit))) {
        return false;
    }

    const first_r = Math.floor(gridLoc.r / 3) * 3;
    const first_c = Math.floor(gridLoc.c / 3) * 3;
    const square = [];

    // Check square
    for (let r = first_r; r < first_r + 3; r++) {
        for (let c = first_c; c < first_c + 3; c++) {
            square.push(boardData[r][c].digit);
        }
    }
    if (!validateGroup(square)) {
        return false;
    }

    return true;
}

export const validateBoard = (boardData: Board) => {
    // Test board validity
    if (!boardData) {
        console.error('Invalid board');
        return false;
    }

    // Check rows
    for (let row of boardData) {
        if (!validateGroup(row.map((c) => c.digit))) {
            return false;
        }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
        const column = boardData.map((row) => row[col]);
        if (!validateGroup(column.map((c) => c.digit))) {
            return false;
        }
    }

    // Check squares
    for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            const square = [];
            for (let y = r; y < r + 3; y++) {
                for (let x = c; x < c + 3; x++) {
                    square.push(boardData[y][x].digit);
                }
            }

            if (!validateGroup(square)) {
                return false;
            }
        }
    }

    return true;
}

export const getRemainingDigits = (boardData: Board) => {
    // Test board validity
    if (!boardData) {
        console.error('Invalid board');
        return false;
    }
    const digits: DigitCount = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
    };

    // Check rows
    for (let row of boardData) {
        for (let cell of row) {
            digits[String(cell)] = digits[String(cell)] + 1;
        }
    }

    return digits;
}

export const countEmptyCells = (board: Board | false) => {
  if (!board) {
    return 9*9;
  }

  let empty_cells = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell.digit == 0) {
        empty_cells++;
      }
    }
  }
  return empty_cells;
}

export const calculateCompletion = (intialEmptyCells: number,boardData: Board) => {
    let current_empty_cells = countEmptyCells(boardData);

    return 100 - Math.floor((current_empty_cells * 100) / intialEmptyCells);
}