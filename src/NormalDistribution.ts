import { Distribution } from './Distribution';
import { pGammaNormalizable, qGammaNormalizable } from './IncompleteGammaFunction';
import { Random } from './Random'
import { UnitUniformRandom } from './UniformDistribution';
import { Validate } from './Validate';

/**
 * This class can instantiate by static 'create' method.
 * 
 * Ref: 『Javaによるアルゴリズム事典』正規分布 (normal distribution) NormalRandom.java
 */
export abstract class NormalDistribution extends Distribution {
    
    min(): number { return Number.NEGATIVE_INFINITY; }
    max(): number { return Number.POSITIVE_INFINITY; }

    /**
     * Create a NormalRandom instance of mean *mu* and variance *sigma2*.
     */
    static create(mu: number = 0, sigma2: number = 1,): NormalDistribution{
        if(mu === 0 && sigma2 === 1)
            return StandardNormalDistribution.INSTANCE;
        else
            return new GeneralNormalDistribution(mu, sigma2);
    }
}

/**  1/√(2π) (Normalization constant) */
const SQRT2PI_INV = 1/Math.sqrt(2*Math.PI);

function density(x: number): number { return Math.exp(-x*x/2) * SQRT2PI_INV; }

/** (log π)/2 */
const LOG_PI_BY2 = Math.log(Math.PI)/2;

/**
 * Return a value of the lower CDF (cumulative distribution function) of the standard normal distribution.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
function pNormal(x: number): number {
    return x >= 0 ?
        0.5*(1 + pGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2)) :
        0.5*qGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2);
}

/**
 * Return a value of the complementry CDF (upper CDF) of the standard normal distribution.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
function qNormal(x: number): number {
    return x >= 0 ?
        0.5*qGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2) :
        0.5*(1 + pGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2));
}

class StandardNormalDistribution extends NormalDistribution {

    static readonly INSTANCE = new StandardNormalDistribution();

    private constructor(){super();}

    mean(): number { return 0; }
    variance(): number { return 1; }

    median(): number { return 0; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }

    pdf(x: number): number { return density(x); }
    cdf(x: number): number { return pNormal(x); }
    ccdf(x: number): number { return qNormal(x); }

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

    private readonly sigma: number;

    constructor(private readonly mu: number,
                sigma2: number){
        super();
        Validate.positive('sigma2', sigma2);
        this.sigma = Math.sqrt(sigma2);
    }
    
    mean(): number { return this.mu; }
    variance(): number { return this.sigma * this.sigma; }

    median(): number { return this.mu; }
    protected modeMin(): number { return this.mu; }
    protected modeMax(): number { return this.mu; }

    pdf(x: number): number {
        const z = (x - this.mu)/this.sigma;
        return density(z)/this.sigma;
    }

    cdf(x: number): number {
        const z = (x - this.mu)/this.sigma;
        return pNormal(z)/this.sigma;
    }
    
    // ccdf(x: number): number {
    //     const z = (x - this.mu)/this.sigma;
    //     return qNormal(z)/this.sigma;
    // }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random {
        const mu = this.mu, sigma = this.sigma;
        return new class extends Random{
            private flag = true;
            private r = 0
            private theta = 0;
    
            next(): number {
                if(this.flag){
                    this.flag = false;
                    this.r = sigma * Math.sqrt(-2 * Math.log(1 - rand.next()));
                    this.theta = 2 * Math.PI * rand.next();
                    return mu + this.r * Math.cos(this.theta);
                }else{
                    this.flag = true;
                    return mu + this.r * Math.sin(this.theta);
                }
            }
        }();
    }
}