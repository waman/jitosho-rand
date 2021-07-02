import { Random } from "./Random";

/** 
 * This class can be instantiated by static 'create()' function.
 */
export abstract class UniformRandom extends Random{
    
    mean(): number { return (this.min() + this.max())/2; }
    median(): number { return this.mean(); }
    protected modeMin(): number { return this.min(); }
    protected modeMax(): number { return this.max(); }

    /** UniformRandom implmentation with the Math.random(). */
    static getDefault(): UniformRandom{
        return UnitUniformRandom.getDefault();
    }
    
    static create(a?: number, b?: number,
                  random: UnitUniformRandom = UnitUniformRandom.getDefault()): UniformRandom{
        if(a !== undefined && a != null){  // avoid to check like 'if(!a)' for a === 0 
            if(b !== undefined && b != null){
                // a: min, b: max
                return new GeneralUniformRandom(a, b, random);
            }else{
                // a: max (min: 0)
                return new MagnifiedUniformRandom(a, random);
            }
        }else{
            if(b !== undefined && b != null){
                // b: max (min: 0)
                return new MagnifiedUniformRandom(b, random);
            }else{
                // UnitUniformRandom (min: 0, max: 1)
                return random;
            }
        }
    }
}

class MagnifiedUniformRandom extends UniformRandom{

    constructor(private readonly _max: number, 
                private readonly random: UnitUniformRandom){
        super();
    }

    next(): number { return this.random.next() * this._max; }

    min(): number { return 0; }
    max(): number { return this._max; }
    variance(): number { return this._max * this._max / 12; }

    pdf(x: number): number { 
        return 0 <= x && x <= this._max ? 1/this._max : 0;
    }

    cdf(x: number): number {
        if(x < 0) return 0;
        else if(x <= this._max) return x/this._max;
        else return 1;
    }
}

class GeneralUniformRandom extends UniformRandom{

    private readonly interval: number;

    constructor(private readonly _min: number, 
                private readonly _max: number, 
                private readonly random: UnitUniformRandom){
        super();
        this.interval = this._max - this._min;
    }

    next(): number { return this.random.next() * this.interval + this._min; }

    min(): number { return this._min; }
    max(): number { return this._max; }
    variance(): number { return this.interval * this.interval / 12; }

    pdf(x: number): number { 
        return this._min <= x && x <= this._max ? 1/this.interval : 0;
    }

    cdf(x: number): number {
        if(x < this._min) return 0;
        else if(x <= this._max) return (x - this._min)/this.interval;
        else return 1
    }
}

export abstract class UnitUniformRandom extends UniformRandom{

    /** Return a random number in [0, 1). */
    abstract next(): number;

    min(): number { return 0; }
    max(): number { return 1; }
    median(): number { return 0.5; }
    mean(): number { return 0.5; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 1; }
    variance(): number { return 1/12; }

    pdf(x: number): number { 
        return 0 <= x && x <= 1 ? 1 : 0;
    }

    cdf(x: number): number {
        if(x < 0) return 0;
        else if(x <= 1) return x;
        else return 1;
    }

    /** Return a random number in [0, max). */
    nextNumber(max: number): number {
        return this.next() * max;
    }

    /** Return a random number in [min, max). */
    nextNumberIn(min: number, max: number): number {
        return min + this.next() * (max - min);
    }

    /** Improve random number generator by pooling. */
    improve(poolSize: number = RandomImprove.DEFAULT_POOL_SIZE): UnitUniformRandom{
        return new RandomImprove(this, poolSize);
    }

    /** Return UnitUniformRandom implmentation with the Math.random(). */
    static getDefault(): UnitUniformRandom{
        return new DefaultUniformRandom();
    }
}

class DefaultUniformRandom extends UnitUniformRandom{
    next(): number { return Math.random(); }
}

/**
 * Ref: 『Javaによるアルゴリズム事典』乱数の改良法 (improving random numbers) RandomImprove.java
 */
class RandomImprove extends UnitUniformRandom{

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

    improve(poolSize: number): UnitUniformRandom{ return this; }
}