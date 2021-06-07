import { newRNG } from './Random';
import { expect } from 'chai';
import 'mocha';

describe('newRNG', () => {
    const n = 1000;
    it('should return a generator generating random numbers in [0,1)', () => {
        // Exercise
        const rng = newRNG();
        for(let i = 0; i < n; i++){
            const x = rng.next().value;
            // Verify
            expect(x).greaterThanOrEqual(0.0).and.lessThan(1.0);
        }
    });
});