import { assert } from 'chai';
import { MSequenceRandom } from './MSequenceRandom'
import { UniformRandomTester } from './UniformRandomTester'
import { testRandomNumberRange } from './UniformRandomTester.spec';

describe('MSequenceRandom', () => {
    const n = 5000;

    describe('constructor()', () => {
        it('should throw an error when the constructer paramter is negative.', () => {
            assert.throw(() => new MSequenceRandom(-1));
            assert.doesNotThrow(() => new MSequenceRandom(0));
        });
    });

    describe('#next() with no seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new MSequenceRandom();
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new MSequenceRandom();
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });

    describe('#next() with number seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new MSequenceRandom(17);
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new MSequenceRandom(17);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });
});