import { repeat } from "./core/functions";

export interface GrabBagConfig<A> {
    options: A[];
    quantity: number
}

export interface OptionEntry<A> {
    value: A,
    quantity: number
}

export type Bag<A> = OptionEntry<A>[]

export interface GrabBag<A> {
    bag: Bag<A>;
    getOnce: () => A;
    get(n: number): A[]
}

export const createGrabBag = <A>(config: GrabBagConfig<A>): GrabBag<A> => {
    const { options , quantity } = config;
    const generate = (): Bag<A> => options.map( option => ({
        value: option,
        quantity,
    }))
    let bag = generate()
    return {
        bag,
        get(n: number){
            return repeat(n, () => 0).map(this.getOnce)
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