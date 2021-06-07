import { assert } from "chai";
import { UniformRandom } from "./Random";
import { UniformRandomTester } from "./UniformRandomTester";

describe('test', () => {
    it('should return true for Math.random()', () => {
        // SetUp
        const rand = UniformRandom.getDefault();
        // Exercise & Verify
        assert(UniformRandomTester.test(rand, 1000));
    });
});