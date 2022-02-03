import { Vector2 } from './core/structures/Vector';
import { Directions, Tetrominos, Colors, Types, TetrominoTypes } from './data'

const {
    UP, DOWN, LEFT, RIGHT, 
    DIAG_DOWN_RIGHT,
    DIAG_UP_LEFT, DIAG_UP_RIGHT
} = Directions

export type Position = Vector2

export type Rotation = (ref: Position) => Position[]

export interface Piece {
    type: TetrominoTypes,
    color: string,
    rotations: Rotation[],
    readonly pos: Position,
    rotate: () => Piece,
    move: (dir: Position) => Piece,
    getBlocks: () => Position[],
    getStandardBlocks: () => Position[],
    getPosition: () => number[],
    clone: () => Piece,
    teleport: (next: Position) => Piece
}

const createPiece = (
    type: TetrominoTypes, 
    position: Position,
    rotations: Rotation[],
    color: string,
    currentRot: number = 0
): Piece => {
    let rot = currentRot;
    let pos = position;
    return {
        type,
        color,
        rotations,
        get pos(){ return pos },
        rotate(){ rot = (rot + 1) % rotations.length; return this },
        move(dir){ pos = pos.add(dir); return this; },
        getBlocks(){ return rotations[rot](pos) },
        getStandardBlocks(){ return rotations[0](pos) },
        getPosition(){ return pos.toArray() },
        clone(){ return createPiece(type,pos,rotations,color,rot) },
        teleport(next){ pos = next; return this },
    }
}

const createRotation = (...dirs: Position[]): Rotation => {
    return (pos: Position) => [
        pos,
        ...dirs.map(dir => pos.add(dir) )
    ]
}

const createO = (pos: Position) => {
    const rotations = [
        createRotation(RIGHT,DOWN,DIAG_DOWN_RIGHT)
    ]
    return createPiece("O",pos,rotations,Colors.yellow);
}

const createI = (pos: Position) => {
    const rotations = [
        createRotation(UP,DOWN,DOWN.scale(2)),
        createRotation(LEFT,RIGHT,RIGHT.scale(2))
    ]
    return createPiece("I",pos,rotations,Colors.blue);
} 

const createS = (pos: Position) => {
    const rotations = [
        createRotation(UP,LEFT,DIAG_UP_RIGHT),
        createRotation(UP,DIAG_UP_LEFT,DIAG_UP_LEFT.add(UP))
    ]
    return createPiece("S",pos,rotations,Colors.red);
}

const createZ = (pos: Position) => {
    const rotations = [
        createRotation(UP,RIGHT,DIAG_UP_LEFT),
        createRotation(UP,DIAG_UP_RIGHT,DIAG_UP_RIGHT.add(UP))
    ]
    return createPiece("Z",pos,rotations,Colors.green);
}

const createT = (pos: Position) => {
    const rotations = [
        createRotation(UP,LEFT,RIGHT),
        createRotation(UP,DOWN,RIGHT),
        createRotation(DOWN,LEFT,RIGHT),
        createRotation(UP,DOWN,LEFT),
    ]
    return createPiece("T",pos,rotations,Colors.purple);
}

const createL = (pos: Position) => {
    const rotations = [
        createRotation(UP,UP.scale(2),RIGHT),
        createRotation(DOWN,RIGHT,RIGHT.scale(2)),
        createRotation(DOWN,DOWN.scale(2),LEFT),
        createRotation(UP,LEFT,LEFT.scale(2)),
    ]
    return createPiece("L",pos,rotations,Colors.orange);
} 

const createJ = (pos: Position) => {
    const rotations = [
        createRotation(UP,UP.scale(2),LEFT),
        createRotation(UP,RIGHT,RIGHT.scale(2)),
        createRotation(RIGHT,DOWN,DOWN.scale(2)),
        createRotation(DOWN,LEFT,LEFT.scale(2)),
    ]
    return createPiece("J",pos,rotations,Colors.pink);
}

export const createPieceFromType = (type: TetrominoTypes) => {
    const pos = Vector2(5,-3);
    const { O , I , Z , S , T , L , J } = Tetrominos;
    switch(type){
        case O:
            return createO(pos)
        case I:
            return createI(pos)
        case Z:
            return createZ(pos)
        case S:
            return createS(pos)
        case T:
            return createT(pos)
        case L:
            return createL(pos)
        case J:
            return createJ(pos)
    }
}

export const createRandomPiece = () => {
    const typeN = Math.floor(Math.random() * Types.length);
    return createPieceFromType(Types[typeN]);
}