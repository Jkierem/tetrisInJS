import { Vector2 } from './core/structures/Vector';
import { prop, pipe, isNil } from './core/functions';

export interface Tile {
    empty: boolean,
    color: string,
}

export type TileRow = Tile[]
export type TileMatrix = TileRow[]
export interface TileData {
    empty: boolean; 
    color: string; 
    pos: Vector2; 
}

const createTile = (empty=true, color=""): Tile => ({ empty , color })

const getScore = (x: number) => {
    switch(x){
        case 1:
            return 100
        case 2:
            return 300
        case 3:
            return 500
        case 4:
            return 1000
        default:
            return 0
    }
}

export interface Grid {
    data: TileMatrix,
    collides: (position: Vector2) => boolean
    occupyCell: (position: Vector2, color: string) => void
    emptyCell: (position: Vector2) => void
    clean: () => number
    map: (f: (tile: TileData) => void) => void
}

export const createGrid = (width: number, height: number): Grid => {
    let data: TileMatrix = [];
    for( let i = 0 ; i < height ; i++ ){
        const arr: Tile[] = []
        for( let j = 0 ; j < width ; j++ ){
            arr.push(createTile())
        }
        data.push(arr)
    }
    return {
        data,
        collides({ x, y }){
            const isEmpty = pipe<TileMatrix, TileRow, Tile, boolean>( prop(y) , prop(x) , prop("empty") )(data)
            return isEmpty === false && !isNil(isEmpty);
        },
        occupyCell({ x , y }, color){
            data[y][x] = createTile(false,color);
        },
        emptyCell({ x , y }){
            data[y][x] = createTile();
        },
        clean(){
            data = data.filter( row => row.some(t => t.empty))
            const res = getScore(height - data.length)
            while( data.length !== height ){
                const arr = []
                for( let j = 0 ; j < width ; j++ ){
                    arr.push(createTile())
                }
                data = [ arr , ...data ]
            }
            return res;
        },
        map(f){
            for( let i = 0 ; i < width ; i++ ){
                for( let j = 0 ; j < height ; j++ ){
                    f({
                        pos: Vector2(i,j),
                        ...data[j][i]
                    })
                }
            }
        }
    }
}