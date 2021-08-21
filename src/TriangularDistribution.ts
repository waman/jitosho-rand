import { Distribution } from './Distribution';
import { Random } from './Random'
import { UnitUniformRandom } from './UniformDistribution';

/**
 * This class can instantiate by static 'create' method.
 * 
 * Ref: 『Javaによるアルゴリズム事典』三角分布 (triangular distribution) TriangularRandom.java
 */
export abstract class TriangularDistribution extends Distribution {

    protected constructor(){
        super();
    }

    static create(min: number = -1, max: number = 1,mode?: number): TriangularDistribution{
        if(min === -1 && max === 1 && mode === undefined) 
            return SimpleTriangularDistribution.INSTANCE;
        else if(mode === undefined || min + max === 2*mode)
            return new SymmetricTriangularDistribution(min, max);
        else 
            return new GeneralTriangularDistribution(min, max, mode);
    }
}

class SimpleTriangularDistribution extends TriangularDistribution {

    static readonly INSTANCE = new SimpleTriangularDistribution();

    private constructor(){super();}
    
    min(): number { return -1; }
    max(): number { return 1; }
    mean(): number { return 0; }
    variance(): number { return 1/6; }
    median(): number { return 0; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }

    pdf(x: number): number {
        if(x < -1) return 0;
        else if(x < 0) return x + 1;
        else if(x < 1) return 1 - x;
        else return 0;
    }

    cdf(x: number): number {
        if(x < -1){
             return 0;
        }else if(x < 0){
            const y = x+1
            return y*y/2;
        }else if(x < 1){
            const y = 1-x;
            return 1 - y*y/2;
        }else{
            return 1;
        }
    }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random {
        return new class extends Random{
            next(): number { return rand.next() - rand.next(); }
        }();
    }
}

class SymmetricTriangularDistribution extends TriangularDistribution {

    private readonly interval: number;

    constructor(private readonly _min: number,
                private readonly _max: number){
        super();
        if(this._min >= this._max)
            throw new Error(`min must be greater than max; min: ${this._min}, max: ${this._max}.`)

        this.interval = _max - _min;
    }
    
    min(): number { return this._min; }
    max(): number { return this._max; }
    mean(): number { return (this._min + this._max)/2; }
    variance(): number { return this.interval*this.interval/24; }
    median(): number { return this.mean(); }
    protected modeMin(): number { return this.mean(); }
    protected modeMax(): number { return this.mean(); }

    pdf(x: number): number {
        if(x < this._min) 
            return 0;
        else if(x < this.interval/2)
            return 4*(x - this._min)/(this.interval*this.interval);
        else if(x < this._max)
            return 4*(this._max - x)/(this.interval*this.interval);
        else 
            return 0;
    }

    cdf(x: number): number {
        if(x < this._min){ 
            return 0;
        }else if(x < this.interval/2){
            const y = x - this._min;
            return 2*y*y/(this.interval*this.interval);
        }else if(x < this._max){
            const y = this._max - x;
            return 1 - 2*y*y/(this.interval*this.interval);
        }else{
            return 1;
        }
    }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random {
        const interval = this.interval, min = this._min;
        return new class extends Random{
            next(): number {
                return (rand.next() - rand.next() + 1) * interval / 2 + min; 
            }
        }();
    }
}

/**
 * Triangular distribution with general min, mode, and max values.
 * 
 * Ref: <a href="https://en.m.wikipedia.org/wiki/Triangular_distribution">Wikipedia: Triangular distribution</a>
 */
class GeneralTriangularDistribution extends TriangularDistribution {

    constructor(private readonly a: number,
                private readonly b: number,
                private readonly c: number){
        super();
        if(!(this.a < this.c && this.c < this.b))
            throw new Error('a, b, and c don\'t have the correct order relation (a < c < b); ' +
                ` a: ${this.a}, b: ${this.b}, c: ${this.c}.`)
    }
    
    min(): number { return this.a; }
    max(): number { return this.b; }
    mean(): number { return (this.a + this.b + this.c)/3; }
    variance(): number {
        return (this.a*this.a + this.b*this.b + this.c*this.c 
                - this.a*this.b - this.b*this.c - this.c*this.a)/18;
    }
    
    median(): number { 
        if(this.c >= (this.a + this.b)/2){
            return this.a + Math.sqrt((this.b - this.a)*(this.c - this.a)/2);
        }else{
            return this.b - Math.sqrt((this.b - this.a)*(this.b - this.c)/2);
        }
    }
    protected modeMin(): number { return this.c; }
    protected modeMax(): number { return this.c; }

    pdf(x: number): number {
        if(x < this.a) 
            return 0;
        else if(x < this.c)
            return 2*(x - this.a)/((this.b - this.a)*(this.c - this.a));
        else if(x < this.b)
            return 2*(this.b - x)/((this.b - this.a)*(this.b - this.c));
        else 
            return 0;
    }

    cdf(x: number): number {
        if(x < this.a){ 
            return 0;
        }else if(x < this.c){
            const y = x - this.a;
            return y*y/((this.b - this.a)*(this.c - this.a));
        }else if(x < this.b){
            const y = this.b - x;
            return 1 - y*y/((this.b - this.a)*(this.b - this.c));
        }else{
            return 1;
        }
    }

    random(rand: UnitUniformRandom = UnitUniformRandom.getDefault()): Random{
        const a = this.a, b = this.b;
        const ba = b-a, ca = this.c-a, fc = ca/ba;

        return new class extends Random{
            next(): number {
                const r = rand.next();
                if(r < fc)
                    return a + Math.sqrt(r*ba*ca);
                else
                    return b - Math.sqrt((1-r)*ba*(ba-ca))
            }
        }
    }
}