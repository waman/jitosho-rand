import { LinearCongruentialRandom } from "./LinearCongruentialRandom";
import { UniformRandom } from "./Random";

/**
 * Ref: 『Javaによるアルゴリズム事典』M系列乱数 (M-sequence random numbers) MSequenceRandom.java
 */
export class MSequenceRandom extends UniformRandom {

    private static readonly N = 521;
    private static readonly M = 32;
    private static readonly UINT32_MAX = Number((1n << 32n) - 1n);

    private x = new Uint32Array(MSequenceRandom.N);
    private p: number;

    constructor(seed: number = new Date().getTime()){
        super();
        this.p = 0;

        const initRng = new LinearCongruentialRandom(1566083941, 1, 32, seed);
        const b0 = 0n, b1 = 1n, upperMask = b1 << 31n;
        for(let i = 0; i <= 16; i++){
            let u = b0;
            for(let j = 0; j < 32; j++){
                const r = initRng.nextBigInt();
                u = (u >> b1) | (r & upperMask);
            }
            this.x[i] = Number(u);
        }
        this.x[16] = (this.x[16] << 23) ^ (this.x[0] >> 9) ^ this.x[15];
        for(let i = 17; i < MSequenceRandom.N; i++){
            this.x[i] = (this.x[i-17] << 23) ^ (this.x[i-16] >> 9) ^ this.x[i-1];
        }

        // warm up
        this.shake(); this.shake(); this.shake(); this.shake();
    }

    private shake(){
        const m = MSequenceRandom.M, n = MSequenceRandom.N;
        for(let i = 0; i < m; i++) this.x[i] ^= this.x[i-m+n];
        for(let i = m; i < n; i++) this.x[i] ^= this.x[i-m];
    }

    nextInteger(): number {
        if(this.p >= MSequenceRandom.N){
            this.shake();
            this.p = 0;
        }
        return this.x[this.p++];
    }

    next(): number {
        return this.nextInteger() / MSequenceRandom.UINT32_MAX;
    }
}