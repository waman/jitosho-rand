interface Random{
    next(): number;
}

/** Create a new Random Number Generator (RNG) */
export function* newRNG(rand?: Random){
    const rng = rand ? rand : UniformRandom.getDefault();
    while(true){
        yield rng.next();
    }
}

export abstract class UniformRandom implements Random{
    abstract next(): number;

    nextNumber(max: number): number {
        return this.next() * max;
    }

    nextNumberIn(min: number, max: number): number {
        return min + this.next() * (max - min);
    }

    improve(poolSize?: number): Random{
        return new RandomImprove(this, poolSize);
    }

    /** 
     * UniformRandom implmentation with the Math.random().
     */
    static getDefault(): UniformRandom{
        return new DefaultUniformRandom();
    }
}

class DefaultUniformRandom extends UniformRandom{
    next(): number {
        return Math.random();
    }
}

class RandomImprove extends UniformRandom{

    private static DEFAULT_POOL_SIZE = 97;

    private poolSize: number;
    private pool: Array<number>;
    private pos: number;

    constructor(private rand: Random, poolSize?: number){
        super();
        this.poolSize = poolSize ? poolSize : RandomImprove.DEFAULT_POOL_SIZE;
        this.pos = this.poolSize-1;
        this.pool = new Array(this.poolSize)
        for(let i = 0; i < this.poolSize; i++){
            this.pool[i] = this.rand.next();
        }
    }

    next(): number {
        this.pos = Math.floor(this.poolSize * this.pool[this.pos]);
        const result = this.pool[this.pos];
        this.pool[this.pos] = this.rand.next();
        return result;
    }

    improve(poolSize?: number): Random{
        return this;
    }
}