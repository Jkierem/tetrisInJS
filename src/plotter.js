import { Constants, Colors, Tetrominos } from "./data";
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
        p.noStroke()
        p.rect(x,y,length,length);
    }
}

export const createPlotter = (core,engine) => {
    
    const drawGrid = () => {
        core.safe( p => {
            drawOuterRectangle(p,Constants)
            drawVerticalLines(core,Constants)
            drawHorizontalLines(core,Constants)
        })
    }

    const drawPieces = () => {
        const { length } = Constants
        core.safe( p => {
            const { grid, piece } = engine.get();
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

    const drawScore = () => {
        const { score } = engine.get();
        const { cols , length } = Constants;
        core.safe((p) => {
            p.translate(cols * length + 20, 30);
            p.fill(0)
            p.textSize(32)
            p.text("Score:",0,0);
            p.translate(0,32);
            p.text(score,0,0);
        })
    }

    const drawQueuePocket = () => {
        const { queue , pocket } = engine.get();
        const { cols , length} = Constants
        core.safe( (p) => {
            p.translate(cols * length + 20, 80);
            p.stroke(0)
            p.rect(0,0,70,400);
            core.safe( p => {
                p.translate(-45,10)
                p.scale(0.3)
                queue.reverse()
                queue.forEach( (piece) => {
                    p.translate(0,250)
                    if( piece.type === Tetrominos.I ){
                        p.translate(0,-40)
                    }
                    piece.getBlocks().forEach( pos => {
                        const abs = pos.map(mult(50))
                        p.fill(piece.color);
                        p.rect(abs.x,abs.y,50,50)
                    })
                    if( piece.type === Tetrominos.I ){
                        p.translate(0,40)
                    }
                })
            })

            p.translate(0,430)
            p.rect(0,0,70,80);

            if( pocket ){
                core.safe( p => {
                    p.translate(30,35)
                    p.scale(0.3)
                    if( pocket.type === Tetrominos.I ){
                        p.translate(0,-10)
                    }
                    pocket.clone().teleport(Vector(0,0)).getBlocks().forEach( pos => {
                        const abs = pos.map(mult(50))
                        p.fill(pocket.color);
                        p.rect(abs.x,abs.y,50,50)
                    })
                    if( pocket.type === Tetrominos.I ){
                        p.translate(0,10)
                    }
                })
            }

        })
    }

    const drawIfLost = () => {
        const { lost } = engine.get();
        if( lost ){
            core.safe( p => {
                p.translate(0,630)
                p.textSize(24);
                p.text("You Lose. Press R to restart",0,0)
            })
        }
    }

    return {
        draw(){
            core.open( p => p.translate(20,20) )
            drawGrid();
            drawPieces();
            drawScore();
            drawQueuePocket();
            drawIfLost()
            core.close();
        }
    }
}