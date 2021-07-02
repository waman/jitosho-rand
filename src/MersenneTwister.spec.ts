import { assert } from 'chai';
import { MersenneTwister } from './MersenneTwister'
import { UnitUniformRandomTester } from './UnitUniformRandomTester'
import { testRandomStatistics } from './Random.spec';

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
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new MersenneTwister();
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new MersenneTwister();
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });

    describe('#next() with number seed', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new MersenneTwister(7);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new MersenneTwister(7);
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });

    describe('#next() with number[] seed', () => {
        const seeds = [7, 11, 31];
        it('should pass testRandomStatistics', () => {
            // SetUp
            const sut = new MersenneTwister(seeds);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new MersenneTwister(seeds);
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });
});