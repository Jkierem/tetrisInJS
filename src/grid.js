import { Vector } from '@juan-utils/structures';
import { prop, pipe, isNil } from '@juan-utils/functions';

const Tile = (empty=true,color="") => ({ empty , color })

export const createGrid = (width , height) => {
    let data = [];
    for( let i = 0 ; i < height ; i++ ){
        const arr = []
        for( let j = 0 ; j < width ; j++ ){
            arr.push(Tile())
        }
        data.push(arr)
    }
    return {
        data,
        collides({ x , y }){
            const isEmpty = pipe( prop(y) , prop(x) , prop("empty") )(data)
            return isEmpty === false && !isNil(isEmpty);
        },
        occupyCell({ x , y },color){
            data[y][x] = Tile(false,color);
        },
        emptyCell({ x , y }){
            data[y][x] = Tile();
        },
        clean(){
            data = data.filter( row => row.some(t => t.empty))
            while( data.length !== height ){
                const arr = []
                for( let j = 0 ; j < width ; j++ ){
                    arr.push(Tile())
                }
                data = [ arr , ...data ]
            }
        },
        map(f){
            for( let i = 0 ; i < width ; i++ ){
                for( let j = 0 ; j < height ; j++ ){
                    f({
                        pos: Vector(i,j),
                        ...data[j][i]
                    })
                }
            }
        }
    }
}