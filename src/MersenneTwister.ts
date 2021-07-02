import { Random } from './Random';
import { UnitUniformRandom } from './UniformRandom'

/**
 * Ref: 『Javaによるアルゴリズム事典』メルセンヌ・ツイスター (Mersenne Twister) MersenneTwister.java
 */
export class MersenneTwister extends UnitUniformRandom {

    private static readonly N = 624;
    private static readonly M = 397;
    private static readonly UPPER_MASK = 1 << 31;
    private static readonly LOWER_MASK = (1 << 31) - 1;
    private static readonly MATRIX_A = 0x9908B0DF;

    private x = new Uint32Array(MersenneTwister.N);
    private p: number;
    private q: number;
    private r: number;

    constructor(seed: number|number[] = new Date().getTime()){
        super();
        let sd: number;
        if(typeof seed === 'number'){
            Random.validateNonNegative('seed', seed);
            sd = seed;
        }else{
            seed.forEach(s => Random.validateNonNegative('seed', s));
            sd = 19650218;
        }

        this.x[0] = sd;
        for(let i = 1; i < MersenneTwister.N; i++){
            this.x[i] = 1812433253 * (this.x[i-1] ^ (this.x[i-1] >>> 30)) + i;
        }
        this.p = 0; this.q = 1; this.r = MersenneTwister.M;

        // initialization for seed of number[]
        if(typeof seed === 'object')
            this.initForNumberArraySeed(seed);
    }

    private initForNumberArraySeed(seeds: number[]){
        const N = MersenneTwister.N;
        let i = 1, j = 0;
        const max = Math.max(N, seeds.length);
        for(let k = 0; k < max; k++){
            this.x[i] ^= (this.x[i-1] ^ (this.x[i-1] >>> 30)) * 1664525;
            this.x[i] += seeds[j] + j;
            if(++i >= N){ this.x[0] = this.x[N-1]; i = 1;}
            if(++j >= seeds.length) j = 0;
        }
        for(let k = 0; k < N-1; k++){
            this.x[i] ^= (this.x[i-1] ^ (this.x[i-1] >>> 30)) * 1566083941;
            this.x[i] -= i;
            if(++i >= N){ this.x[0] = this.x[N-1]; i = 1; }
        }
        this.x[0] = MersenneTwister.UPPER_MASK;
    }

    private nextBits(bits: number): number {
        let y = upper(this.x[this.p]) | lower(this.x[this.q]);
        y = this.x[this.r] ^ (y >>> 1) ^ ((y & 1) * MersenneTwister.MATRIX_A);
        this.x[this.p] = y;

        if(overMax(++this.p)) this.p = 0;
        if(overMax(++this.q)) this.q = 0;
        if(overMax(++this.r)) this.r = 0;

        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9D2C5680;
        y ^= (y << 15) & 0xEFC60000;
        y ^= (y >>> 18);
        return y >>> (32 - bits);

        function upper(x: number): number{ return x & MersenneTwister.UPPER_MASK; }
        function lower(x: number): number{ return x & MersenneTwister.LOWER_MASK; }
        function overMax(n: number): boolean { return n === MersenneTwister.N; }
    }

    private static readonly TO_UPPER = Number(1n << 27n);
    
    next(): number {
        return (this.nextBits(26) * MersenneTwister.TO_UPPER + this.nextBits(27)) / Number.MAX_SAFE_INTEGER; 
    }
}