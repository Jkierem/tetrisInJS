import { identity2 as identity } from "./core/functions";
import type { P5 } from './core/types'

export type P5Operation = (p: P5, core: Core) => void

export interface Core {
    safe(f?: P5Operation): Core
    open(f?: P5Operation): Core
    close(): Core
    unsafe(f?: P5Operation): Core
}

export const createCore = (p: P5): Core => {
    return {
        safe(f=identity){
            p.push();
            f(p, this);
            p.pop();
            return this;
        },
        open(f=identity){
            p.push();
            f(p, this);
            return this;
        },
        close(){
            p.pop();
            return this;
        },
        unsafe(f=identity){
            f(p, this);
            return this;
        }
    }
}

export const runConfirm = (before: () => void, question: string, affirmative: () => void, negative: () => void) => {
    before();
    const result = confirm(question);
    result ? affirmative() : negative();
}

export const githubLink = () => {
    const textNode = document.createTextNode("Source")
    const link = document.createElement("a");
    const container = document.createElement("div")
    link.href = "http://github.com/jkierem/tetrisInJs"
    // @ts-ignore
    container.classList = ["link"]
    link.appendChild(textNode);
    container.appendChild(link);
    document.querySelector("body").appendChild(container)
}