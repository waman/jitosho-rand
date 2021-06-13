import { LinearCongruentialRandom } from "./LinearCongruentialRandom";
import { UniformRandom } from "./Random";

const N = 521;
const M = 32;
function b(value: number): bigint { return BigInt(value); }
const UINT32_MAX = Number((b(1) << b(32)) - b(1));

export class MSequenceRandom extends UniformRandom {

    private x = new Uint32Array(N);
    private p: number;

    constructor(seed?: number){
        super();
        this.p = 0;

        const initRng = new LinearCongruentialRandom(1566083941, 1, 32, seed);
        const b0 = b(0), b1 = b(1), topFilter = b1 << b(31);
        for(let i = 0; i <= 16; i++){
            let u = b0;
            for(let j = 0; j < 32; j++){
                const r = initRng.nextBigInt();
                u = (u >> b1) | (r & topFilter);
            }
            this.x[i] = Number(u);
        }
        this.x[16] = (this.x[16] << 23) ^ (this.x[0] >> 9) ^ this.x[15];
        for(let i = 17; i < N; i++){
            this.x[i] = (this.x[i-17] << 23) ^ (this.x[i-16] >> 9) ^ this.x[i-1];
        }

        // warm up
        this.shake(); this.shake(); this.shake(); this.shake();
    }

    private shake(){
        for(let i = 0; i < M; i++) this.x[i] ^= this.x[i-M+N];
        for(let i = M; i < N; i++) this.x[i] ^= this.x[i-M];
    }

    nextInteger(): number {
        if(this.p >= N){
            this.shake();
            this.p = 0;
        }
        return this.x[this.p++];
    }

    next(): number {
        return this.nextInteger() / UINT32_MAX;
    }
}