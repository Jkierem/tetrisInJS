import { Lazy } from "./core/functions";

export const lessThan = (max: number) => (x: number) => x < max;
export const moreOrEqualTo = (min: number) => (x: number) => x >= min
export const between = (min: number, max: number) => (x: number) => x >= min && x < max

export type Predicate<A> = (x: A) => boolean
export type NumPredicate = Predicate<number>
export type ThresholdEntry<A> = [ NumPredicate, Lazy<A> ]

export const threshold = <A>(params: ThresholdEntry<A>[]) => (x: number) => {
    const cleanParams = [...params, [
        () => true, () => undefined
    ] as ThresholdEntry<undefined>]
    return cleanParams.find( ([ condition ]) => condition(x) )[1]()
}