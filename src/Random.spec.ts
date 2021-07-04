import 'mocha';
import { assert } from 'chai';
import { newRNG, Random } from './Random';
import { UniformRandom } from './UniformRandom';

class Stat{
    private readonly binCount: number;
    private readonly minExp: number;
    private readonly _histogram: number[];
    readonly delta: number;

    // init
    private n = 0;
    private sum = 0;
    private sum2 = 0;
    private _min;
    private _max;

    constructor(binCount: number, minExp: number, maxExp: number){
        this.binCount = binCount;
        this.minExp = minExp;
        this.delta = (maxExp - minExp)/binCount;
        this._histogram = new Array<number>(this.binCount);
        this._histogram.fill(0);
        this._min = maxExp;
        this._max = minExp;
    }

    addData(x: number){
        this.n++;
        this.sum += x;
        this.sum2 += x*x;
        this._min = Math.min(this._min, x);
        this._max = Math.max(this._max, x);
        this._histogram[Math.floor((x-this.minExp)/this.delta)]++;
    }

    valueOf(i: number): number { return this.minExp + i * this.delta; }
    histogram(i: number): number { return this._histogram[i]; }

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
        return this.valueOf(this.iMedian);
    }

    modeMin(): number { 
        if(!this.medianAndModesAreCalculated){
            this.calculateMedianAndModes();
            this.medianAndModesAreCalculated = true;
        }
        return this.valueOf(this.iModeMin); 
    }
    modeMax(): number { 
        if(!this.medianAndModesAreCalculated){
            this.calculateMedianAndModes();
            this.medianAndModesAreCalculated = true;
        }
        return this.valueOf(this.iModeMax);
    }

    private calculateMedianAndModes(){
        this.iMedian = 0;
        this.iModeMin = 0;
        this.iModeMax = 0;
        let vModeMax = 0, vModeMin = 0, count = 0;
        for(let i = 0; i < this.binCount; i++){
            const value = this._histogram[i];
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

export function testRandomStatistics(rand: Random, n: number, minExp = rand.min(), maxExp = rand.max()){
    if(minExp === Number.NEGATIVE_INFINITY)
        assert.fail('The min argument must not be negative infinity.');
    if(maxExp === Number.POSITIVE_INFINITY)
        assert.fail('The max argument must not be infinity.');

    const binCount = 100;
    const stat = new Stat(binCount, minExp, maxExp);

    const delta = stat.delta;
    const minIsInfinity = rand.min() === Number.NEGATIVE_INFINITY ? true : false;
    const maxIsInfinity = rand.max() === Number.POSITIVE_INFINITY ? true : false;

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
    
    if(rand.mean() === 0){
        assert.approximately(stat.mean(), 0, 2*delta, 'mean');
    }else{
        assert.approximately(stat.mean(), rand.mean(), stat.mean()*2/Math.sqrt(n), 'mean');
    }

    assert.approximately(stat.variance(), rand.variance(), stat.variance()*2/Math.sqrt(n), 'variance');

    assert.approximately(stat.median(), rand.median(), 2*delta, 'median');

    if(!(rand instanceof UniformRandom)){
        assert.approximately(stat.modeMin(), rand.mode('min'), 2*delta, 'modeMin');
        assert.approximately(stat.modeMax(), rand.mode('max'), 2*delta, 'modeMax');
    }

    let acc = 0, sumFreq = 0;
    for(let i = 0; i < binCount; i++){
        const freq = stat.histogram(i);
        if(freq === 0){
            assert(rand.pdf(stat.valueOf(i)) < Math.sqrt(binCount/n),
                    `no value between [${stat.valueOf(i)},${stat.valueOf(i+1)}) appears: ` +
                        `pdf value ${rand.pdf(stat.valueOf(i))}`);
        }else{
            sumFreq += freq;
            acc += freq;

            // assert PDF
            const x = stat.valueOf(i) + delta/2;
            const y = freq/(delta*n);
            assert.approximately(rand.pdf(x), y, y*5/Math.sqrt(freq),
                `PDF value is unexpected at ${x}`);

            // assert CDF
            const x1 = stat.valueOf(i+1);
            const z = acc/n;
            assert.approximately(rand.cdf(x1), z, z*3/Math.sqrt(sumFreq),
                `CDF value is unexpected at ${x1}`);
        }
    }
    if(!minIsInfinity){
        assert(rand.pdf(rand.min()-1) === 0, `PDF value is unexpected at min-1`);
        assert(rand.cdf(rand.min()-1) === 0, `CDF value is unexpected at min-1`);
    }
    if(!maxIsInfinity){
        assert(rand.pdf(rand.max()+1) === 0, `PDF value is unexpected at max+1`);
        assert(rand.cdf(rand.max()+1) === 1, `CDF value is unexpected at max+1`);
    }
}

describe('newRNG', () => {
    const n = 5000;
    it('should return a generator generating random numbers in [0,1)', () => {
        // Exercise
        const rng = newRNG(UniformRandom.getDefault());
        for(let i = 0; i < n; i++){
            const x = rng.next().value;
            // Verify
            assert(0 <= x && x < 1);
        }
    });
});