import { assert } from 'chai';
import { newLinearCongruentialRandom, OldJavaRandom } from './LinearCongruentialRandom'
import { UnitUniformRandomTester } from './UnitUniformRandomTester'
import { testRandomStatistics } from './Random.spec';

describe('LinearCongruentialRandom', () => {
    const n = 10000;

    describe('constructor()', () => {
        it('should throw an error when the constructer paramter a is not positive.', () => {
            assert.throw(() => newLinearCongruentialRandom(-1, 11, 32, 1));
            assert.throw(() => newLinearCongruentialRandom(0, 11, 32, 1));
        });

        it('should throw an error when the constructer paramter c is negative.', () => {
            assert.throw(() => newLinearCongruentialRandom(2, -1, 32, 1));
            assert.doesNotThrow(() => newLinearCongruentialRandom(2, 0, 32, 1));
        });

        it('should throw an error when the constructer paramter p is not positive.', () => {
            assert.throw(() => newLinearCongruentialRandom(2, 11, 0, 1));
            assert.throw(() => newLinearCongruentialRandom(2, 11, -1, 1));
        });

        it('should throw an error when the constructer paramter seed is negative.', () => {
            assert.throw(() => newLinearCongruentialRandom(2, 11, 32, -1));
            assert.doesNotThrow(() => newLinearCongruentialRandom(2, 11, 32, 0));
        });
    });

    describe('#next()', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = newLinearCongruentialRandom(1566083941, 1, 32, 12345);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = newLinearCongruentialRandom(1566083941, 1, 32, 12345);
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });

    describe('#next() with the addend(parameter c) zero', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = newLinearCongruentialRandom(1566083941, 0, 32, 12345);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = newLinearCongruentialRandom(1566083941, 0, 32, 12345);
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });
});

describe('OldJavaRandomRandom', () => {
    const n = 50000;

    describe('constructor()', () => {
        it('should throw an error when the constructer paramter is negative.', () => {
            assert.throw(() => new OldJavaRandom(-1));
            assert.doesNotThrow(() => new OldJavaRandom(0));
        });
    });

    describe('#next() with no seed', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new OldJavaRandom();
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new OldJavaRandom();
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });

    describe('#next() with number seed', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new OldJavaRandom(7);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new OldJavaRandom(7);
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });

    describe('#next() with bigint seed', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new OldJavaRandom(BigInt(11));
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new OldJavaRandom(BigInt(11));
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });
});