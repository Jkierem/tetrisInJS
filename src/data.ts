import { Vector } from "./core/structures/Vector";

export const Colors = {
    yellow: "#ffe74a",
    blue: "#4adbff",
    red: "#ff0a0a",
    green: "#0e8709",
    orange: "#ff7300",
    pink: "#ff00ff",
    purple: "#a407d9",
    black: "#000000",
}

export const Constants = {
    cols: 10,
    rows: 20,
    length: 30,
}

export const Directions = {
    DOWN: Vector(0,1),
    UP: Vector(0,-1),
    RIGHT: Vector(1,0),
    LEFT: Vector(-1,0),
    DIAG_UP_LEFT: Vector(-1,-1),
    DIAG_UP_RIGHT: Vector(1,-1),
    DIAG_DOWN_LEFT: Vector(-1,1),
    DIAG_DOWN_RIGHT: Vector(1,1),
}

export type TetrominoTypes = "O" | "I" | "S" | "Z" | "L" | "J" | "T"

export const Types = ["O", "I", "S", "Z", "L", "J", "T"] as TetrominoTypes[]

export const Tetrominos: {
    [K in TetrominoTypes]: K
} = {
    O:"O",
    I:"I",
    S:"S",
    Z:"Z",
    L:"L",
    J:"J",
    T:"T"
}

export const KeyCodes = {
    SPACE: 32,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    P: 80,
    R: 82,
    A: 65,
    D: 68,
    E: 69,
    W: 87,
    S: 83
}

export const HelpText = [
    "Controls:",
    "← →/A,D  : move piece",
    "↑/W      : rotate piece",
    "↓/S      : soft drop",
    "Spacebar : hard drop",
    "E    : pocket piece",
    "P        : pause game",
    "R        : restart game",
]