import { repeat } from "@juan-utils/functions";
import { add } from "../../juan-utils/packages/functions/modules";

export const createGrabBag = (config) => {
    const { options , quantity } = config;
    const generate = () => options.map( option => ({
        value: option,
        quantity,
    }))
    let bag = generate()
    return {
        bag,
        get(n){
            if( n === undefined ){
                return this.getOnce();
            }
            return repeat(n,0).map(this.getOnce)
        },
        getOnce(){
            const r = Math.floor(Math.random() * bag.length)
            const result = bag[r].value;
            bag[r].quantity--;
            bag = bag.filter( b => b.quantity > 0 );
            if( bag.length === 0 ){
                bag = generate()
            }
            return result;
        }
    }
}