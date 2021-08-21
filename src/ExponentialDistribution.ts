import { Distribution } from './Distribution';
import { Random } from './Random'
import { UnitUniformRandom } from './UniformDistribution';
import { Validate } from './Validate';

/**
 * This class can instantiate by static 'create' method.
 * 
 * Ref: 『Javaによるアルゴリズム事典』指数分布 (exponentail distribution) ExpRandom.java
 */
export abstract class ExponentialDistribution extends Distribution {

    protected constructor(){
        super();
    }

    static create(lambda: number = 1): ExponentialDistribution{
        if(lambda === 1)
            return SimpleExponentialDistribution.INSTANCE;
        else
            return new GeneralExponentialDistribution(lambda);
    }
}

class SimpleExponentialDistribution extends ExponentialDistribution {

    static readonly INSTANCE = new SimpleExponentialDistribution();

    private constructor(){super();}
    
    min(): number { return 0; }
    max(): number { return Number.POSITIVE_INFINITY; }
    mean(): number { return 1; }
    variance(): number { return 1; }
    median(): number { return 1/Math.LOG2E; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }

    pdf(x: number): number { return x >= 0 ? Math.exp(-x) : 0; }
    cdf(x: number): number { return x >= 0 ? 1 - Math.exp(-x) : 0; }
    ccdf(x: number): number { return x >= 0 ? Math.exp(-x) : 1; }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random {
        return new class extends Random{
            next(): number {
                return -Math.log(1-rand.next());
            }
        }();
    }
}

/**
 * Triangular distribution with general min, mode, and max values.
 * 
 * Ref: <a href="https://en.m.wikipedia.org/wiki/Exponential_distribution">Wikipedia: Exponential distribution</a>
 */
class GeneralExponentialDistribution extends ExponentialDistribution {

    constructor(private readonly lambda: number){
        super();
        Validate.positive('lambda', this.lambda);
    }
    
    min(): number { return 0; }
    max(): number { return Number.POSITIVE_INFINITY; }
    mean(): number { return 1/this.lambda; }
    variance(): number { return 1/(this.lambda*this.lambda); }
    median(): number { return Math.LN2/this.lambda; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }

    pdf(x: number): number { return x >= 0 ? this.lambda * Math.exp(-this.lambda * x) : 0; }
    cdf(x: number): number { return x >= 0 ? 1 - Math.exp(-this.lambda * x) : 0; }
    ccdf(x: number): number { return x >= 0 ? Math.exp(-this.lambda * x) : 1; }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random {
        const lambda = this.lambda;
        return new class extends Random{
            next(): number {
                return -Math.log(1-rand.next()) / lambda;
            }
        }();
    }
    
}