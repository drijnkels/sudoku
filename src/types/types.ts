import {number} from "prop-types";

export type GridLoc = {
  r: number
  c: number
}

export type Puzzle = {
  puzzle_id: string,
  url: string,
  name: string,
  board: string,
  completion: string
}

export type Board = number[][];

export type History = {
  type: 'cell' | 'note'
  cell: GridLoc
  notes: number[],
  previousDigit: number
  newDigit: number
}

export type DigitCount = {
  [digit: string]: number;
};