import * as p5 from 'p5';
import { createCore, runConfirm } from './utils';
import { createEngine } from './engine';
import { createPlotter } from './plotter';

let main = (p) => {
    const core = createCore(p)
    const engine = createEngine()
    const plotter = createPlotter(core,engine);
    let frame = 0;

    p.setup = () => {
        p.createCanvas(650,700)
    };

    p.draw = () => {
        p.background(255);
        p.resetMatrix();
        plotter.draw();
        frame++;
        if( frame >= engine.getFrameCount() ){
            engine.tick();
            frame = 0
        }
    };

    p.keyTyped = () => {
        const { lost , running } = engine.get();
        switch(p.key) {
            case "a":
            case "A":
                if(!lost && running)
                engine.moveLeft();
                break;
            case "d":
            case "D":
                if(!lost && running)
                engine.moveRight();
                break;
            case "w":
            case "W":
                if(!lost && running)
                engine.rotate()
                break;
            case "s":
            case "S":
                if(!lost && running)
                engine.softdrop()
                break;
            case "f":
            case "F":
                if(!lost && running)
                engine.pocket();
                break;
            case 'r':
            case 'R':
                if( !lost ){
                    runConfirm(
                        () => engine.pause(),
                        "Restart?",
                        () => engine.restart(),
                        () => {}
                    )
                } else {
                    engine.restart();
                }
                break;
            case 'p':
            case 'P':
                engine.togglePause();
                break;
            case 'h':
            case 'H':
                engine.drop();
                break;
        }
    }
}

const P5 = new p5(main);