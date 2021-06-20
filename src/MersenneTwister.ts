import { UniformRandom } from './Random'

/**
 * Ref: 『Javaによるアルゴリズム事典』メルセンヌ・ツイスター (Mersenne Twister) MersenneTwister.java
 */
export class MersenneTwister extends UniformRandom {

    private static readonly N = 624;
    private static readonly M = 397;
    private static readonly UPPER_MASK = 1 << 31;
    private static readonly LOWER_MASK = (1 << 31) - 1;
    private static readonly MATRIX_A = 0x9908B0DF;

    private x = new Uint32Array(MersenneTwister.N);
    private p: number;
    private q: number;
    private r: number;

    constructor(seed?: number|number[]){
        super();
        let sd: number;
        if(!seed) sd = new Date().getTime();
        else if(typeof seed === 'number') sd = seed;
        else sd = 19650218;

        this.x[0] = sd;
        for(let i = 1; i < MersenneTwister.N; i++){
            this.x[i] = 1812433253 * (this.x[i-1] ^ (this.x[i-1] >>> 30)) + i;
        }
        this.p = 0; this.q = 1; this.r = MersenneTwister.M;

        // initialization for seed of number[]
        if(typeof seed === 'object'){
            const N = MersenneTwister.N;
            let i = 1, j = 0;
            const max = Math.max(N, seed.length);
            for(let k = 0; k < max; k++){
                this.x[i] ^= (this.x[i-1] ^ (this.x[i-1] >>> 30)) * 1664525;
                this.x[i] += seed[j] + j;
                if(++i >= N){ this.x[0] = this.x[N-1]; i = 1;}
                if(++j >= seed.length) j = 0;
            }
            for(let k = 0; k < N-1; k++){
                this.x[i] ^= (this.x[i-1] ^ (this.x[i-1] >>> 30)) * 1566083941;
                this.x[i] -= i;
                if(++i >= N){ this.x[0] = this.x[N-1]; i = 1; }
            }
            this.x[0] = MersenneTwister.UPPER_MASK;
        }
    }

    private nextBits(bits: number): number {
        // for code brevity
        const N = MersenneTwister.N;
        const UPPER_MASK = MersenneTwister.UPPER_MASK;
        const LOWER_MASK = MersenneTwister.LOWER_MASK;
        const MATRIX_A = MersenneTwister.MATRIX_A;

        let y = (this.x[this.p] & UPPER_MASK) | (this.x[this.q] & LOWER_MASK);
        y = this.x[this.r] ^ (y >>> 1) ^ ((y & 1) * MATRIX_A);
        this.x[this.p] = y;

        if(++this.p === N) this.p = 0;
        if(++this.q === N) this.q = 0;
        if(++this.r === N) this.r = 0;

        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9D2C5680;
        y ^= (y << 15) & 0xEFC60000;
        y ^= (y >>> 18);
        return y >>> (32 - bits);
    }

    private static readonly TO_UPPER = Number(1n << 27n);
    
    next(): number {
        return (this.nextBits(26) * MersenneTwister.TO_UPPER + this.nextBits(27)) / Number.MAX_SAFE_INTEGER; 
    }
}