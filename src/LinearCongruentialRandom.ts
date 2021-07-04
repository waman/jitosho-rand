import { Random } from "./Random";
import { UnitUniformRandom } from "./UniformDistribution";
import { Validate } from "./Validate";

export function newLinearCongruentialRandom(
        a: number|bigint,
        c: number|bigint,
        p: number|bigint,
        seed: number|bigint = new Date().getTime()): LinearCongruentialRandom{
    if(c === 0)
        return new SimpleLinearCongruentialRandom(a, p, seed);
    else
        return new LinearCongruentialRandomWithAddEnd(a, c, p, seed);
}

/**
 * Generate Linear congruential random numbers x_i = a*x_{i-1} + c mod 2^p.
 * This class can be instantiated by the 'newLinearCongruentialRandom()' function.
 *
 * Ref: 『Javaによるアルゴリズム事典』線形合同法 (linear congruential method) JavaRandom.java
 */
export abstract class LinearCongruentialRandom extends UnitUniformRandom {

    protected readonly a: bigint;
    protected readonly mask: bigint;
    protected seed: bigint;

    protected constructor(a: number|bigint, p: number|bigint, seed: number|bigint = new Date().getTime()){
        super();
        Validate.positive('a', a);
        Validate.positive('p', p);

        this.a = BigInt(a);
        this.mask = (1n << (BigInt(p))) - 1n;

        Validate.nonNegative('seed', seed);
        this.seed = BigInt(seed);
    }

    protected setSeed(seed: bigint){ 
        this.seed = seed;
    }

    /** Return a random bigint value in [0, 2^p). */
    abstract nextBigInt(): bigint

    /** Return a random integer in [0, 2^p). */
    nextInt(): number {
        return Number(this.nextBigInt());
    }
    
    next(): number {
        return Number(this.nextBigInt()) / Number(this.mask);
    }
}

class SimpleLinearCongruentialRandom extends LinearCongruentialRandom {

    constructor(a: number|bigint, p: number|bigint,
                seed: number|bigint = new Date().getTime()){
        super(a, p, seed);
    }

    /** Return a random bigint value in [0, 2^p). */
    nextBigInt(): bigint {
        this.seed = (this.seed * this.a) & this.mask;
        return this.seed;
    }
}

class LinearCongruentialRandomWithAddEnd extends LinearCongruentialRandom {

    protected readonly c: bigint;

    constructor(a: number|bigint, c: number|bigint, p: number|bigint,
                seed: number|bigint = new Date().getTime()){
        super(a, p, seed);
        Validate.nonNegative('c', c);
        this.c = BigInt(c);
    }

    /** Return a random bigint value in [0, 2^p). */
    nextBigInt(): bigint {
        this.seed = (this.seed * this.a + this.c) & this.mask;
        return this.seed;
    }
}

/**
 * Old Java random emulator.
 */
export class OldJavaRandom extends LinearCongruentialRandomWithAddEnd{

    constructor(seed: number|bigint = new Date().getTime()){
        super(25214903917n, 11n, 48n, seed);
        this.setSeed((this.seed ^ this.a) & this.mask);
    }

    private nextBits(bits: bigint): bigint {
        this.seed = this.nextBigInt();
        return this.seed >> (48n - bits);
    }
    
    next(): number {
        return Number((this.nextBits(26n) << 27n) + this.nextBits(27n)) / Number.MAX_SAFE_INTEGER; 
    }
}