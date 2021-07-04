import { Distribution } from './Distribution';
import { Random } from './Random'
import { UnitUniformRandom } from './UniformDistribution';
import { Validate } from './Validate';

/**
 * This class can instantiate by static 'create' method.
 * 
 * Ref: 『Javaによるアルゴリズム事典』正規分布 (normal distribution) NormalRandom.java
 */
export abstract class NormalDistribution extends Distribution {

    /** Normalization constant 1/√(2π) */
    protected static readonly NC = 1/Math.sqrt(2*Math.PI);

    protected constructor(){
        super();
    }
    
    min(): number { return Number.NEGATIVE_INFINITY; }
    max(): number { return Number.POSITIVE_INFINITY; }

    median(): number { return 0; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }

    /**
     * Create a NormalRandom instance of mean *mu* and variance *sigma2*.
     */
    static create(mu: number = 0,
                  sigma2: number = 1,
                  random: UnitUniformRandom = UnitUniformRandom.getDefault()): NormalDistribution{
        if(mu === 0 && sigma2 === 1)
            return new SimpleNormalDistribution();
        else
            return new GeneralNormalDistribution(mu, sigma2);
    }
}

class SimpleNormalDistribution extends NormalDistribution {
    mean(): number { return 0; }
    variance(): number { return 1; }

    pdf(x: number): number { return Math.exp(-x*x)*NormalDistribution.NC; }
    cdf(x: number): number { throw new Error(); }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random {

        return new class extends Random{
            private flag = true;
            private r = 0
            private theta = 0;
    
            next(): number {
                if(this.flag){
                    this.flag = false;
                    this.r = Math.sqrt(-2 * Math.log(1 - rand.next()));
                    this.theta = 2 * Math.PI * rand.next();
                    return this.r * Math.cos(this.theta);
                }else{
                    this.flag = true;
                    return this.r * Math.sin(this.theta);
                }
            }
        }();
    }
}

/**
 * Triangular distribution with general min, mode, and max values.
 * 
 * Ref: <a href="https://en.m.wikipedia.org/wiki/Normal_distribution">Wikipedia: Normal distribution</a>
 */
class GeneralNormalDistribution extends NormalDistribution {

    constructor(private readonly mu: number,
                private readonly sigma2: number){
        super();
        Validate.nonNegative('sigma2', this.sigma2);
    }
    
    mean(): number { return this.mu; }
    variance(): number { return Math.sqrt(this.sigma2); }

    pdf(x: number): number {
        const y = x-this.mu;
        return Math.exp(-y*y/(2*this.sigma2))*NormalDistribution.NC/Math.sqrt(this.sigma2);
    }
    cdf(x: number): number { throw new Error(); }
    next(): number {
        throw new Error('Method not implemented.');
    }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random {
        return new class extends Random{
            next(): number {
                throw new Error('Method not implemented.');
            }
        }
    }
}