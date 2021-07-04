import { Random } from './Random'
import { UnitUniformRandom } from './UniformRandom';

/**
 * This class can instantiate by static 'create' method.
 * 
 * Ref: 『Javaによるアルゴリズム事典』指数分布 (exponentail distribution) ExpRandom.java
 */
export abstract class ExponentialRandom extends Random {

    protected constructor(){
        super();
    }

    static create(lambda: number = 1,
                  random: UnitUniformRandom = UnitUniformRandom.getDefault()): ExponentialRandom{
        if(lambda === 1)
            return new SimpleExponentialRandom(random);
        else
            return new GeneralExponentialRandom(lambda, random);
    }
}

class SimpleExponentialRandom extends ExponentialRandom {

    constructor(private readonly random: UnitUniformRandom){ 
        super();
    }
    
    next(): number { return -Math.log(1-this.random.next()); }
    
    min(): number { return 0; }
    max(): number { return Number.POSITIVE_INFINITY; }
    mean(): number { return 1; }
    median(): number { return 1/Math.LOG2E; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }
    variance(): number { return 1; }

    pdf(x: number): number { return x >= 0 ? Math.exp(-x) : 0; }
    cdf(x: number): number { return x >= 0 ? 1 - Math.exp(-x) : 0; }
}

/**
 * Triangular distribution with general min, mode, and max values.
 * 
 * Ref: <a href="https://en.m.wikipedia.org/wiki/Exponential_distribution">Wikipedia: Exponential distribution</a>
 */
class GeneralExponentialRandom extends ExponentialRandom {

    constructor(private readonly lambda: number,
                private readonly random: UnitUniformRandom){
        super();
    }
    
    next(): number { return -Math.log(1-this.random.next()) / this.lambda; }
    
    min(): number { return 0; }
    max(): number { return Number.POSITIVE_INFINITY; }
    mean(): number { return 1/this.lambda; }
    median(): number { return 1/(this.lambda*Math.LN2); }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }
    variance(): number { return 1/(this.lambda*this.lambda); }

    pdf(x: number): number { return x >= 0 ? this.lambda * Math.exp(-this.lambda * x) : 0; }
    cdf(x: number): number { return x >= 0 ? 1 - Math.exp(-this.lambda * x) : 0; }
}