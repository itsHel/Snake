import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const size = 30;
const snakeBaseSize = 6;
const snakeBaseSpeedMs = 370;
const speedchange = -4;
const speedMinMs = 50;
const startDirection: StartDirection = "east";
export const levelCount = 7;

export enum Square {
    DEAD,
    EMPTY,
    SNAKE,
    HEAD,
    ROCK,
    FOOD,
}

export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Direction = "west" | "east" | "south" | "north";
export type StartDirection = "east" | "south" | "north";

type Board = Square[][];
type Position = {
    x: number;
    y: number;
};

interface BoardState {
    value: Board;
    snakeHead: Position;
    snakeEnd: Position;
    snakeDirection: Direction;
    snakeLatestDirection: Direction;
    snakeEndDirectionStack: Direction[];
    doubleMove: boolean;
    snakeSpeed: number;
    eatenCount: number;
    unpaused: boolean;
    currentBoard: Level;
    lost: boolean;
}

const initialState: BoardState = {
    value: new Array(size)
        .fill([])
        .map(() => new Array(size).fill(Square.EMPTY)),
    snakeHead: { y: 0, x: 0 },
    snakeEnd: { y: 0, x: 0 },
    snakeDirection: startDirection,
    snakeLatestDirection: startDirection,
    snakeEndDirectionStack: new Array(snakeBaseSize - 1).fill(startDirection),
    doubleMove: false,
    snakeSpeed: snakeBaseSpeedMs,
    eatenCount: 0,
    unpaused: false,
    currentBoard: 0,
    lost: false,
};

