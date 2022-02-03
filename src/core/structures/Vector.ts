import { TupleN } from "../types"

export interface Vector {
    toArray: () => number[]
    toTuple: <N extends number>() => TupleN<N,number>
    map: (fn: (x: number, idx?: number) => number) => Vector
    add: (other: Vector) => Vector
    sub: (other: Vector) => Vector
    get: (idx: number) => number
    readonly x: number
    readonly y: number
    readonly z: number
}

export interface ImmutableVector<N extends number> {
    toArray: () => number[]
    toTuple: () => TupleN<N,number>
    map: (fn: (x: number, idx?: number) => number) => ImmutableVector<N>
    add: (other: ImmutableVector<N>) => ImmutableVector<N>
    sub: (other: ImmutableVector<N>) => ImmutableVector<N>
    scale: (scalar: number) => ImmutableVector<N>,
    get: (idx: number) => number
    readonly x: number
    readonly y: number
    readonly z: number
}

export const VectorN = (...a: number[]): Vector => ({
    toArray: () => a,
    toTuple: <A extends number>() => a as TupleN<A, number>,
    map: (fn: (x: number, idx?: number) => number) => VectorN(...a.map(fn)),
    add: (other: Vector) => VectorN(...other.map((b, idx) => (a[idx] ?? 0) + b).toArray()),
    sub: (other: Vector) => VectorN(...other.map((b, idx) => (a[idx] ?? 0) - b).toArray()),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return this.get(0) },
    get y(){ return this.get(1) },
    get z(){ return this.get(2) },
})

export const Vector2 = (a: number, b: number): ImmutableVector<2> => ({
    toArray: () => [a,b],
    toTuple: () => [a,b] as TupleN<2,number>,
    map: (fn) => Vector2(fn(a,2), fn(b,1)),
    add: (o: ImmutableVector<2>) => Vector2(a + o.x, b + o.y),
    sub: (o: ImmutableVector<2>) => Vector2(a - o.x, b - o.y),
    scale: (s: number) => Vector2(a*s, b*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return b },
    get z(){ return 0 },
})

export const Vector3 = (a: number, b: number, c: number): ImmutableVector<3> => ({
    toArray: () => [a,b,c],
    toTuple: () => [a,b,c] as TupleN<3,number>,
    map: (fn) => Vector3(fn(a,0), fn(b,1), fn(c,2)),
    add: (o: ImmutableVector<3>) => Vector3(a + o.x, b + o.y, c + o.z),
    sub: (o: ImmutableVector<3>) => Vector3(a - o.x, b - o.y, c - o.z),
    scale: (s: number) => Vector3(a*s, b*s, c*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return b },
    get z(){ return c },
})

export const Vector4 = (a: number, b: number, c: number, d: number): ImmutableVector<4> => ({
    toArray: () => [a,b,c,d],
    toTuple: () => [a,b,c,d] as TupleN<4,number>,
    map: (fn) => Vector4(fn(a,0), fn(b,1), fn(c,2), fn(d,3)),
    add: (o: ImmutableVector<4>) => Vector4(a + o.x, b + o.y, c + o.z, d + o.get(3)),
    sub: (o: ImmutableVector<4>) => Vector4(a - o.x, b - o.y, c - o.z, d - o.get(3)),
    scale: (s: number) => Vector4(a*s, b*s, c*s, d*s),
    get(idx: number){ return this.toArray()[idx] ?? 0 },
    get x(){ return a },
    get y(){ return b },
    get z(){ return c },
})