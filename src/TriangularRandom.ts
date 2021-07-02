import { Random } from './Random'
import { UnitUniformRandom } from './UniformRandom';

/**
 * This class can instantiate by static 'create' method.
 * 
 * Ref: 『Javaによるアルゴリズム事典』三角分布 (triangular distribution) TriangularRandom.java
 */
export abstract class TriangularRandom extends Random {

    protected constructor(){
        super();
    }

    static create(min: number = -1, 
                  max: number = 1,
                  mode?: number,
                  random: UnitUniformRandom = UnitUniformRandom.getDefault()): TriangularRandom{
        if(min === -1 && max === 1 && !mode) 
            return new SimpleTriangularRandom(random);
        else if(!mode || min + max === 2*mode)
            return new SymmetricTriangularRandom(min, max, random);
        else 
            return new GeneralTriangularRandom(min, max, mode, random);
    }
}

class SimpleTriangularRandom extends TriangularRandom {

    constructor(private readonly random: UnitUniformRandom){ 
        super();
    }
    
    next(): number { return this.random.next() - this.random.next();  }
    
    min(): number { return -1; }
    max(): number { return 1; }
    mean(): number { return 0; }
    median(): number { return 0; }
    protected modeMin(): number { return 0; }
    protected modeMax(): number { return 0; }
    variance(): number { return 1/6; }

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
}

class SymmetricTriangularRandom extends TriangularRandom {

    private readonly interval: number;

    constructor(private readonly _min: number,
                private readonly _max: number,
                private readonly random: UnitUniformRandom){
        super();
        this.random = random;
        this.interval = _max - _min;
    }
    
    next(): number {
        return (this.random.next() - this.random.next() + 1) * this.interval / 2 + this._min; 
    }
    
    min(): number { return this._min; }
    max(): number { return this._max; }
    mean(): number { return (this._min + this._max)/2; }
    median(): number { return this.mean(); }
    protected modeMin(): number { return this.mean(); }
    protected modeMax(): number { return this.mean(); }
    variance(): number { return this.interval*this.interval/24; }

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
}

/**
 * Triangular distribution with general min, mode, and max values.
 * 
 * Ref: <a href="https://en.m.wikipedia.org/wiki/Triangular_distribution">Wikipedia: Triangular distribution</a>
 */
class GeneralTriangularRandom extends TriangularRandom {

    constructor(private readonly a: number,
                private readonly b: number,
                private readonly c: number,
                private readonly random: UnitUniformRandom){
        super();
    }
    
    next(): number {
        const ba = this.b - this.a,
              ca = this.c - this.a,
              fc = ca/ba;

        const r = this.random.next();
        if(r < fc)
            return this.a + Math.sqrt(r*(ba)*(ca));
        else
            return this.b - Math.sqrt((1-r)*(ba)*(ba-ca))
    }
    
    min(): number { return this.a; }
    max(): number { return this.b; }
    mean(): number { return (this.a + this.b + this.c)/3; }
    median(): number { 
        if(this.c >= (this.a + this.b)/2){
            return this.a + Math.sqrt((this.b - this.a)*(this.c - this.a)/2);
        }else{
            return this.b - Math.sqrt((this.b - this.a)*(this.b - this.c)/2);
        }
    }
    protected modeMin(): number { return this.c; }
    protected modeMax(): number { return this.c; }
    variance(): number {
        return (this.a*this.a + this.b*this.b + this.c*this.c 
                - this.a*this.b - this.b*this.c - this.c*this.a)/18;
    }

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
}