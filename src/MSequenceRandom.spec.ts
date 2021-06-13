import { assert } from 'chai';
import { MSequenceRandom } from './MSequenceRandom'
import { UniformRandomTester } from './UniformRandomTester'

describe('MSequenceRandom', () => {
    const n = 1000;

    describe('#next() with no seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new MSequenceRandom();
            for(let i = 0; i < n; i++){
                // Exercise
                const r = rng.next();
                // Verify
                assert(0.0 <= r && r < 1.0);
            }
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new MSequenceRandom();
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    })

    describe('#next() with number seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new MSequenceRandom(7);
            for(let i = 0; i < n; i++){
                // Exercise
                const r = rng.next();
                // Verify
                assert(0.0 <= r && r < 1.0);
            }
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new MSequenceRandom(7);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    })
});