export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        clearSnake: (state) => {
            let snakeEndDirection: Direction =
                state.snakeEndDirectionStack.shift()!;

            state.value[state.snakeEnd.y][state.snakeEnd.x] = Square.DEAD;
            state.snakeEnd = getNextPos(state.snakeEnd, snakeEndDirection);
        },
        moveSnake: (state) => {
            let movesCount = state.doubleMove ? 2 : 1;
            state.doubleMove = false;

            for (let i = 0; i < movesCount; i++) {
                let newHeadPos: Position = getNextPos(
                    state.snakeHead,
                    state.snakeDirection,
                );

                if (
                    (state.value[newHeadPos.y][newHeadPos.x] === Square.SNAKE ||
                        state.value[newHeadPos.y][newHeadPos.x] ===
                            Square.ROCK ||
                        state.value[newHeadPos.y][newHeadPos.x] ===
                            Square.HEAD) &&
                    !(
                        newHeadPos.y === state.snakeEnd.y &&
                        newHeadPos.x === state.snakeEnd.x
                    )
                ) {
                    state.unpaused = false;
                    state.lost = true;

                    return;
                }

                state.snakeEndDirectionStack.push(state.snakeDirection);

                if (state.value[newHeadPos.y][newHeadPos.x] === Square.FOOD) {
                    // Food found
                    let foodPos: Position = createFoodPos(state.value);
                    state.value[foodPos.y][foodPos.x] = Square.FOOD;

                    state.eatenCount += 1;

                    if (state.snakeSpeed > speedMinMs) {
                        state.snakeSpeed += speedchange;
                    }
                } else {
                    let snakeEndDirection: Direction =
                        state.snakeEndDirectionStack.shift()!;

                    state.value[state.snakeEnd.y][state.snakeEnd.x] =
                        Square.EMPTY;
                    state.snakeEnd = getNextPos(
                        state.snakeEnd,
                        snakeEndDirection,
                    );
                }

                state.value[newHeadPos.y][newHeadPos.x] = Square.HEAD;
                state.value[state.snakeHead.y][state.snakeHead.x] =
                    Square.SNAKE;
                state.snakeHead = newHeadPos;

                state.snakeLatestDirection = state.snakeDirection;
            }
        },
        changeDirection: (state, action: PayloadAction<Direction>) => {
            if (state.lost) return;

            // Stops player from chnaging direction into snake body
            if (
                (state.snakeLatestDirection === "west" &&
                    action.payload === "east") ||
                (state.snakeLatestDirection === "east" &&
                    action.payload === "west") ||
                (state.snakeLatestDirection === "south" &&
                    action.payload === "north") ||
                (state.snakeLatestDirection === "north" &&
                    action.payload === "south")
            )
                return;

            if (
                state.unpaused &&
                action.payload === state.snakeLatestDirection
            ) {
                state.doubleMove = true;
            } else {
                state.doubleMove = false;
            }

            state.unpaused = true;
            state.snakeDirection = action.payload;
        },
        resetBoard: (state, action: PayloadAction<Level>) => {
            state.lost = false;
            state.unpaused = false;
            state.snakeSpeed = snakeBaseSpeedMs;
            state.eatenCount = 0;
            state.currentBoard = action.payload;

            for (let i = 0; i < state.value.length; i++) {
                for (let j = 0; j < state.value[i].length; j++) {
                    state.value[i][j] = Square.EMPTY;
                }
            }

            createLevel(action.payload);
            createSnake();

            function createLevel(type: Level) {
                const isOdd = size % 2;
                let startPos;

                switch (action.payload) {
                    case 0:
                        break;
                    case 1:
                        startPos = 4;
                        let xMiddle = Math.floor(size / 2);
                        let xLeft = Math.floor(xMiddle / 2);
                        let xRight = xMiddle + Math.ceil(xMiddle / 2);
                        let xPoints = [xLeft, xMiddle, xRight];

                        for (let i = 0; i < xPoints.length; i++) {
                            for (let j = startPos; j < size - startPos; j++) {
                                if (
                                    i === 1 &&
                                    (j === Math.floor(size / 2) ||
                                        j === Math.floor(size / 2) - 1 ||
                                        (j === Math.floor(size / 2) + 1 &&
                                            isOdd))
                                )
                                    continue;

                                state.value[j][xPoints[i]] = Square.ROCK;
                            }
                        }

                        break;
                    case 2:
                        startPos = 3;
                        for (let i = startPos; i < size - startPos; i++) {
                            if (
                                i === Math.floor(size / 2) ||
                                i === Math.floor(size / 2) - 1 ||
                                (i === Math.floor(size / 2) + 1 && isOdd)
                            )
                                continue;

                            state.value[i][i] = Square.ROCK;
                            state.value[i][size - i - 1] = Square.ROCK;
                        }

                        break;
                    case 3:
                        for (let i = 0; i < size; i++) {
                            state.value[0][i] = Square.ROCK;
                            state.value[size - 1][i] = Square.ROCK;
                            state.value[i][0] = Square.ROCK;
                            state.value[i][size - 1] = Square.ROCK;
                        }

                        break;
                    case 4:
                        let rockCount = size * 2;
                        for (let i = 0; i < rockCount; i++) {
                            let x, y;

                            do {
                                x = Math.floor(Math.random() * size);
                                y = Math.floor(Math.random() * size);
                            } while (state.value[y][x] !== Square.EMPTY);

                            state.value[y][x] = Square.ROCK;
                        }

                        break;
                    case 5:
                        startPos = 3;
                        drawLabyrinth(
                            { y: startPos, x: startPos },
                            size - startPos * 2 - 1,
                            "east",
                            2,
                            true,
                        );

                        break;
                    case 6:
                        let x1 = getRandomInRange(2, Math.floor(size / 2) - 2);
                        let x2 = getRandomInRange(
                            Math.ceil(size / 2) + 2,
                            size - 3,
                        );
                        let temp = [x1, x2];

                        for (let i = 0; i < temp.length; i++) {
                            let length1 = getRandomInRange(
                                Math.round(size * 0.1),
                                Math.round(size * 0.2),
                            );
                            let length2 = getRandomInRange(
                                Math.round(size * 0.1),
                                Math.round(size * 0.2),
                            );

                            for (let j = 0; j < length1; j++) {
                                state.value[j][temp[i]] = Square.ROCK;
                            }
                            for (let j = 0; j < length2; j++) {
                                state.value[size - j - 1][temp[i]] =
                                    Square.ROCK;
                            }
                        }

                        let y1 = getRandomInRange(
                            Math.round(size * 0.25),
                            Math.round(size * 0.75),
                        );
                        let y2 = getRandomInRange(
                            Math.round(size * 0.25),
                            Math.round(size * 0.75),
                        );
                        let length1 = getRandomInRange(
                            Math.round(size * 0.1),
                            Math.round(size * 0.2),
                        );
                        let length2 = getRandomInRange(
                            Math.round(size * 0.1),
                            Math.round(size * 0.2),
                        );

                        for (let j = 0; j < length1; j++) {
                            state.value[y1][j] = Square.ROCK;
                        }
                        for (let j = 0; j < length2; j++) {
                            state.value[y2][size - j - 1] = Square.ROCK;
                        }

                        let pos = {
                            y: getRandomInRange(
                                Math.floor(size * 0.5),
                                Math.floor(size * 0.75),
                            ),
                            x: getRandomInRange(
                                Math.floor(size * 0.25),
                                Math.floor(size * 0.35),
                            ),
                        };

                        drawEastNorthLine(
                            pos,
                            getRandomInRange(size * 0.2, size * 0.3),
                            "east",
                            3,
                        );

                        break;
                }
            }

            function createSnake() {
                state.snakeDirection = startDirection;
                state.snakeLatestDirection = startDirection;
                state.snakeEndDirectionStack = new Array(
                    snakeBaseSize - 1,
                ).fill(startDirection);

                const snakeSpace = snakeBaseSize + 4;
                let dontBreak = false;
                let x, y;

                do {
                    x = getRandomInRange(snakeBaseSize + 1, size - 4);
                    y = getRandomInRange(1, size - 2);

                    for (let i = x; i < x + snakeSpace; i++) {
                        if (
                            state.value[y][i - snakeBaseSize - 1] !==
                            Square.EMPTY
                        ) {
                            dontBreak = true;
                            break;
                        }

                        if (i + 1 === x + snakeSpace) {
                            dontBreak = false;
                        }
                    }
                } while (dontBreak);

                for (let i = x - snakeBaseSize + 1; i <= x; i++) {
                    state.value[y][i] = Square.SNAKE;
                }

                state.snakeHead = { y: y, x: x };
                state.value[y][x] = Square.HEAD;
                state.snakeEnd = { y: y, x: x - snakeBaseSize + 1 };

                let foodPos: Position = createFoodPos(state.value);
                state.value[foodPos.y][foodPos.x] = Square.FOOD;
            }

            function drawLabyrinth(
                start: Position,
                length: number,
                direction: Direction,
                drawFull: number,
                cutLength: boolean,
            ) {
                if (length <= 0) return;

                let pos: Position = start;

                for (let i = 0; i < length; i++) {
                    state.value[pos.y][pos.x] = Square.ROCK;
                    pos = getNextPos(pos, direction);
                }

                switch (direction) {
                    case "west":
                        direction = "north";
                        break;
                    case "east":
                        direction = "south";
                        break;
                    case "south":
                        direction = "west";
                        break;
                    case "north":
                        direction = "east";
                        break;
                }

                if (drawFull > 0) {
                    drawFull--;
                } else {
                    if (cutLength) {
                        cutLength = false;
                        length -= 4;
                    } else {
                        cutLength = true;
                    }
                }

                drawLabyrinth(pos, length, direction, drawFull, cutLength);
            }

            function drawEastNorthLine(
                start: Position,
                length: number,
                direction: Direction,
                count: number,
            ) {
                if (count <= 0) return;

                let pos: Position = start;

                for (let i = 0; i < length; i++) {
                    state.value[pos.y][pos.x] = Square.ROCK;
                    pos = getNextPos(pos, direction);
                }

                switch (direction) {
                    case "east":
                        direction = "north";
                        break;
                    case "north":
                        direction = "east";
                        break;
                }

                length = getRandomInRange(size * 0.2, size * 0.3);

                drawEastNorthLine(pos, length, direction, --count);
            }
        },
    },
});

