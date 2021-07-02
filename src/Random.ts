export abstract class Random{

    /** Return a random number. */
    abstract next(): number;

    /** Return the min value of next(). */
    abstract min(): number;
    /** Return the max value of next(). */
    abstract max(): number
    /** Return the range of next(). */
    range(): [number, number] { return [this.min(), this.max()]; }

    /** Return the mean of next(). */
    abstract mean(): number;
    /** Return the median of next(). */
    abstract median(): number;
    /** Return the mode of next(). */
    mode(m: 'min'|'max' = 'min'): number {
        if(!m || m === 'min')
            return this.modeMin();
        else
            return this.modeMax();
    }
    protected abstract modeMin(): number;
    protected abstract modeMax(): number;

    /** PDF (probability density function). */
    abstract pdf(x: number): number;

    /** CDF (cumulative density function). */
    abstract cdf(x: number): number;

    /** Return the variance value of next(). */
    abstract variance(): number

    /**
     * This method may be used for argument validation.
     * @param name the argument name
     * @param x the argument value
     */
    protected static validatePositive(name: string, x: number|bigint){
        if(Number(x) <= 0) 
            throw new Error(`${name} must be positive: ${x}`);
    }

    /**
     * This method may be used for argument validation.
     * @param name the argument name
     * @param x the argument value
     */
    protected static validateNonNegative(name: string, x: number|bigint){
        if(Number(x) < 0) 
            throw new Error(`${name} must be non negative: ${x}`);
    }
}

/**
 *  Create a new Random Number Generator (RNG).
 */
export function* newRNG(rand: Random){
    while(true) yield rand.next();
}