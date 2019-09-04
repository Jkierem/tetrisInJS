import * as p5 from 'p5';
import { createCore } from './utils';
import { createEngine } from './engine';
import { createPlotter } from './plotter';

let main = (p) => {
    const core = createCore(p)
    const engine = createEngine(p)
    const plotter = createPlotter(core,engine);
    let frame = 0;

    p.setup = () => {
        p.createCanvas(650,700)
        //p.noLoop();
    };

    p.draw = () => {
        p.background(255);
        p.resetMatrix();
        plotter.draw();
        frame++;
        if( frame >= 60 ){
            engine.tick();
            frame = 0
        }
    };

    p.keyTyped = () => {
        switch(p.key) {
            case "a":
            case "A":
                engine.moveLeft();
                break;
            case "d":
            case "D":
                engine.moveRight();
                break;
            case "w":
            case "W":
                engine.rotate()
                break;
            case "s":
            case "S":
                engine.drop()
                break;
            case "f":
            case "F":
                engine.pocket();
                break;
        }
    }
}

const P5 = new p5(main);