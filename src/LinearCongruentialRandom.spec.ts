import { assert } from 'chai';
import { LinearCongruentialRandom, JavaRandom } from './LinearCongruentialRandom'
import { UniformRandomTester } from './UniformRandomTester'

describe('LinearCongruentialRandom', () => {
    const n = 1000;

    describe('#next()', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new LinearCongruentialRandom(1566083941, 1, 32, 12345);
            for(let i = 0; i < n; i++){
                // Exercise
                const r = rng.next();
                // Verify
                assert(0.0 <= r && r < 1.0);
            }
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new LinearCongruentialRandom(1566083941, 1, 32, 12345);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    });
});

describe('JavaRandomRandom', () => {
    const n = 5000;

    describe('#next() with no seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new JavaRandom();
            for(let i = 0; i < n; i++){
                // Exercise
                const r = rng.next();
                // Verify
                assert(0.0 <= r && r < 1.0);
            }
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new JavaRandom();
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    })

    describe('#next() with number seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new JavaRandom(7);
            for(let i = 0; i < n; i++){
                // Exercise
                const r = rng.next();
                // Verify
                assert(0.0 <= r && r < 1.0);
            }
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new JavaRandom(7);
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    })

    describe('#next() with bigint seed', () => {
        it('should return random numbers in [0,1)', () => {
            // SetUp
            const rng = new JavaRandom(BigInt(11));
            for(let i = 0; i < n; i++){
                // Exercise
                const r = rng.next();
                // Verify
                assert(0.0 <= r && r < 1.0);
            }
        });

        it('should pass test of UniformRandomTester.', () => {
            // SetUp
            const rng = new JavaRandom(BigInt(11));
            // Verify
            assert(UniformRandomTester.test(rng, n));
        });
    })
});