import type { P5, Tuple4 } from './core/types'
import { ImmutableVector, Vector2 } from './core/structures/Vector'
import { Constants, Colors, Tetrominos, HelpText } from "./data";
import { Core } from './utils';

const mult = (a: number) => (b: number) => a*b

const drawOuterRectangle = (p: P5, constants: typeof Constants) => {
    const { cols , rows , length } = constants;
    const widthVector = Vector2(length * cols, 0)
    const heightVector = Vector2(0, length * rows)
    const topLeft = Vector2(0,0);
    const topRight = topLeft.add(widthVector);
    const bottomRight = topRight.add(heightVector);
    const bottomLeft = bottomRight.sub(widthVector);
    const l1: Tuple4<number> = [ 
        ...topLeft.toTuple(), 
        ...topRight.toTuple() 
    ];
    const l2: Tuple4<number> = [ 
        ...topRight.toTuple(),
        ...bottomRight.toTuple()
    ]
    const l3: Tuple4<number> = [
        ...bottomRight.toTuple(),
        ...bottomLeft.toTuple()
    ]
    const l4: Tuple4<number> = [
        ...bottomLeft.toTuple(),
        ...topLeft.toTuple(),
    ]
    p.stroke(Colors.black);
    [ l1, l2, l3, l4 ].forEach( l => p.line(...l) );
}

const drawVerticalLines = (core: Core, constants: typeof Constants) => {
    const { length , cols , rows } = constants
    core.safe((p) => {
        p.stroke(230);
        p.translate(length,0)
        for( let i = 0 ; i < cols-1 ; i++ ){
            p.line(0,1,0,(rows*length)-1)
            p.translate(length,0)
        }
    })
}

const drawHorizontalLines = (core: Core, constants: typeof Constants) => {
    const { length , cols , rows } = constants
    core.safe( (p) => {
        p.stroke(230);
        p.translate(0,length)
        for( let i = 0 ; i < rows-1 ; i++ ){
            p.line(1,0,(cols*length)-1,0)
            p.translate(0,length)
        }
    })
}

const drawBlock = (p: P5, pos: ImmutableVector<2>, length: number, color: string) => {
    const { x , y } = pos;
    if( x >= 0 && y >= 0 ){
        p.fill(color)
        p.noStroke()
        p.rect(x,y,length,length);
    }
}

export const createPlotter = (core: Core, engine) => {
    
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

    const drawHUD = () => {
        const { score, level, running } = engine.get();
        const { cols , length } = Constants;
        core.safe((p) => {
            p.fill(0)
            p.textSize(32)
            if( !running ){
                core.safe( p => {
                    p.translate( 90 , 50 )
                    p.text("PAUSED",0,0)
                })
            }
            p.translate(cols * length + 20, 30);
            p.text("Level:",0,0);
            core.safe( p => {
                p.translate(100,0)
                p.text("Score:",0,0)
                p.translate(0,32)
                p.text(score,0,0)
            })
            p.translate(0,32);
            p.text(level,0,0);
            p.translate(100,340);
            const helpSize = 20;
            const lineSkip = helpSize + 5;
            p.textSize(helpSize);
            HelpText.forEach( line => {
                p.translate(0,lineSkip);
                p.text(line,0,0)
            })
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
                    pocket.clone()
                        .teleport(Vector2(0,0))
                        .getStandardBlocks()
                        .forEach( pos => {
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
            drawHUD();
            drawQueuePocket();
            drawIfLost()
            core.close();
        }
    }
}