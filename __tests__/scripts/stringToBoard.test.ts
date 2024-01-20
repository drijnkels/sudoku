import { describe, it, expect } from 'vitest';

import { mockEasyBoard, invalidBoard } from '../mocks/mockSudokus';
import { stringToBoard } from "@/scripts/utils";

describe('stringToBoard', () => {
  it('should format a board from a valid string', () => {
    const boardData = stringToBoard(mockEasyBoard);
    /* @ts-ignore */
    expect(boardData.length).toBe(9);
    /* @ts-ignore */
    expect(boardData[0].length).toBe(9);
  });

  it('should return false for an invalid string', () => {
    const boardData = stringToBoard(invalidBoard);
    /* @ts-ignore */
    expect(boardData).toBe(false);
  });
})