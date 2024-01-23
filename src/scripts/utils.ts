import {GridLoc} from "@/types/types";

export const stringToBoard = (boardString: string) => {
    if (boardString.length != 89) {
        return false;
    }
    return boardString
            .split(' ')
            // @ts-ignore
            .map((row) => [...row].map(Number));
}

export const validateMove = (boardData: number[][], gridLoc: GridLoc) => {
    return true;
}

export const validateBoard = (boardData: number[][]) => {
    // Test board validity
    if (!boardData) {
        console.error('Invalid board');
        return false;
    }

    const validateGroup = (group: number[]) => {
        group = group.filter((n) => n != 0);
        return group.length === new Set(group).size;
    }

    // Check rows
    for (let row of boardData) {
        if(!validateGroup(row)){
            return false;
        }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
        const column = boardData.map((row) => row[col]);
        if(!validateGroup(column)){
            return false;
        }
    }

    // Check squares
    for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            const square = [];
            for (let y = r; y < r + 3; y++) {
                for (let x = c; x < c + 3; x++) {
                    square.push(boardData[y][x]);
                }
            }

            if(!validateGroup(square)){
                return false;
            }
        }
    }

    return true;
}