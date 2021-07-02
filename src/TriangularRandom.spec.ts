import { TriangularRandom } from './TriangularRandom'
import { testRandomStatistics } from './Random.spec';

describe('TriangularRandom', () => {
    const n = 100000;

    describe('Simple (a=-1, b=1, c=0)', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const rand = TriangularRandom.create();
            // Verify
            testRandomStatistics(rand, n);
        });
    });

    describe('Symmetric (c=(a+b)/2)', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const rand = TriangularRandom.create(0, 1);
            // Verify
            testRandomStatistics(rand, n);
        });

    });

    describe('General', () => {
        it('should pass test of testRandomStatistics.', () => {
            // SetUp
            const rand = TriangularRandom.create(-1, 2, 1);
            // Verify
            testRandomStatistics(rand, n);
        });

    });
});