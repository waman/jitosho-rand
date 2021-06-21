import { assert } from 'chai';
import { LinearCongruentialRandom, JavaRandom } from './LinearCongruentialRandom'
import { UniformRandomTester } from './UniformRandomTester'
import { testRandomNumberRange } from './UniformRandomTester.spec';

describe('LinearCongruentialRandom', () => {
    const n = 1000;

    describe('constructor()', () => {
        it('should throw an error when the constructer paramter a is not positive.', () => {
            assert.throw(() => new LinearCongruentialRandom(-1, 11, 32, 1));
            assert.throw(() => new LinearCongruentialRandom(0, 11, 32, 1));
        });

        it('should throw an error when the constructer paramter c is negative.', () => {
            assert.throw(() => new LinearCongruentialRandom(2, -1, 32, 1));
            assert.doesNotThrow(() => new LinearCongruentialRandom(2, 0, 32, 1));
        });

        it('should throw an error when the constructer paramter p is not positive.', () => {
            assert.throw(() => new LinearCongruentialRandom(2, 11, 0, 1));
            assert.throw(() => new LinearCongruentialRandom(2, 11, -1, 1));
        });

        it('should throw an error when the constructer paramter seed is negative.', () => {
            assert.throw(() => new LinearCongruentialRandom(2, 11, 32, -1));
            assert.doesNotThrow(() => new LinearCongruentialRandom(2, 11, 32, 0));
        });
    });

    describe('#next()', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new LinearCongruentialRandom(1566083941, 1, 32, 12345);
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new LinearCongruentialRandom(1566083941, 1, 32, 12345);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });
});

describe('JavaRandomRandom', () => {
    const n = 5000;

    describe('constructor()', () => {
        it('should throw an error when the constructer paramter is negative.', () => {
            assert.throw(() => new JavaRandom(-1));
            assert.doesNotThrow(() => new JavaRandom(0));
        });
    });

    describe('#next() with no seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new JavaRandom();
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new JavaRandom();
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });

    describe('#next() with number seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new JavaRandom(7);
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new JavaRandom(7);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });

    describe('#next() with bigint seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new JavaRandom(BigInt(11));
            // Verify
            testRandomNumberRange(rng, n);
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new JavaRandom(BigInt(11));
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });
});