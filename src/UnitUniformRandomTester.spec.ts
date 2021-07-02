import { assert } from "chai";
import { UnitUniformRandom } from "./UniformRandom";
import { UnitUniformRandomTester } from "./UnitUniformRandomTester";

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