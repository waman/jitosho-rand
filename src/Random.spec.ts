import { assert } from 'chai';
import { newRNG } from './Random';
import { UnitUniformRandom } from './UniformDistribution';

describe('newRNG', () => {
    const n = 5000;
    it('should return a generator generating random numbers in [0,1)', () => {
        // Exercise
        const rng = newRNG(UnitUniformRandom.getDefault());
        for(let i = 0; i < n; i++){
            const x = rng.next().value;
            // Verify
            assert(0 <= x && x < 1);
        }
    });
});