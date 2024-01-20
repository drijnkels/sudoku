export const stringToBoard = (boardString: string) => {
    if (boardString.length != 89) {
        return false;
    }
    return boardString
            .split(' ')
            // @ts-ignore
            .map((row) => [...row].map(Number));
}

export const validateBoard = (boardData: number[][]) => {
    return true;
}