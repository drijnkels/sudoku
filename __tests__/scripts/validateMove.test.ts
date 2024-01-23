import { describe, it, expect } from 'vitest';

import { mockEasyBoard, mockErrorBoard, invalidBoard } from '../mocks/mockSudokus';
import { stringToBoard, validateMove } from "@/scripts/utils";
import {GridLoc} from "@/types/types";

describe('validateMove', () => {
  it('should return true for a valid move', () => {
    const boardData = stringToBoard(mockEasyBoard);
    const rToTest = 0;
    const cToTest = 4;
    /* @ts-ignore */
    boardData[rToTest][cToTest] = 4;
    /* @ts-ignore */
    expect(validateMove(boardData, {r: rToTest, c: cToTest})).toBe(true);
  });

  it('should return false mistake in a row', () => {
    const boardData = stringToBoard(mockErrorBoard);
    const rToTest = 0;
    const cToTest = 1;
    /* @ts-ignore */
    boardData[rToTest][cToTest] = 8; // Gives two 8s in the top left corner
    /* @ts-ignore */
    expect(validateMove(boardData, {r: rToTest, c: cToTest})).toBe(false);
  });

  it('should return false mistake in a column', () => {
    const boardData = stringToBoard(mockErrorBoard);
    const rToTest = 5;
    const cToTest = 2;
    /* @ts-ignore */
    boardData[rToTest][cToTest] = 4; // Gives two 4s in the third column
    /* @ts-ignore */
    expect(validateMove(boardData, {r: rToTest, c: cToTest})).toBe(false);
  });

  it('should return false mistake in a square', () => {
    const boardData = stringToBoard(mockErrorBoard);
    const rToTest = 0;
    const cToTest = 1;
    /* @ts-ignore */
    boardData[rToTest][cToTest] = 4; // Gives two 4s in the top left square
    /* @ts-ignore */
    expect(validateMove(boardData, {r: rToTest, c: cToTest})).toBe(false);
  });
})