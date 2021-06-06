import { newRandomNumberGenerator } from './Random';
import { expect } from 'chai';
// import chai from 'chai';
import 'mocha';

// chai.should();

describe('newRandomNumberGenerator', () => {
    const n = 1000;
    it('should return a generator generating random numbers in [0,1)', () => {
        // SetUp
        const rng = newRandomNumberGenerator();
        for(let i = 0; i < n; i++){
            const x = rng.next().value;
            expect(x).to.greaterThanOrEqual(0.0).and.lessThan(1.0);
        }
    });
});