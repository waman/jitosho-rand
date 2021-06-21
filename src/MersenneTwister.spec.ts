import { assert } from 'chai';
import { MersenneTwister } from './MersenneTwister'
import { UniformRandomTester } from './UniformRandomTester'
import { testRandomNumberRange } from './UniformRandomTester.spec';

describe('MersenneTwister', () => {
    const n = 10000;

    describe('constructor()', () => {
        it('should throw an error when the constructer paramter is/includes negative value.', () => {
            assert.throw(() => new MersenneTwister(-1));
            assert.throw(() => new MersenneTwister([3, 5, -1, 7]));
            assert.doesNotThrow(() => new MersenneTwister(0));
        });
    });

    describe('#next() with no seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new MersenneTwister();
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new MersenneTwister();
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });

    describe('#next() with number seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new MersenneTwister(7);
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new MersenneTwister(7);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });

    describe('#next() with number[] seed', () => {
        const seeds = [7, 11, 31];
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new MersenneTwister(seeds);
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new MersenneTwister(seeds);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });
});