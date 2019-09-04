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