import { assert } from "chai";

import { testRandomStatistics } from "./Random.spec";
import { UniformRandom, UnitUniformRandom } from "./UniformRandom";
import { UnitUniformRandomTester } from "./UnitUniformRandomTester";

import { newLinearCongruentialRandom, OldJavaRandom } from "./LinearCongruentialRandom";
import { MersenneTwister } from "./MersenneTwister";
import { MSequenceRandom } from "./MSequenceRandom";
import { WichmannHillRandom } from "./WichmannHillRandom";

describe('UnitUniformRandomTester', () => {

    describe('#test()', () => {
        it('should return true for Math.random()', () => {
            // SetUp
            const rand = UnitUniformRandom.getDefault();
            // Exercise & Verify
            assert(UnitUniformRandomTester.test(rand, 10000));
        });
    });
});

describe('UniformRandom', () => {
    const n = 50000;

    describe('Unit (the min and max values are not specified... UnitUniformRandom)', () => {
        it('created as create()', () => {
            // SetUp
            const sut = UniformRandom.create();
            // Verify
            assert(sut instanceof UnitUniformRandom)
            testRandomStatistics(sut, n);
        });
    });


    describe('Magnified (only the max value is specified)', () => {
        it('created as create(max)', () => {
            // SetUp
            const sut = UniformRandom.create(7);
            // Verify
            testRandomStatistics(sut, n);
        });

        it('created as create(undefined, max)', () => {
            // SetUp
            const sut = UnitUniformRandom.create(undefined, 13);
            // Verify
            testRandomStatistics(sut, n);
        });
    });

    describe('General (the min and max values are specified)', () => {
        it('created as create(min, max)', () => {
            // SetUp
            const sut = UnitUniformRandom.create(17, 43);
            // Verify
            testRandomStatistics(sut, n);
        });
    });
});

describe('UnitUniformRandom', () => {
    const n = 100000;
    
    describe('#next()', () => {
        it('should return a generator generating random numbers in [0,1)', () => {
            // SetUp
            const sut = UnitUniformRandom.getDefault();
            // Verify
            testRandomStatistics(sut, n);
        });
    });

    describe('#next(max)', () => {
        it('should return a generator generating random numbers in [0,max)', () => {
            // SetUp
            const max = 7;
            const rand = UnitUniformRandom.getDefault();
            // Exercise
            for(let i = 0; i < n; i++){
                const x = rand.nextNumber(max);
                // Verify
                assert(0 <= x && x < max);
            }
        });
    });


    describe('#next(min, max)', () => {
        it('should return a generator generating random numbers in [min,max)', () => {
            // SetUp
            const min = 3, max = 7;
            const rand = UnitUniformRandom.getDefault();
            // Exercise
            for(let i = 0; i < n; i++){
                const x = rand.nextNumberIn(min, max);
                // Verify
                assert(min <= x && x < max);
            }
        });
    });

    describe('#improve()', () => {
        it('should throw an error when the poolSize argument is not positive', () => {
            assert.throw(() => UnitUniformRandom.getDefault().improve(0));
            assert.throw(() => UnitUniformRandom.getDefault().improve(-1));
        });

        describe('UniformRandom returned by #improve() with no arg.', () => {
            it('should return random numbers in [0,1)', () => {
                // SetUp
                const sut = UnitUniformRandom.getDefault().improve();
                // Verify
                testRandomStatistics(sut, n);
            });

            it('should pass test of UnitUniformRandomTester.', () => {
                // SetUp
                const sut = UnitUniformRandom.getDefault().improve();
                // Verify
                assert(UnitUniformRandomTester.test(sut, n));
            });
        });

        describe('UnitUniformRandom returned by #improve() with pool sized', () => {
            it('should return random numbers in [0,1)', () => {
                // SetUp
                const sut = UnitUniformRandom.getDefault().improve(101);
                // Verify
                testRandomStatistics(sut, n);
            });

            it('should pass test of UnitUniformRandomTester.', () => {
                // SetUp
                const sut = UnitUniformRandom.getDefault().improve(101);
                // Verify
                assert(UnitUniformRandomTester.test(sut, n));
            });
        });
    });
});
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