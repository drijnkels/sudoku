import {ReactNode, useEffect, useState} from "react";
import Cell from "@/components/Board/Cell";
import { GridLoc } from "@/types/types";

type SudokuBoardTypes = {
  boardData: number[][],
  notes: number[][][],
  errors: GridLoc[],
  gameComplete: boolean,
  activeCell: GridLoc,
  setActiveCell: (gridLoc: GridLoc) => void
}
export default function SudokuBoard({boardData, notes, errors = [], gameComplete, activeCell, setActiveCell}: SudokuBoardTypes) {
  const squares = [[0,1,2], [3,4,5], [6,7,8]];
  const [activeSquare, setActiveSquare] = useState({rows: [9,9,9], columns: [9,9,9]});

  const handleSelectCell = (gridLoc: GridLoc) => {
    setActiveCell(gridLoc);
    setActiveSquare({
      rows: inSquare(gridLoc.r),
      columns: inSquare(gridLoc.c)
    });
  }

  const inSquare = (digit: number) => {
    let currentSquare: number[] = [];
    for (let square of squares) {
      if (square.indexOf(digit) !== -1) {
        currentSquare = square;
        break;
      }
    }
    return currentSquare;
  }

  const highlightCell = (gridLoc: GridLoc) => {
    if (gridLoc.r == activeCell.r && gridLoc.c == activeCell.c) {
      return 'bg-sky-200/70';
    }

    if (gridLoc.r == activeCell.r) {
      return 'bg-sky-200/30';
    }
    if (gridLoc.c == activeCell.c) {
      return 'bg-sky-200/30';
    }

    if (activeSquare.rows.indexOf(gridLoc.r) > -1 && activeSquare.columns.indexOf(gridLoc.c) > -1) {
      return 'bg-sky-200/30';
    }

    return '';
  }
  console.log('sudokuBoard', errors);
  return (
    <div className='border-2 border-slate-700 w-fit m-auto'>
      {
        boardData.map((row, rowIndex) => (
          <div key={rowIndex} className={`row flex ${rowIndex % 3 === 2 && rowIndex != 8 ? 'border-slate-800 border-b' : 'border-slate-300 border-b'}`}>
            {
              row.map((cell, cellIndex) => (
                <Cell
                  key={`${rowIndex}-${cellIndex}`}
                  cellIndex={cellIndex}
                  digit={boardData[rowIndex][cellIndex]}
                  selectCell={() => handleSelectCell({r: rowIndex, c: cellIndex})}
                  highlight={highlightCell({r: rowIndex, c: cellIndex})}
                  notes={notes[rowIndex][cellIndex]}
                  errorCell={errors.find((e) => e.r == rowIndex && e.c == cellIndex)}
                  gameComplete={gameComplete}
                />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}