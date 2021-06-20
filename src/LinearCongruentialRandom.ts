import { UniformRandom } from "./Random";

/**
 * Generate Linear congruential random numbers x_i = a*x_{i-1} + c mod 2^p.
 *
 * Ref: 『Javaによるアルゴリズム事典』線形合同法 (linear congruential method) JavaRandom.java
 */
export class LinearCongruentialRandom extends UniformRandom {

    protected readonly a: bigint;
    protected readonly c: bigint;
    protected readonly mask: bigint;
    protected seed: bigint;

    constructor(a: number|bigint, c: number|bigint, p: number|bigint,
         seed: number|bigint = new Date().getTime()){
        super();
        this.a = BigInt(a);
        this.c = BigInt(c);
        this.mask = (1n << (BigInt(p))) - 1n;

        this.seed = BigInt(seed);
    }

    protected setSeed(seed: bigint){ this.seed = seed; }

    /** Return a random bigint value in [0, 2^p). */
    nextBigInt(): bigint {
        this.seed = (this.seed * this.a + this.c) & this.mask;
        return this.seed;
    }

    /** Return a random integer in [0, 2^p). */
    nextInt(): number {
        return Number(this.nextBigInt());
    }
    
    next(): number {
        return Number(this.nextBigInt()) / Number(this.mask);
    }
}

/**
 * Java random emulator.
 */
export class JavaRandom extends LinearCongruentialRandom{

    constructor(seed: number | bigint = new Date().getTime()){
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