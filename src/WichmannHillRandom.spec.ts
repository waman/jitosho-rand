import { assert } from 'chai';
import { WichmannHillRandom } from './WichmannHillRandom'
import { UniformRandomTester } from './UniformRandomTester'
import { testRandomNumberRange } from './UniformRandomTester.spec';

describe('WichmannHillRandom', () => {
    const n = 2000;

    describe('constructor()', () => {
        it('should throw an error when one of constructer paramters is out of range [1,30000].', () => {
            assert.throw(() => new WichmannHillRandom(0));
            assert.throw(() => new WichmannHillRandom(30001));
            assert.throw(() => new WichmannHillRandom(1, 0));
            assert.throw(() => new WichmannHillRandom(1, 30001));
            assert.throw(() => new WichmannHillRandom(1, 1, 0));
            assert.throw(() => new WichmannHillRandom(1, 1, 30001));
        });
    });

    describe('#next() with no seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new WichmannHillRandom();
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new WichmannHillRandom();
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });

    describe('#next() with seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new WichmannHillRandom(2, 3, 5);
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new WichmannHillRandom(2, 3, 5);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });
});