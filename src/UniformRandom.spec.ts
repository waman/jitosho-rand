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
        it('created by create()', () => {
            // SetUp
            const sut = UniformRandom.create();
            // Verify
            assert(sut instanceof UnitUniformRandom)
            testRandomStatistics(sut, n);
        });
    });


    describe('Magnified (only the max value is specified)', () => {
        it('created by create(max)', () => 
            testRandomStatistics(UniformRandom.create(7), n));
        it('created by create(undefined, max)', () => 
            testRandomStatistics(UniformRandom.create(undefined, 13), n));
    });

    describe('General (the min and max values are specified)', () => {
        it('created by create(min, max)', () => 
            testRandomStatistics(UniformRandom.create(17, 43), n));
    });
});

describe('UnitUniformRandom', () => {
    const n = 100000;

    function testUnitUniformRandom(sut: UnitUniformRandom, n: number){
        it('should pass test of testRandomStatistics.', () => {
            testRandomStatistics(sut, n);
        });

        it('should pass test of UnitUniformRandomTester.', () => {
            assert(UnitUniformRandomTester.test(sut, n));
        });
    }
    
    describe('#next()', () => {
        it('should pass test of testRandomStatistics.', () => 
            testUnitUniformRandom(UnitUniformRandom.getDefault(), n));
    });

    describe('#next(max)', () => {
        describe('should return a generator generating random numbers in [0,max).', () => {
            function test(max: number){
                // SetUp
                const rand = UnitUniformRandom.getDefault();
                // Exercise
                for(let i = 0; i < n; i++){
                    const x = rand.nextNumber(max);
                    // Verify
                    assert(0 <= x && x < max);
                }
            }

            it('when the max is greater than 1', () => test(7));
            it('when the max is less than 1', () => test(0.7));
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
            testUnitUniformRandom(UnitUniformRandom.getDefault().improve(), n);
        });

        describe('UnitUniformRandom returned by #improve() with pool sized', () => 
            testUnitUniformRandom(UnitUniformRandom.getDefault().improve(101), n));
    });

    describe('UnitUniformRanodom implementations', () => {
    
        describe('LinearCongruentialRandom', () => {
        
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
        
            describe('#next()', () => 
                testUnitUniformRandom(newLinearCongruentialRandom(1566083941, 1, 32, 12345), n));
        
            describe('#next() with the addend(parameter c) zero', () => 
                testUnitUniformRandom(newLinearCongruentialRandom(1566083941, 0, 32, 12345), n));
        });
        
        describe('OldJavaRandomRandom', () => {
        
            describe('constructor()', () => {
                it('should throw an error when the constructer paramter is negative.', () => {
                    assert.throw(() => new OldJavaRandom(-1));
                    assert.doesNotThrow(() => new OldJavaRandom(0));
                });
            });
        
            describe('#next() with no seed', () => 
                testUnitUniformRandom(new OldJavaRandom(), n));
        
            describe('#next() with number seed', () => 
                testUnitUniformRandom(new OldJavaRandom(7), n));
        
            describe('#next() with bigint seed', () => 
                testUnitUniformRandom(new OldJavaRandom(BigInt(11)), n));
        });
        
        describe('MSequenceRandom', () => {
        
            describe('constructor()', () => {
                it('should throw an error when the constructer paramter is negative.', () => {
                    assert.throw(() => new MSequenceRandom(-1));
                    assert.doesNotThrow(() => new MSequenceRandom(0));
                });
            });
        
            describe('#next() with no seed', () => 
                testUnitUniformRandom(new MSequenceRandom(), n));
        
            describe('#next() with number seed', () => 
                testUnitUniformRandom(new MSequenceRandom(17), n));
        });
        
        describe('MersenneTwister', () => {
        
            describe('constructor()', () => {
                it('should throw an error when the constructer paramter is/includes negative value.', () => {
                    assert.throw(() => new MersenneTwister(-1));
                    assert.throw(() => new MersenneTwister([3, 5, -1, 7]));
                    assert.doesNotThrow(() => new MersenneTwister(0));
                });
            });
        
            describe('#next() with no seed', () => 
                testUnitUniformRandom(new MersenneTwister(), n));
        
            describe('#next() with number seed', () => 
                testUnitUniformRandom(new MersenneTwister(7), n));
        
            describe('#next() with number[] seed', () =>
                testUnitUniformRandom(new MersenneTwister([7, 11, 31]), n));
        });
        
        describe('WichmannHillRandom', () => {

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
        
            describe('#next() with no seed', () => 
                testUnitUniformRandom(new WichmannHillRandom(), n));
        
            describe('#next() with seed', () => 
                testUnitUniformRandom(new WichmannHillRandom(2, 3, 5), n));
        });
    
    })
});