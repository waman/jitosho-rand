export class Validate{
    /**
     * This method may be used for argument validation.
     * @param name the argument name
     * @param x the argument value
     */
     static positive(name: string, x: number|bigint){
        if(Number(x) <= 0) 
            throw new Error(`${name} must be positive: ${x}`);
    }

    /**
     * This method may be used for argument validation.
     * @param name the argument name
     * @param x the argument value
     */
    static nonNegative(name: string, x: number|bigint){
        if(Number(x) < 0) 
            throw new Error(`${name} must be non negative: ${x}`);
    }
}