import { assert } from 'chai';
import { WichmannHillRandom } from './WichmannHillRandom'
import { testRandomStatistics } from './Random.spec'
import { UnitUniformRandomTester} from './UnitUniformRandomTester'

describe('WichmannHillRandom', () => {
    const n = 10000;

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
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new WichmannHillRandom();
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new WichmannHillRandom();
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });

    describe('#next() with seed', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const sut = new WichmannHillRandom(2, 3, 5);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            // SetUp
            const sut = new WichmannHillRandom(2, 3, 5);
            // Verify
            assert(UnitUniformRandomTester.test(sut, n));
        });
    });
});