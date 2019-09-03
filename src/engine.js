const createPiece = (position,rotations) => {
    let rot = 0;
    let pos = position;
    return {
        rotate(){ rot = (rot + 1) % rotations.length },
        move(dir){ pos = pos.add(dir) },
        getSquares(){ rotations[rot](pos) },
        getPosition(){ return position.toArray() },
    }
}

const createSquare = (pos) => {
    const rotations = [

    ]
} //O
const createHero = (pos) => {} //I
const createMofo = (pos) => {} //Z
const createAhole = (pos) => {} //S
const createTee = (pos) => {} //T
const createNotHero = (pos) => {} //L
const createOtherNotHero = () => {} //J

export const createEngine = (p) => {
    return {
        tick(){}, //update state
        move(){}, //move active piece
        swap(){},  //swap with pocketed piece
        get(){}, //get static grid + active piece
    }
}