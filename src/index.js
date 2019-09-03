import * as p5 from 'p5';
import { createCore } from './utils';
import { createEngine } from './engine';
import { createPlotter } from './plotter';

let main = (p) => {
    const core = createCore(p)
    const engine = createEngine(p)
    const plotter = createPlotter(core,engine);

    p.setup = () => {
        p.createCanvas(800,800)
        p.noLoop();
    };

    p.draw = () => {
        p.background(255);
        p.resetMatrix();
        plotter.draw();
    };
}

const P5 = new p5(main);