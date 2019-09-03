import { getData } from './data'
import { JString } from '@juan-utils/structures'

export const createLSystem = () => {
    const createRule = (a,b) => ({
        evaluate: (x) => x === a ? true : false,
        apply: () => b
    })
    const createConstant = (a) => createRule(a,a)
    
    const data = getData();
    const rules = [
        ...data.rules.map( ({ input , output }) => createRule(input,output) ),
        ...data.constants.map(createConstant)
    ];

    return {
        generate(statement){
            return JString(statement).innerMap(char => {
                return rules.find( r => r.evaluate(char) ).apply();
            });
        },
        multi(init,iters){
            let current = init;
            if( iters > 0 ){
                current = this.generate(current);
                return this.multi(current,iters - 1)
            }else{
                return current;
            }
        }
    }
}