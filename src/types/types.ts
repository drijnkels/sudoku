import {number} from "prop-types";

export type GridLoc = {
  r: number
  c: number
}

export type Puzzle = {
  puzzle_id: string
  url: string
  name: string
  board: string
}

export type Solution = {
  id: string
  board: string
}

type CellState = 'free' | 'locked' | 'error';
export type Cell = {digit: number, state: CellState, notes: number[], r?: number, c?: number }
export type Board = Cell[][];

export type History = {
  gridLoc: GridLoc,
  currentState: Cell,
  newState: Cell
}

export type DigitCount = {
  [digit: string]: number
};