function getRandomInRange(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

function getNextPos(pos: Position, direction: Direction) {
    let newPos = { ...pos };

    switch (direction) {
        case "west":
            newPos.x -= 1;
            break;
        case "east":
            newPos.x += 1;
            break;
        case "south":
            newPos.y += 1;
            break;
        case "north":
            newPos.y -= 1;
            break;
    }

    newPos = fixBounds(newPos);

    return newPos;
}

function fixBounds(pos: Position): Position {
    if (pos.x < 0) {
        pos.x = size - 1;
    }
    if (pos.x === size) {
        pos.x = 0;
    }
    if (pos.y === size) {
        pos.y = 0;
    }
    if (pos.y < 0) {
        pos.y = size - 1;
    }

    return pos;
}

function createFoodPos(board: Board): Position {
    let y, x;

    do {
        y = Math.floor(Math.random() * size);
        x = Math.floor(Math.random() * size);
    } while (board[y][x] !== Square.EMPTY);

    return { y: y, x: x };
}

export const { resetBoard, moveSnake, changeDirection, clearSnake } =
    boardSlice.actions;

export const boardState = (state: RootState) => state.board.value;
export const getSpeed = (state: RootState) => state.board.snakeSpeed;
export const eatenCount = (state: RootState) => state.board.eatenCount;
export const unpaused = (state: RootState) => state.board.unpaused;
export const currentBoard = (state: RootState) => state.board.currentBoard;
export const lost = (state: RootState) => state.board.lost;

export default boardSlice.reducer;
