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

export const createLagrangeInterpolator = (points) => {
    const createLagrangePolynomial = (point,index,arr) => {
        const xj = point.x;
        return (x) => {
            return arr.reduce(
                (acc,p,i) => {
                    if( i !== index ){
                        const xi = p.x;
                        return acc * ((x-xi)/(xj-xi))
                    }
                    return acc;
                }
                ,1)
        }
    }

    const polynomials = points.map(createLagrangePolynomial);

    return (x) => polynomials.reduce( (acc,pol,index) => {
        return acc + (points[index].y * pol(x))
    },0);
}