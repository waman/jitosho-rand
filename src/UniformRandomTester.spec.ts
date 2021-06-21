import { assert } from "chai";
import { UniformRandom } from "./Random";
import { UniformRandomTester } from "./UniformRandomTester";

export function testRandomNumberRange(rng: UniformRandom, n: number) {
    // SetUp
    let appearNonzero = false, appearLessHarf = false, appearMoreHarf = false;
    for(let i = 0; i < n; i++){
        // Exercise
        const r = rng.next();
        // Verify
        assert(0.0 <= r && r < 1.0, `a value out of range [0,1) appears: ${r}`);
        if(r > 0.0) appearNonzero = true;
        if(r < 0.5) appearLessHarf = true;
        if(0.5 < r) appearMoreHarf = true;
    }
    assert(appearNonzero, 'All values are zero.');
    assert(appearLessHarf, 'All values are greater than 0.5');
    assert(appearMoreHarf, 'All values are less than 0.5');
}

describe('UniformRandomTester', () => {

    describe('#test()', () => {
        it('should return true for Math.random()', () => {
            // SetUp
            const rand = UniformRandom.getDefault();
            // Exercise & Verify
            assert(UniformRandomTester.test(rand, 10000));
        });
    });
});