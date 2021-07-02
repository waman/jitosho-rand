import { assert } from "chai";
import { testRandomStatistics } from "./Random.spec";
import { UniformRandom, UnitUniformRandom } from "./UniformRandom";
import { UnitUniformRandomTester } from "./UnitUniformRandomTester";

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