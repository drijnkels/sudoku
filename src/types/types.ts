export type GridLoc = {
  r: number
  c: number
}

export type History = {
  type: 'cell' | 'note'
  cell: GridLoc
  notes: number[],
  previousDigit: number
  newDigit: number
}

