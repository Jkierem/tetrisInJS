import { TupleN } from "../types"

export interface DynamicVector {
    toArray: () => number[]
    toTuple: <N extends number>() => TupleN<N,number>
    map: (fn: (x: number, idx?: number) => number) => DynamicVector
    add: (other: DynamicVector) => DynamicVector
    sub: (other: DynamicVector) => DynamicVector
    scale: (scale: number) => DynamicVector
    get: (idx: number) => number
    readonly x: number
    readonly y: number
    readonly z: number
}

export interface FixedVector<N extends number> {
    toArray: () => number[]
    toTuple: () => TupleN<N,number>
    map: (fn: (x: number, idx?: number) => number) => FixedVector<N>
    add: (other: FixedVector<N>) => FixedVector<N>
    sub: (other: FixedVector<N>) => FixedVector<N>
    scale: (scalar: number) => FixedVector<N>,
    get: (idx: number) => number
    readonly x: number
    readonly y: number
    readonly z: number
}

export const VectorN = (...a: number[]): DynamicVector => ({
    toArray: () => a,
    toTuple: <A extends number>() => a as TupleN<A, number>,
    map: (fn: (x: number, idx?: number) => number) => VectorN(...a.map(fn)),
    add: (other: DynamicVector) => VectorN(...other.map((b, idx) => (a[idx] ?? 0) + b).toArray()),
    sub: (other: DynamicVector) => VectorN(...other.map((b, idx) => (a[idx] ?? 0) - b).toArray()),
    scale: (s: number) => VectorN(...a.map((v) => v*s)),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return this.get(0) },
    get y(){ return this.get(1) },
    get z(){ return this.get(2) },
})

export const Vector1 = (a: number): FixedVector<1> => ({
    toArray: () => [a],
    toTuple: () => [a] as TupleN<1,number>,
    map: (fn) => Vector1(fn(a,0)),
    add: (o: FixedVector<1>) => Vector1(a + o.x),
    sub: (o: FixedVector<1>) => Vector1(a - o.x),
    scale: (s: number) => Vector1(a*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return 0 },
    get z(){ return 0 },
})

export const Vector2 = (a: number, b: number): FixedVector<2> => ({
    toArray: () => [a,b],
    toTuple: () => [a,b] as TupleN<2,number>,
    map: (fn) => Vector2(fn(a,0), fn(b,1)),
    add: (o: FixedVector<2>) => Vector2(a + o.x, b + o.y),
    sub: (o: FixedVector<2>) => Vector2(a - o.x, b - o.y),
    scale: (s: number) => Vector2(a*s, b*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return b },
    get z(){ return 0 },
})

export const Vector3 = (a: number, b: number, c: number): FixedVector<3> => ({
    toArray: () => [a,b,c],
    toTuple: () => [a,b,c] as TupleN<3,number>,
    map: (fn) => Vector3(fn(a,0), fn(b,1), fn(c,2)),
    add: (o: FixedVector<3>) => Vector3(a + o.x, b + o.y, c + o.z),
    sub: (o: FixedVector<3>) => Vector3(a - o.x, b - o.y, c - o.z),
    scale: (s: number) => Vector3(a*s, b*s, c*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return b },
    get z(){ return c },
})

export const Vector4 = (a: number, b: number, c: number, d: number): FixedVector<4> => ({
    toArray: () => [a,b,c,d],
    toTuple: () => [a,b,c,d] as TupleN<4,number>,
    map: (fn) => Vector4(fn(a,0), fn(b,1), fn(c,2), fn(d,3)),
    add: (o: FixedVector<4>) => Vector4(a + o.x, b + o.y, c + o.z, d + o.get(3)),
    sub: (o: FixedVector<4>) => Vector4(a - o.x, b - o.y, c - o.z, d - o.get(3)),
    scale: (s: number) => Vector4(a*s, b*s, c*s, d*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return b },
    get z(){ return c },
})

export const Vector5 = (a: number, b: number, c: number, d: number, e: number): FixedVector<5> => ({
    toArray: () => [a,b,c,d,e],
    toTuple: () => [a,b,c,d,e] as TupleN<5,number>,
    map: (fn) => Vector5(fn(a,0), fn(b,1), fn(c,2), fn(d,3), fn(e,4)),
    add: (o: FixedVector<5>) => Vector5(a + o.x, b + o.y, c + o.z, d + o.get(3), e + o.get(4)),
    sub: (o: FixedVector<5>) => Vector5(a - o.x, b - o.y, c - o.z, d - o.get(3), e - o.get(4)),
    scale: (s: number) => Vector5(a*s, b*s, c*s, d*s, e*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return b },
    get z(){ return c },
})

export type Vector1 = FixedVector<1>
export type Vector2 = FixedVector<2>
export type Vector3 = FixedVector<3>
export type Vector4 = FixedVector<4>
export type Vector5 = FixedVector<5>
export type VectorN = DynamicVector

export function Vector(a: number): FixedVector<1>;
export function Vector(a: number, b: number): FixedVector<2>;
export function Vector(a: number, b: number, c: number): FixedVector<3>;
export function Vector(a: number, b: number, c: number, d: number): FixedVector<4>;
export function Vector(a: number, b: number, c: number, d: number, e: number): FixedVector<5>;
export function Vector(...values: number[]): FixedVector<1|2|3|4|5> {
    switch(values.length){
        case 1:
            return Vector1(...values as TupleN<1,number>)
        case 2:
            return Vector2(...values as TupleN<2,number>)
        case 3:
            return Vector3(...values as TupleN<3,number>)
        case 4:
            return Vector4(...values as TupleN<4,number>)
        case 5:
            return Vector5(...values as TupleN<5,number>)
    }
}