import { Vector } from "@juan-utils/structures";

export const Colors = {
    green: "#1c911c",
    darkgreen: "#236e0c",
    brown: "#965b03",
    yellow: "#ffe51f",
    blue: "#8dd7fc",
    red: "#6e110c",
    roof: "#6e4c0c",
    black: "#000000"
}

export const Constants = {
    cols: 10,
    rows: 20,
    length: 30,
}

export const Directions = {
    DOWN: Vector(0,1),
    UP: Vector(0,1),
    RIGHT: Vector(1,0),
    LEFT: Vector(-1,0),
    DIAG_UP_LEFT: Vector(-1,-1),
    DIAG_UP_RIGHT: Vector(1,-1),
    DIAG_DOWN_LEFT: Vector(-1,1),
    DIAG_DOWN_RIGHT: Vector(1,1),
}