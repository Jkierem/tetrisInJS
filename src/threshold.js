export const lessThan = (max) => x => x < max;
export const moreOrEqualTo = (min) => x => x >= min
export const between = (min,max) => x => x >= min && x < max

export const threshold = (params) => (x) => {
    const cleanParams = [...params, [
        () => true, () => x
    ]]
    return cleanParams.find( ([ condition ]) => condition(x) )[1](x)
}