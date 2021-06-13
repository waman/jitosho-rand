import { UniformRandom } from "./Random";

function b(value: number | bigint): bigint { return BigInt(value); }

/**
 * Generate Linear congruential random numbers x_i = a*x_{i-1} + c mod 2^p.
 */
export class LinearCongruentialRandom extends UniformRandom{

    protected readonly a: bigint;
    protected readonly c: bigint;
    protected readonly mask: bigint;
    protected seed: bigint;

    constructor(a: number | bigint, c: number | bigint, p: number | bigint, seed?: number | bigint){
        super();
        this.a = b(a);
        this.c = b(c);
        this.mask = (b(1) << (b(p))) - b(1);

        this.seed = seed ? BigInt(seed) : b(new Date().getTime());
    }

    protected setSeed(seed: bigint){ this.seed = seed; }

    /** Return a random bigint value in [0, 2^p). */
    nextBigInt(): bigint {
        this.seed = (this.seed * this.a + this.c) & this.mask;
        return this.seed;
    }

    /** Return a random integer in [0, 2^p). */
    nextInteger(): number {
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

    constructor(seed?: number | bigint){
        super(b(25214903917), b(11), b(48), seed);
        this.setSeed((this.seed ^ this.a) & this.mask);
    }

    private nextBigIntWithBits(bits: number): bigint {
        this.seed = this.nextBigInt();
        return this.seed >> (b(48 - bits));
    }
    
    next(): number {
        const nextBI = (this.nextBigIntWithBits(26) << b(27)) + this.nextBigIntWithBits(27);
        return Number(nextBI) / Number.MAX_SAFE_INTEGER; 
    }
}