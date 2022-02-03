export type Lazy<A> = () => A
export const justOf = <A>(a: A) => (): A => a
export const repeat = <A>(n: number, value: Lazy<A>): A[] => {
    const data: A[] = []
    for(let i = 0 ; i < n ; i++){
        data.push(value())
    }
    return data
}
export const identity = <A>(a: A) => a
export const identity2 = <A,B>(a: A, b: B) => a

export const prop =
  <T, Key extends keyof T>(name: Key) =>
  (data: T): T[Key] => data?.[name]

type Nil = null | undefined
export const isNil = <A>(x: A): x is Nil => x === null || x === undefined

type Fn<A,B> = (a: A) => B
export function pipe<A,B>(a: Fn<A,B>): (a: A) => B
export function pipe<A,B,C>(a: Fn<A,B>, b: Fn<B,C>): (a: A) => C
export function pipe<A,B,C,D>(a: Fn<A,B>, b: Fn<B,C>, c: Fn<C,D>): (a: A) => D
export function pipe<A,B,C,D,E>(a: Fn<A,B>, b: Fn<B,C>, c: Fn<C,D>, d: Fn<D,E>): (a: A) => E
export function pipe<A,B,C,D,E,F>(a: Fn<A,B>, b: Fn<B,C>, c: Fn<C,D>, d: Fn<D,E>, e: Fn<E,F>): (a: A) => F
export function pipe<A>(f0: Fn<A,any>,...fns: A[]): (a: A) => any {
    return (a: A) => fns.reduce((arg: any, fn: any) => fn(arg), f0(a))
}