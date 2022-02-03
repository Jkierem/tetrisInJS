import { justOf } from './core/functions';
import { createGrid, Grid } from './grid';
import { createGrabBag } from './grabbag'
import { createPieceFromType, Piece } from './pieces';
import { Directions, Constants, Types, TetrominoTypes } from './data'
import { threshold, lessThan, between, moreOrEqualTo } from './threshold';

const { DOWN , RIGHT , LEFT } = Directions

const bagConfig = {
    options: Types as TetrominoTypes[],
    quantity: 2
};

type LevelInfo = {
    level: number | "MAX",
    framerate: number
}

const level = (level: number | "MAX", framerate: number): LevelInfo => ({ level, framerate })

const levelSelector = threshold([
    [ lessThan(1000) , justOf(level(1,60)) ],
    [ between(1000,3500) , justOf(level(2,30)) ],
    [ between(3500,8000) , justOf(level(3,15)) ],
    [ between(8000,12000) , justOf(level(4,10)) ],
    [ between(12000,16000) , justOf(level(5,5)) ],
    [ moreOrEqualTo(16000) , justOf(level("MAX",2)) ],
])

export interface EngineState {
    grid: Grid,
    piece: Piece,
    pocket: Piece | null,
    score: number,
    lost: boolean,
    level: LevelInfo['level'],
    running: boolean,
    queue: Piece[]
}

export interface Engine {
    tick: () => void
    drop: () => void
    togglePause: () => void
    pause: () => void
    pocket: () => void
    moveLeft: () => void
    moveRight: () => void
    softdrop: () => void
    rotate: () => void
    isValidPosition: (p: Piece) => boolean
    get: () => EngineState
    getFrameCount: () => number
    restart: () => void
}

export const createEngine = (): Engine => {
    const { rows , cols } = Constants
    let bag = createGrabBag<TetrominoTypes>(bagConfig)
    let queue = bag.get(5).map(createPieceFromType);
    let grid = createGrid(cols,rows);
    let piece = createPieceFromType(bag.getOnce());
    let pocket = null;
    let score = 0;
    let lost = false;
    let running = true;
    let level: LevelInfo['level'] = 1;
    
    const isInside = ({ x , y }) => {
        return x >= 0 && y >= -4 && x < cols && y < rows
    }

    return {
        tick(){
            if(!lost && running){
                const aux = piece.clone().move(DOWN);
                const blocks = aux.getBlocks()
                const collides = blocks.some( b => grid.collides(b) )
                const isOutside = !blocks.every(isInside)
                if(  collides || isOutside ){
                    const pblocks = piece.getBlocks() 
                    if( pblocks.some( ({y}) => y < 0 ) ){
                        lost = true;
                    } else {
                        pblocks.map( block => {
                            grid.occupyCell(block,piece.color);
                        })
                        score += grid.clean();
                        piece = queue.shift();
                        queue.push(createPieceFromType(bag.getOnce()));
                    }
                }else{
                    piece.move(DOWN)
                }
            }
        },
        drop(){
            if(!lost && running){
                let aux = piece.clone().move(DOWN);
                let blocks = aux.getBlocks()
                let collides = blocks.some( b => grid.collides(b) )
                let isOutside = !blocks.every(isInside)
                while( !collides && !isOutside ){
                    piece = aux.clone();
                    aux = piece.clone().move(DOWN);
                    blocks = aux.getBlocks();
                    collides = blocks.some(b => grid.collides(b))
                    isOutside = !blocks.every(isInside)
                }
                const pblocks = piece.getBlocks() 
                if( pblocks.some( ({y}) => y < 0 ) ){
                    lost = true;
                } else {
                    pblocks.map( block => {
                        grid.occupyCell(block,piece.color);
                    })
                    score += grid.clean();
                    piece = queue.shift();
                    queue.push(createPieceFromType(bag.getOnce()));
                }
            }
        },
        togglePause(){
            running = !running
        },
        pause(){
            running = false;
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
                queue.push(createPieceFromType(bag.getOnce()));
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
        softdrop(){ 
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
                pocket,
                score,
                lost,
                level,
                running,
                queue: queue.slice(0,5),
            }
        },
        getFrameCount(){
            const { level:lvl , framerate } = levelSelector(score)
            level = lvl
            return framerate
        },
        restart(){
            bag = createGrabBag(bagConfig)
            queue = bag.get(5).map(createPieceFromType);
            grid = createGrid(cols,rows);
            piece = createPieceFromType(bag.getOnce());
            pocket = null;
            score = 0;
            lost = false;
            running = true;
        },
    }
}