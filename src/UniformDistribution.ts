import { Distribution } from "./Distribution";
import { Random } from "./Random";
import { Validate } from "./Validate";

/** 
 * This class can be instantiated by static 'create()' function.
 */
export abstract class UniformDistribution extends Distribution{
    
    median(): number { return this.mean(); }
    protected modeMin(): number { return this.min(); }
    protected modeMax(): number { return this.max(); }
    
    static create(a?: number, b?: number): UniformDistribution{
        if(a !== undefined && a != null){  // avoid to check like 'if(!a)' for a === 0 
            if(b !== undefined && b != null){
                // a: min, b: max
                return new GeneralUniformDistribution(a, b);
            }else{
                // a: max (min: 0)
                return new MagnifiedUniformDistribution(a);
            }
        }else{
            if(b !== undefined && b != null){
                // b: max (min: 0)
                return new MagnifiedUniformDistribution(b);
            }else{
                // UnitUniformDistribution (min: 0, max: 1)
                return new UnitUniformDistribution();
            }
        }
    }
}

export class UnitUniformDistribution extends UniformDistribution{

    min(): number { return 0; }
    max(): number { return 1; }
    mean(): number { return 0.5; }
    variance(): number { return 1/12; }

    pdf(x: number): number { 
        return 0 <= x && x <= 1 ? 1 : 0;
    }

    cdf(x: number): number {
        if(x < 0) return 0;
        else if(x <= 1) return x;
        else return 1;
    }

    random(rand?: UnitUniformRandom): UnitUniformRandom {
        return rand ? rand : UnitUniformRandom.getDefault();
    }
}

class MagnifiedUniformDistribution extends UniformDistribution{

    constructor(private readonly _max: number){
        super();
    }

    min(): number { return 0; }
    max(): number { return this._max; }
    mean(): number { return this._max/2; }
    variance(): number { return this._max * this._max / 12; }

    pdf(x: number): number { 
        return 0 <= x && x <= this._max ? 1/this._max : 0;
    }

    cdf(x: number): number {
        if(x < 0) return 0;
        else if(x <= this._max) return x/this._max;
        else return 1;
    }

    random(rand?: UnitUniformRandom): Random {
        const random = rand ? rand : UnitUniformRandom.getDefault();
        const max = this._max;
        return new class extends Random{
            next(): number { return random.next() * max; }
        }();
    }
}

class GeneralUniformDistribution extends UniformDistribution{

    private readonly interval: number;

    constructor(private readonly _min: number, 
                private readonly _max: number){
        super();
        this.interval = this._max - this._min;
    }

    min(): number { return this._min; }
    max(): number { return this._max; }
    mean(): number { return (this._min + this._max)/2; }
    variance(): number { return this.interval * this.interval / 12; }

    pdf(x: number): number { 
        return this._min <= x && x <= this._max ? 1/this.interval : 0;
    }

    cdf(x: number): number {
        if(x < this._min) return 0;
        else if(x <= this._max) return (x - this._min)/this.interval;
        else return 1
    }

    random(rand?: UnitUniformRandom): Random {
        const random = rand ? rand : UnitUniformRandom.getDefault();
        const min = this._min, interval = this.interval;
        return new class extends Random{
            next(): number { return random.next() * interval + min; }
        }();
    }
}

export abstract class UnitUniformRandom extends Random{

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
        return new class extends UnitUniformRandom{
            next(): number { return Math.random(); }
        }();
    }
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
        Validate.positive('poolSize', poolSize);
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