import { createGrid } from './grid';
import { createGrabBag } from './grabbag'
import { createPieceFromType } from './pieces';
import { Directions, Constants, Types } from './data'

const { DOWN , RIGHT , LEFT } = Directions

const bagConfig = {
    options: Types,
    quantity: 10
};

export const createEngine = () => {
    const { rows , cols } = Constants
    const bag = createGrabBag(bagConfig)
    const queue = bag.get(5).map(createPieceFromType);
    const grid = createGrid(cols,rows);
    let piece = createPieceFromType(bag.get());
    let pocket = null;
    let score = 0;
    
    const isInside = ({ x , y }) => {
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
                score += grid.clean();
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
                pocket,
                score,
                queue: queue.slice(0,5),
            }
        },
        getFrameCount(){
            return 60
        }
    }
}