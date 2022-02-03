export type { default as P5 } from 'p5';

export type Tuple1<A> = [A]
export type Tuple2<A> = [A,A]
export type Tuple3<A> = [A,A,A]
export type Tuple4<A> = [A,A,A,A]
export type Tuple5<A> = [A,A,A,A,A]

export type TupleN<N extends number, A> = 
    N extends 1 ? Tuple1<A>:
    N extends 2 ? Tuple2<A>:
    N extends 3 ? Tuple3<A>:
    N extends 4 ? Tuple4<A>:
    N extends 5 ? Tuple5<A>:
    never;