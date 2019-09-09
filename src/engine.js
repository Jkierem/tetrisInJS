import { Vector } from '@juan-utils/structures';
import { prop, pipe, isNil } from '@juan-utils/functions';
import { createIdentityLogger as Logger, Levels } from '@juan-utils/simple-logger'
import { createGrabBag } from './grabbag'
import { Directions, Constants, Tetrominos, Colors } from './data'

const logger = Logger(Levels.Off);

const {
    UP, DOWN, LEFT, RIGHT, 
    DIAG_DOWN_RIGHT,
    DIAG_UP_LEFT, DIAG_UP_RIGHT
} = Directions

const createPiece = (type,position,rotations,color,currentRot=0) => {
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
        getPosition(){ return pos.toArray() },
        clone(){ return createPiece(type,pos,rotations,color,rot) },
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
    return createPiece("O",pos,rotations,Colors.yellow);
}

//I
const createHero = (pos) => {
    const rotations = [
        createRotation(UP,DOWN,DOWN.scale(2)),
        createRotation(LEFT,RIGHT,RIGHT.scale(2))
    ]
    return createPiece("I",pos,rotations,Colors.blue);
} 

//S
const createAhole = (pos) => {
    const rotations = [
        createRotation(UP,LEFT,DIAG_UP_RIGHT),
        createRotation(UP,DIAG_UP_LEFT,DIAG_UP_LEFT.add(UP))
    ]
    return createPiece("S",pos,rotations,Colors.red);
}

//Z
const createMofo = (pos) => {
    const rotations = [
        createRotation(UP,RIGHT,DIAG_UP_LEFT),
        createRotation(UP,DIAG_UP_RIGHT,DIAG_UP_RIGHT.add(UP))
    ]
    return createPiece("Z",pos,rotations,Colors.green);
}

//T
const createTee = (pos) => {
    const rotations = [
        createRotation(UP,LEFT,RIGHT),
        createRotation(UP,DOWN,RIGHT),
        createRotation(DOWN,LEFT,RIGHT),
        createRotation(UP,DOWN,LEFT),
    ]
    return createPiece("T",pos,rotations,Colors.purple);
}

//L
const createSidekick = (pos) => {
    const rotations = [
        createRotation(UP,UP.scale(2),RIGHT),
        createRotation(DOWN,RIGHT,RIGHT.scale(2)),
        createRotation(DOWN,DOWN.scale(2),LEFT),
        createRotation(UP,LEFT,LEFT.scale(2)),
    ]
    return createPiece("L",pos,rotations,Colors.orange);
} 

//J
const createOtherSidekick = (pos) => {
    const rotations = [
        createRotation(UP,UP.scale(2),LEFT),
        createRotation(UP,RIGHT,RIGHT.scale(2)),
        createRotation(RIGHT,DOWN,DOWN.scale(2)),
        createRotation(DOWN,LEFT,LEFT.scale(2)),
    ]
    return createPiece("J",pos,rotations,Colors.pink);
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

const createRandomPiece = () => {
    const types = Object.keys(Tetrominos);
    const typeN = Math.floor(Math.random() * types.length);
    return createPieceFromType(types[typeN]);
}

const Tile = (empty=true,color="") => ({ empty , color })

const createGrid = (width , height) => {
    let data = [];
    for( let i = 0 ; i < height ; i++ ){
        const arr = []
        for( let j = 0 ; j < width ; j++ ){
            arr.push(Tile())
        }
        data.push(arr)
    }
    return {
        data,
        collides({ x , y }){
            const isEmpty = pipe( prop(y) , prop(x) , prop("empty") )(data)
            return isEmpty === false && !isNil(isEmpty);
        },
        occupyCell({ x , y },color){
            data[y][x] = Tile(false,color);
        },
        emptyCell({ x , y }){
            data[y][x] = Tile();
        },
        clean(){
            data = data.filter( row => row.some(t => t.empty))
            while( data.length !== height ){
                const arr = []
                for( let j = 0 ; j < width ; j++ ){
                    arr.push(Tile())
                }
                data = [ arr , ...data ]
            }
        },
        map(f){
            for( let i = 0 ; i < width ; i++ ){
                for( let j = 0 ; j < height ; j++ ){
                    f({
                        pos: Vector(i,j),
                        ...data[j][i]
                    })
                }
            }
        }
    }
}

const types = Object.keys(Tetrominos);

export const createEngine = (p) => {
    const bag = createGrabBag({
        options: types,
        quantity: 5
    })
    let currentType = 0
    let piece = createPieceFromType(bag.get());
    const queue = bag.get(5).map(createPieceFromType);
    let pocket = null;
    const grid = createGrid(10,20);
    const isInside = ({ x , y }) => {
        const { rows , cols } = Constants
        return x >= 0 && y >= -4 && x < cols && y < rows
    }
    return {
        tick(){
            const aux = piece.clone().move(DOWN);
            const blocks = aux.getBlocks()
            const collides = blocks.some( b => grid.collides(b) )
            const isOutside = !blocks.every(isInside)
            if(  collides || isOutside ){
                piece.getBlocks().map( block => {
                    grid.occupyCell(block,piece.color);
                })
                grid.clean();
                piece = queue.shift();
                queue.push(createPieceFromType(bag.get()));
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
                piece = queue.shift().clone().teleport(piece.pos) 
                queue.push(createPieceFromType(bag.get()));
            }
        },
        moveLeft(){ 
            const aux = piece.clone().move(LEFT);
            if( this.isValidPosition(aux) ){
                piece.move(LEFT); 
            }
        },
        moveRight(){
            const aux = piece.clone().move(RIGHT);
            if( this.isValidPosition(aux) ){
                piece.move(RIGHT); 
            }
        },
        drop(){ 
            const aux = piece.clone().move(DOWN);
            if( this.isValidPosition(aux) ){
                piece.move(DOWN);
            }
        },
        rotate(){ 
            const aux = piece.clone().rotate()
            if( this.isValidPosition(aux) ){
                piece.rotate() 
            }
        },
        isValidPosition(piece){
            const blocks = piece.getBlocks()
            const collides = blocks.some( b => grid.collides(b) )
            const isIn = blocks.every(isInside)
            return !collides && isIn
        },
        get(){
            return {
                grid,
                piece,
                queue: queue.slice(0,5),
            }
        },
        cycle(){
            currentType = (currentType + 1)%types.length;
            piece = createPieceFromType(types[currentType]);
        }
    }
}