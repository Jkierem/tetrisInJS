import * as p5 from 'p5';
import { createCore } from './utils';
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
        const { lost } = engine.get();
        switch(p.key) {
            case "a":
            case "A":
                if(!lost)
                engine.moveLeft();
                break;
            case "d":
            case "D":
                if(!lost)
                engine.moveRight();
                break;
            case "w":
            case "W":
                if(!lost)
                engine.rotate()
                break;
            case "s":
            case "S":
                if(!lost)
                engine.drop()
                break;
            case "f":
            case "F":
                if(!lost)
                engine.pocket();
                break;
            case 'r':
            case 'R':
                engine.restart();
                break;
        }
    }
}

const P5 = new p5(main);