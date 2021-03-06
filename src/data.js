import { Vector } from "@juan-utils/structures";

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

export const Tetrominos = {
    O:"O",
    I:"I",
    S:"S",
    Z:"Z",
    L:"L",
    J:"J",
    T:"T"
}

export const Types = Object.keys(Tetrominos)

export const KeyCodes = {
    SPACE: 32,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    SHIFT: 16,
    P: 80,
    R: 82,
    A: 65,
    D: 68,
    W: 87,
    S: 83
}

export const HelpText = [
    "Controls:",
    "← →/A,D  : move piece",
    "↑/W      : rotate piece",
    "↓/S      : soft drop",
    "Spacebar : hard drop",
    "Shift    : pocket piece",
    "P        : pause game",
    "R        : restart game",
]