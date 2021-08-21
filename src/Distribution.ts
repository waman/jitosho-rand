import { Random, newRNG } from "./Random";
import { UnitUniformRandom } from "./UniformDistribution";

export abstract class Distribution{

    /** Return the min value of *next()*. */
    abstract min(): number;

    /** Return the max value of next(). */
    abstract max(): number

    /** Return the range of next(). */
    range(): [number, number] { return [this.min(), this.max()]; }


    /** Return the mean of next(). */
    abstract mean(): number;

    /** Return the variance value of next(). */
    abstract variance(): number


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

    /** Upper CDF, complementary cumulative density fucntion (= 1 - cdf(x)). */
    ccdf(x: number): number { return 1 - this.cdf(x); }


    /** Return a Random object according to this distribution. */
    abstract random(rand?: UnitUniformRandom): Random

    newRNG(rand?: UnitUniformRandom){
        return newRNG(this.random(rand));
    }
}