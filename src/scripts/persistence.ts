import {Board} from "@/types/types";

export const loadFromLocalStorage = (puzzle_id: string): {boardData: Board, errors: number, completion: number} | false => {
  if (typeof localStorage === "undefined") {
    console.error('Unable to use localStorage')
    return false;
  }

  const puzzleData = localStorage.getItem(puzzle_id);
  if (!puzzleData) {
    return false;
  }

  return JSON.parse(puzzleData);
}

export const saveToLocalStorage = (puzzle_id: string, puzzleData: {boardData: Board, errors: number, completion: number}) => {
  if (typeof localStorage === "undefined") {
    console.error('Unable to use localStorage')
    return false;
  }

  localStorage.setItem(puzzle_id, JSON.stringify(puzzleData));
  return true;
}

export const clearPuzzleProgress = (puzzle_id: string) => {
  if (typeof localStorage === "undefined") {
    console.error('Unable to clear item')
    return false;
  }

  localStorage.removeItem(puzzle_id);
}

export const clearAppData = () => {
  if (typeof localStorage === "undefined") {
    console.error('Unable to clear localStorage')
    return false;
  }

  localStorage.clear()
}