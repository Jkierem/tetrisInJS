import { createGrid } from './grid';
import { createGrabBag } from './grabbag'
import { createPieceFromType } from './pieces';
import { Directions, Constants, Types } from './data'
import { threshold, lessThan, between, moreOrEqualTo } from './threshold';
import { justOf } from '../../juan-utils/packages/functions/modules';

const { DOWN , RIGHT , LEFT } = Directions

const bagConfig = {
    options: Types,
    quantity: 3
};

const level = (level,framerate) => ({ level, framerate })

const levelSelector = threshold([
    [ lessThan(1500) , justOf(level(1,60)) ],
    [ between(1500,4500) , justOf(level(2,30)) ],
    [ between(4500,8000) , justOf(level(3,15)) ],
    [ between(8000,11000) , justOf(level(4,10)) ],
    [ between(11000,16000) , justOf(level(5,5)) ],
    [ moreOrEqualTo(16000) , justOf(level("MAX",2)) ],
])

export const createEngine = () => {
    const { rows , cols } = Constants
    let bag = createGrabBag(bagConfig)
    let queue = bag.get(5).map(createPieceFromType);
    let grid = createGrid(cols,rows);
    let piece = createPieceFromType(bag.get());
    let pocket = null;
    let score = 0;
    let lost = false;
    let running = true;
    let level = 1;
    
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
                        queue.push(createPieceFromType(bag.get()));
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
                    queue.push(createPieceFromType(bag.get()));
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
            piece = createPieceFromType(bag.get());
            pocket = null;
            score = 0;
            lost = false;
            running = true;
        },
    }
}