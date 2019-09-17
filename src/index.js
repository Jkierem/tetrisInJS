import * as p5 from 'p5';
import { createCore, runConfirm } from './utils';
import { createEngine } from './engine';
import { createPlotter } from './plotter';
import { KeyCodes } from './data';

window.addEventListener('keydown', e => e.preventDefault())

let main = (p) => {
    const core = createCore(p)
    const engine = createEngine()
    const plotter = createPlotter(core,engine);
    let frame = 0;

    p.setup = () => {
        p.createCanvas(700,700)
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

    p.keyPressed = () => {
        const { lost , running } = engine.get();
        switch(p.keyCode) {
            case KeyCodes.A:
            case KeyCodes.LEFT_ARROW:
                if(!lost && running)
                engine.moveLeft();
                break;
            case KeyCodes.D:
            case KeyCodes.RIGHT_ARROW:
                if(!lost && running)
                engine.moveRight();
                break;
            case KeyCodes.W:
            case KeyCodes.UP_ARROW:
                if(!lost && running)
                engine.rotate()
                break;
            case KeyCodes.S:
            case KeyCodes.DOWN_ARROW:
                if(!lost && running)
                engine.softdrop()
                break;
            case KeyCodes.SHIFT:
                if(!lost && running)
                engine.pocket();
                break;
            case KeyCodes.R:
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
            case KeyCodes.P:
                engine.togglePause();
                break;
            case KeyCodes.SPACE:
                engine.drop();
                break;
        }
    }
}

const P5 = new p5(main);