import 'mocha';
import { assert } from 'chai';
import { newRNG, Random } from './Random';
import { UniformRandom } from './UniformRandom';

export function testRandomStatistics(rand: Random, n: number){
    const minExp = rand.min(), maxExp = rand.max();
    const binCount = 100;
    const histogram: number[] = new Array<number>(binCount);
    histogram.fill(0);
    const delta = (maxExp - minExp)/binCount;

    function valueOf(i: number): number { return minExp + i * delta; }

    // init
    let sum = 0;
    let sum2 = 0;
    let min: number = maxExp;
    let max: number = minExp;

    // Add data
    for(let i = 0; i < n; i++){
        const x = rand.next();
        assert(minExp <= x && x <= maxExp,
             `a value out of range [${minExp},${maxExp}] appears: ${x}`);

        sum += x;
        sum2 += x*x;
        min = Math.min(min, x);
        max = Math.max(max, x);
        histogram[Math.floor((x-minExp)/delta)]++;
    }

    // calculate statistics
    const mean = sum/n;
    const variance = sum2/n - mean*mean;
    let iModeMin = 0, vModeMin = 0, iModeMax = 0, vModeMax = 0, count = 0, iMedian = 0;
    for(let i = 0; i < n; i++){
        const value = histogram[i];
        if(value > vModeMin){
            vModeMin = value;
            iModeMin = i;
        }
        if(value >= vModeMax){
            vModeMax = value;
            iModeMax = i;
        }
        if(count < n/2){
            count += value;
            iMedian = i+1;
        }
    }

    const modeMin = valueOf(iModeMin);
    const modeMax = valueOf(iModeMax);
    const median  = valueOf(iMedian);

    // assert statistics
    assert(min >= minExp, 'min');
    assert(max <= maxExp, 'max');
    
    if(rand.mean() === 0){
        assert.approximately(mean, 0, 2*delta, 'mean');
    }else{
        assert.approximately(mean, rand.mean(), mean*2/Math.sqrt(n), 'mean');
    }
    assert.approximately(variance, rand.variance(), variance*2/Math.sqrt(n), 'variance');

    if(!(rand instanceof UniformRandom)){
        assert.approximately(modeMin, rand.mode('min'), 2*delta, 'modeMin');
        assert.approximately(modeMax, rand.mode('max'), 2*delta, 'modeMax');
    }
    assert.approximately(median, rand.median(), 2*delta, 'median');

    let acc = 0, sumFreq = 0;
    for(let i = 0; i < histogram.length; i++){
        const freq = histogram[i];
        if(freq === 0){
            assert(rand.pdf(valueOf(i)) > Math.sqrt(binCount/n),
                    `no value between [${valueOf(i)},${valueOf(i)+delta}) appears.`);
        }else{
            sumFreq += freq;
            acc += freq;

            // assert PDF
            const x = valueOf(i) + delta/2;
            const y = freq/(delta*n);
            assert.approximately(rand.pdf(x), y, y*5/Math.sqrt(freq),
                `PDF value is unexpected at ${x}`);

            // assert CDF
            const x1 = valueOf(i+1);
            const z = acc/n;
            assert.approximately(rand.cdf(x1), z, z*3/Math.sqrt(sumFreq),
                `CDF value is unexpected at ${x1}`);
        }
    }
    assert(rand.pdf(rand.min()-1) === 0, `PDF value is unexpected at min-1`);
    assert(rand.pdf(rand.max()+1) === 0, `PDF value is unexpected at max+1`);
    assert(rand.cdf(rand.min()-1) === 0, `CDF value is unexpected at min-1`);
    assert(rand.cdf(rand.max()+1) === 1, `CDF value is unexpected at max+1`);
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