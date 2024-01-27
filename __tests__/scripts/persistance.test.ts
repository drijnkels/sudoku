import {describe, it, expect, afterEach} from 'vitest';

import { mockEasyBoard, invalidBoard } from '../mocks/mockSudokus';
import { stringToBoard } from "@/scripts/utils";
import {saveToLocalStorage, loadFromLocalStorage, clearPuzzleProgress, clearAppData} from "@/scripts/persistence";

afterEach(() => {
  localStorage.clear();
})

describe('stringToBoard', () => {
  it('should store and load a boardState', () => {
    const puzzle_id = 'mockPuzzle';
    const boardData = stringToBoard(mockEasyBoard);

    // Make a change to the boardState
    const rToTest = 0;
    const cToTest = 4;
    /* @ts-ignore */
    boardData[rToTest][cToTest].digit = 4;

    /* @ts-ignore */
    saveToLocalStorage(puzzle_id, {boardData: boardData, errors: 1, completion: 2});

    const savedBoardState = loadFromLocalStorage(puzzle_id);

    expect(savedBoardState).not.toBe(false);
    /* @ts-ignore */
    expect(savedBoardState.boardData[rToTest][cToTest].digit).toBe(4);
  });

  it('should clear puzzle data without affecting other puzzles', () => {
    const puzzle_id = 'mockPuzzle';
    const puzzle_id2 = 'mockPuzzle2';
    const boardData = stringToBoard(mockEasyBoard);

    // Make a change to the boardState for puzzle 1
    const rToTest = 0;
    const cToTest = 4;
    /* @ts-ignore */
    boardData[rToTest][cToTest].digit = 4;

    /* @ts-ignore */
    saveToLocalStorage(puzzle_id, {boardData: boardData, errors: 1, completion: 2});

    // Make a change to the boardState for puzzle 2
    /* @ts-ignore */
    boardData[rToTest][cToTest].digit = 6;
    /* @ts-ignore */
    saveToLocalStorage(puzzle_id2, {boardData: boardData, errors: 1, completion: 2});

    // Now clear puzzle 1's data
    clearPuzzleProgress(puzzle_id);

    // Check that puzzle 1's data was indeed deleted
    const savedBoardState = loadFromLocalStorage(puzzle_id);
    expect(savedBoardState).toBe(false);

    // Make sure that puzzle 2's data is still there
    const savedBoardState2 = loadFromLocalStorage(puzzle_id2);
    /* @ts-ignore */
    expect(savedBoardState2.boardData[rToTest][cToTest].digit).toBe(6);
  })

  it('should clear all puzzle data', () => {
    const puzzle_id = 'mockPuzzle';
    const puzzle_id2 = 'mockPuzzle2';
    const boardData = stringToBoard(mockEasyBoard);

    // Make a change to the boardState for puzzle 1
    const rToTest = 0;
    const cToTest = 4;
    /* @ts-ignore */
    boardData[rToTest][cToTest].digit = 4;

    /* @ts-ignore */
    saveToLocalStorage(puzzle_id, {boardData: boardData, errors: 1, completion: 2});
    /* @ts-ignore */
    saveToLocalStorage(puzzle_id2, {boardData: boardData, errors: 2, completion: 4});

    // Clear all puzzle data
    clearAppData();

    // Check that puzzle 1's data was indeed deleted
    const savedBoardState = loadFromLocalStorage(puzzle_id);
    expect(savedBoardState).toBe(false);

    // Make sure that puzzle 2's data is still there
    const savedBoardState2 = loadFromLocalStorage(puzzle_id2);
    expect(savedBoardState2).toBe(false);
  })

})