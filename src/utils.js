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