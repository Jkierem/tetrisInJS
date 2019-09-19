import { identity } from "@juan-utils/functions";

export const createCore = (p) => {
    return {
        safe(f=identity){
            p.push();
            f(p,this);
            p.pop();
            return this;
        },
        open(f=identity){
            p.push();
            f(p,this);
            return this;
        },
        close(){
            p.pop();
            return this;
        },
        unsafe(f=identity){
            f(p,this);
            return this;
        }
    }
}

export const runConfirm = (before,question,affirmative,negative) => {
    before();
    const result = confirm(question);
    result ? affirmative() : negative();
}

export const githubLink = () => {
    const textNode = document.createTextNode("Source")
    const link = document.createElement("a");
    const container = document.createElement("div")
    link.href = "http://github.com/jkierem/tetrisInJs"
    container.classList = ["link"]
    link.appendChild(textNode);
    container.appendChild(link);
    document.querySelector("body").appendChild(container)
}