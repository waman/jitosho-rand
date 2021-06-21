export interface Random{
    /** Return a random number. */
    next(): number;
}

/**
 *  Create a new Random Number Generator (RNG).
 */
export function* newRNG(rand: Random = UniformRandom.getDefault()){
    while(true){
        yield rand.next();
    }
}

export abstract class UniformRandom implements Random{

    /** Return a random number in [0,1). */
    abstract next(): number;

    /** Return a random number in [0,max). */
    nextNumber(max: number): number {
        return this.next() * max;
    }

    /** Return a random number in [min, max). */
    nextNumberIn(min: number, max: number): number {
        return min + this.next() * (max - min);
    }

    /** Improve random number generator by pooling. */
    improve(poolSize: number = RandomImprove.DEFAULT_POOL_SIZE): UniformRandom{
        return new RandomImprove(this, poolSize);
    }

    /** UniformRandom implmentation with the Math.random(). */
    static getDefault(): UniformRandom{
        return new DefaultUniformRandom();
    }

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

class DefaultUniformRandom extends UniformRandom{
    next(): number {
        return Math.random();
    }
}

/**
 * Ref: 『Javaによるアルゴリズム事典』乱数の改良法 (improving random numbers) RandomImprove.java
 */
class RandomImprove extends UniformRandom{

    public static readonly DEFAULT_POOL_SIZE = 97;

    private readonly poolSize: number;
    private readonly pool: number[];
    private pos: number;

    constructor(private rand: Random, poolSize: number = RandomImprove.DEFAULT_POOL_SIZE){
        super();
        UniformRandom.validatePositive('poolSize', poolSize);
        this.poolSize = poolSize;
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

    improve(poolSize: number): UniformRandom{
        return this;
    }
}