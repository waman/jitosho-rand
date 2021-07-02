import { assert } from 'chai';
import { MSequenceRandom } from './MSequenceRandom'
import { UnitUniformRandomTester } from './UnitUniformRandomTester'
import { testRandomStatistics } from './Random.spec';

describe('MSequenceRandom', () => {
    const n = 50000;

    describe('constructor()', () => {
        it('should throw an error when the constructer paramter is negative.', () => {
            assert.throw(() => new MSequenceRandom(-1));
            assert.doesNotThrow(() => new MSequenceRandom(0));
        });
    });

    describe('#next() with no seed', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new MSequenceRandom();
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new MSequenceRandom();
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });

    describe('#next() with number seed', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new MSequenceRandom(17);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new MSequenceRandom(17);
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });
});