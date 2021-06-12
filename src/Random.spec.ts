import { newRNG, UniformRandom } from './Random';
import { assert } from 'chai';
import 'mocha';

describe('UniformRandom', () => {
    const n = 1000;
    
    describe('#next()', () => {
        it('should return a generator generating random numbers in [0,1)', () => {
            // SetUp
            const rand = UniformRandom.getDefault();
            // Exercise
            for(let i = 0; i < n; i++){
                const x = rand.next();
                // Verify
                assert(0.0 <= x && x < 1.0);
            }
        });
    });

    describe('#next(max)', () => {
        it('should return a generator generating random numbers in [0,max)', () => {
            // SetUp
            const max = 7.0;
            const rand = UniformRandom.getDefault();
            // Exercise
            for(let i = 0; i < n; i++){
                const x = rand.nextNumber(max);
                // Verify
                assert(0.0 <= x && x < max);
            }
        });
    });


    describe('#next(min, max)', () => {
        it('should return a generator generating random numbers in [min,max)', () => {
            // SetUp
            const min = 3.0, max = 7.0;
            const rand = UniformRandom.getDefault();
            // Exercise
            for(let i = 0; i < n; i++){
                const x = rand.nextNumberIn(min, max);
                // Verify
                assert(min <= x && x < max);
            }
        });
    });
});

describe('newRNG', () => {
    const n = 1000;
    it('should return a generator generating random numbers in [0,1)', () => {
        // Exercise
        const rng = newRNG();
        for(let i = 0; i < n; i++){
            const x = rng.next().value;
            // Verify
            assert(0.0 <= x && x < 1.0);
        }
    });
});