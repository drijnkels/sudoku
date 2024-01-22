import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

import { stringToBoard } from '@/scripts/utils';
import { mockEasyBoard } from "../mocks/mockSudokus";
import SudokuBoard from "@/components/Board/SudokuBoard";

describe('Orga table test', () => {
  const notes:number[][][] = [];
  for (let row = 0; row < 9; row++) {
    notes[row] = [];
    for (let col = 0; col < 9; col++) {
      notes[row][col] = [];
    }
  }

  beforeEach(() => {
    const boardData = stringToBoard(mockEasyBoard);
    render (
      <SudokuBoard 
        /** @ts-ignore */
        boardData={boardData}
        notes={notes}
        activeCell={{r:9, c:9}}
        setActiveCell={() => {console.log('setActiveCell')}}
      />
    );
  });

  afterEach(cleanup);

  it('Does board render correctly', () => {
    expect(screen.getAllByText('8').length).toBe(5);
  })
})