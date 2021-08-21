import 'mocha';
import { assert } from 'chai';
import { Distribution } from './Distribution';
import { UniformDistribution } from './UniformDistribution';

export class Stat{
    private readonly _histogram: Map<number, number>;
    readonly delta: number;

    // init
    private n = 0;
    private sum = 0;
    private sum2 = 0;
    private _min: number = 0;
    private _max: number = 0;
    private hasData = false;

    constructor(delta: number){
        this.delta = delta;
        this._histogram = new Map<number, number>();
    }

    x(i: number): number { return i * this.delta; }
    index(x: number): number { return Math.floor(x/this.delta); }
    minIndex(): number { return this.index(this._min); }
    maxIndex(): number { return this.index(this._max); }

    frequency(i: number): number { 
        const value = this._histogram.get(i);
        return value !== undefined ? value : 0;
    }

    addData(x: number){
        this.n++;
        this.sum += x;
        this.sum2 += x*x;
        this._min = this.hasData ? Math.min(this._min, x) : x;
        this._max = this.hasData ? Math.max(this._max, x) : x;

        const i = this.index(x);
        this._histogram.set(i, this.frequency(i)+1);

        this.hasData = true;
        this.medianAndModesAreCalculated = false;
    }

    min(): number { return this._min; }
    max(): number { return this._max; }

    mean(): number { return this.sum/this.n; }
    variance(): number { 
        const m = this.mean();
        return this.sum2/this.n - m*m;
    }

    private medianAndModesAreCalculated = false;
    private iMedian: number = 0;
    private iModeMin: number = 0;
    private iModeMax: number = 0;

    median(): number { 
        if(!this.medianAndModesAreCalculated){
            this.calculateMedianAndModes();
            this.medianAndModesAreCalculated = true;
        }
        return this.x(this.iMedian);
    }

    modeMin(): number { 
        if(!this.medianAndModesAreCalculated){
            this.calculateMedianAndModes();
            this.medianAndModesAreCalculated = true;
        }
        return this.x(this.iModeMin); 
    }
    modeMax(): number { 
        if(!this.medianAndModesAreCalculated){
            this.calculateMedianAndModes();
            this.medianAndModesAreCalculated = true;
        }
        return this.x(this.iModeMax);
    }

    private calculateMedianAndModes(){
        this.iMedian = 0;
        this.iModeMin = 0;
        this.iModeMax = 0;
        let vModeMax = 0, vModeMin = 0, count = 0;
        const n = this.maxIndex()
        for(let i = this.minIndex(); i < n; i++){
            const value = this.frequency(i);
            if(count < this.n/2){
                count += value;
                this.iMedian = i+1;
            }
            if(value > vModeMin){
                vModeMin = value;
                this.iModeMin = i;
            }
            if(value >= vModeMax){
                vModeMax = value;
                this.iModeMax = i;
            }
        }
    }
}

const width = 10/3;
export function testDistribution(
        dist: Distribution, n: number, delta: number, rand = dist.random()){

    const minExp = dist.min();
    const maxExp = dist.max();

    const stat = new Stat(delta);

    const minIsInfinity = minExp === Number.NEGATIVE_INFINITY ? true : false;
    const maxIsInfinity = maxExp === Number.POSITIVE_INFINITY ? true : false;

    // Add data
    for(let i = 0; i < n; i++){
        const x = rand.next();
        if(!minIsInfinity) assert(x >= minExp, `a value less than ${minExp} appears: ${x}`);
        if(!maxIsInfinity) assert(x <= maxExp, `a value greater than ${maxExp} appears: ${x}`);
        stat.addData(x);
    }

    // assert statistics
    if(!minIsInfinity) assert(stat.min() >= minExp, 'min');
    if(!maxIsInfinity) assert(stat.max() <= maxExp, 'max');
    
    if(dist.mean() === 0){
        assert.approximately(stat.mean(), 0, width*delta, 'mean');
    }else{
        assert.approximately(stat.mean(), dist.mean(), stat.mean()*width/Math.sqrt(n), 'mean');
    }

    assert.approximately(stat.variance(), dist.variance(), stat.variance()*width/Math.sqrt(n), 'variance');

    assert.approximately(stat.median(), dist.median(), width*delta, 'median');

    if(!(dist instanceof UniformDistribution)){
        const modeError = width*delta*2.5;  // 2.5 times width
        assert.approximately(stat.modeMin(), dist.mode('min'), modeError, 'modeMin');
        assert.approximately(stat.modeMax(), dist.mode('max'), modeError, 'modeMax');
    }

    let acc = 0;
    const nMax = stat.maxIndex();
    for(let i = stat.minIndex(); i < nMax; i++){
        const freq = stat.frequency(i);
        acc += freq;

        // assert PDF
        const x = stat.x(i) + delta/2;
        const y = freq/(delta*n);
        const pdfError = freq !== 0 ? y*width*1.5/Math.sqrt(freq) :  // 1.5 times width
                                      1/Math.sqrt(n*delta);
        if(y > pdfError && y > 1e-2 && dist.pdf(x) > 1e-2){
            assert.approximately(dist.pdf(x), y, pdfError,
                `PDF value is unexpected at ${x}`);
        }

        // assert CDF, CCDF
        const x1 = stat.x(i+1);
        const z = acc/n;
        assert.approximately(dist.cdf(x1), z, pdfError,
            `CDF value is unexpected at ${x1}`);
        assert.approximately(dist.ccdf(x1), 1-z, pdfError,
            `CCDF value is unexpected at ${x1}`);
    }

    if(!minIsInfinity){
        assert(dist.pdf(dist.min()-1) === 0, `PDF value is unexpected at min-1`);
        assert(dist.cdf(dist.min()-1) === 0, `CDF value is unexpected at min-1`);
    }
    if(!maxIsInfinity){
        assert(dist.pdf(dist.max()+1) === 0, `PDF value is unexpected at max+1`);
        assert(dist.cdf(dist.max()+1) === 1, `CDF value is unexpected at max+1`);
    }
}