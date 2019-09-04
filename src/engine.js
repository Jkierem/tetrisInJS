import { Directions, Constants, Tetrominos } from './data'
import { Vector } from '@juan-utils/structures';
import { createIdentityLogger as Logger, Levels } from '@juan-utils/simple-logger'
import { prop, pipe, isNil } from '@juan-utils/functions';

const logger = Logger(Levels.Off);

const {
    UP, DOWN, LEFT, RIGHT, 
    DIAG_DOWN_LEFT, DIAG_DOWN_RIGHT,
    DIAG_UP_LEFT, DIAG_UP_RIGHT
} = Directions

const createPiece = (position,rotations,currentRot=0) => {
    let rot = currentRot;
    let pos = position;
    return {
        get pos(){ return pos },
        rotations,
        rotate(){ rot = (rot + 1) % rotations.length; return this },
        move(dir){ pos = pos.add(dir); return this; },
        getBlocks(){ return rotations[rot](pos) },
        getPosition(){ return pos.toArray() },
        clone(){ return createPiece(pos,rotations,rot) },
        teleport(next){ pos = next; return this }
    }
}

const createRotation = (...dirs) => {
    return (pos) => [
        pos,
        ...dirs.map(dir => pos.add(dir) )
    ]
}

//O
const createSquare = (pos) => {
    const rotations = [
        createRotation(RIGHT,DOWN,DIAG_DOWN_RIGHT)
    ]
    return createPiece(pos,rotations);
}

//I
const createHero = (pos) => {
    const rotations = [
        createRotation(UP,DOWN,DOWN.scale(2)),
        createRotation(LEFT,RIGHT,RIGHT.scale(2))
    ]
    return createPiece(pos,rotations);
} 

//Z
const createMofo = (pos) => {
    const rotations = [
        createRotation(UP,RIGHT,DIAG_UP_LEFT),
        createRotation(UP,DIAG_UP_RIGHT,DIAG_UP_RIGHT.add(UP))
    ]
    return createPiece(pos,rotations);
}

//S
const createAhole = (pos) => {
    const rotations = [
        createRotation(UP,LEFT,DIAG_UP_RIGHT),
        createRotation(UP,DIAG_UP_LEFT,DIAG_UP_LEFT.add(UP))
    ]
    return createPiece(pos,rotations);
}

//T
const createTee = (pos) => {
    const rotations = [
        createRotation(UP,LEFT,RIGHT),
        createRotation(UP,DOWN,RIGHT),
        createRotation(DOWN,LEFT,RIGHT),
        createRotation(UP,DOWN,LEFT),
    ]
    return createPiece(pos,rotations);
}

//L
const createSidekick = (pos) => {
    const rotations = [
        createRotation(UP,UP.scale(2),RIGHT),
        createRotation(DOWN,RIGHT,RIGHT.scale(2)),
        createRotation(DOWN,DOWN.scale(2),LEFT),
        createRotation(UP,LEFT,LEFT.scale(2)),
    ]
    return createPiece(pos,rotations);
} 

//J
const createOtherSidekick = (pos) => {
    const rotations = [
        createRotation(UP,UP.scale(2),LEFT),
        createRotation(UP,RIGHT,RIGHT.scale(2)),
        createRotation(RIGHT,DOWN,DOWN.scale(2)),
        createRotation(DOWN,LEFT,LEFT.scale(2)),
    ]
    return createPiece(pos,rotations);
}

const createPieceFromType = (type) => {
    const pos = Vector(5,-3);
    const { O , I , Z , S , T , L , J } = Tetrominos;
    switch(type){
        case O:
            return createSquare(pos)
        case I:
            return createHero(pos)
        case Z:
            return createMofo(pos)
        case S:
            return createAhole(pos)
        case T:
            return createTee(pos)
        case L:
            return createSidekick(pos)
        case J:
            return createOtherSidekick(pos)
    }
}

const Tile = (empty=true,color="") => ({
    empty,color
})

const createGrid = (width , height) => {
    const data = [];
    for( let i = 0 ; i < width ; i++ ){
        const arr = []
        for( let j = 0 ; j < height ; j++ ){
            arr.push(Tile())
        }
        data.push(arr)
    }
    return {
        collides({ x , y }){
            const isEmpty = pipe( prop(x) , prop(y) , prop("empty") )(data)
            return false
            return isEmpty === true && !isNil(isEmpty);
        },
        occupyCell({ x , y , color }){
            data[x][y] = Tile(false,color);
        },
        emptyCell({ x , y }){
            data[x][y] = Tile();
        }
    }
}

export const createEngine = (p) => {
    let piece = createAhole(Vector(5,5));
    const queue = [ ]
    let pocket = null;
    const grid = createGrid(10,20);
    const isInside = ({ x , y }) => {
        const { rows , cols } = Constants
        return x >= 0 && y >= -4 && x < cols && y < rows
    }
    return {
        tick(){
            const aux = piece.clone().move(DOWN);
            if( grid.collides(aux.pos) || !isInside(aux.pos) ){
                //TODO: Finish this
            }else{
                piece.move(DOWN)
            }
        }, 
        pocket(){
            if( pocket ){
                if( pocket.getBlocks().every(isInside) ){
                    const aux = piece.clone();
                    piece = pocket.teleport(piece.pos).clone();
                    pocket = aux
                }
            } else {
                pocket = piece.clone();
                piece = queue.pop().clone().teleport(piece.pos) 
            }
        },  //swap with pocketed piece
        moveLeft(){ 
            const aux = piece.clone().move(LEFT);
            if( aux.getBlocks().every(isInside) ){
                piece.move(LEFT); 
            }
        },
        moveRight(){
            const aux = piece.clone().move(RIGHT);
            if( aux.getBlocks().every(isInside) ){
                piece.move(RIGHT); 
            }
        },
        drop(){ piece.move(DOWN); },
        rotate(){ 
            const aux = piece.clone().rotate()
            if( aux.getBlocks().every(isInside) ){
                piece.rotate() 
            }
        },
        get(){
            return {
                piece,
                queue: queue.slice(0,5),
                grid: {},
            }
        }, //get static grid + active piece
    }
}