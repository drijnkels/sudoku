export const stringToBoard = (boardString: string) => {
    return boardString
            .split(' ')
            // @ts-ignore
            .map((row) => [...row].map(Number));
}

export const validateBoard = (boardData: number[][]) => {
    return true;
}