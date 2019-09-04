import { Constants, Colors } from "./data";
import { Vector } from '@juan-utils/structures'
import { mult } from "@juan-utils/functions";

const drawOuterRectangle = (p,Constants) => {
    const { cols , rows , length } = Constants;
    const widthVector = Vector.of(length*cols,0)
    const heightVector = Vector.of(0,length*rows)
    const topLeft = Vector.of(0,0);
    const topRight = topLeft.add(widthVector);
    const bottomRight = topRight.add(heightVector);
    const bottomLeft = bottomRight.sub(widthVector);
    const l1 = [ 
        ...topLeft.toArray(), 
        ...topRight.toArray() 
    ];
    const l2 = [ 
        ...topRight.toArray(),
        ...bottomRight.toArray()
    ]
    const l3 = [
        ...bottomRight.toArray(),
        ...bottomLeft.toArray()
    ]
    const l4 = [
        ...bottomLeft.toArray(),
        ...topLeft.toArray(),
    ]
    p.stroke(Colors.black);
    [ l1, l2, l3, l4 ].forEach( l => p.line(...l) );
}

const drawVerticalLines = (core,Constants) => {
    const { length , cols , rows } = Constants
    core.safe( (p) => {
        p.stroke(230);
        p.translate(length,0)
        for( let i = 0 ; i < cols-1 ; i++ ){
            p.line(0,1,0,(rows*length)-1)
            p.translate(length,0)
        }
    })
}

const drawHorizontalLines = (core,Constants) => {
    const { length , cols , rows } = Constants
    core.safe( (p) => {
        p.stroke(230);
        p.translate(0,length)
        for( let i = 0 ; i < rows-1 ; i++ ){
            p.line(1,0,(cols*length)-1,0)
            p.translate(0,length)
        }
    })
}

const drawBlock = (p,pos,length,color) => {
    const { x , y } = pos;
    if( x >= 0 && y >= 0 ){
        p.fill(color)
        p.stroke(color)
        p.rect(x,y,length,length);
    }
}

export const createPlotter = (core,engine) => {

    const drawGrid = () => {
        core.safe( p => {
            p.translate(20,20)
            drawOuterRectangle(p,Constants)
            drawVerticalLines(core,Constants)
            drawHorizontalLines(core,Constants)
        })
    }

    const drawPieces = () => {
        const { length } = Constants
        const { red } = Colors
        core.safe( p => {
            p.translate(20,20)
            const { grid, piece, queue } = engine.get();
            piece.getBlocks().forEach( pos => {
                const abs = pos.map(mult(length));
                drawBlock(p,abs,length,piece.color)
            })
            grid.map( tile => {
                if(!tile.empty){
                    const abs = tile.pos.map(mult(length));
                    drawBlock(p,abs,length,tile.color);
                }
            })
        })
    }

    return {
        draw(){
            drawGrid();
            drawPieces();
        }
    }
}