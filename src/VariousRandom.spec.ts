import { assert } from 'chai';

import { Random } from './Random';
import { testRandomStatistics } from './Random.spec';

import { TriangularRandom } from './TriangularRandom'
import { ExponentialRandom } from './ExponentialRanodm'

describe('VariousRandom', () => {
    const n = 100000;

    function test(sut: Random, n: number, min?: number, max?: number){
        it('should pass test of testRandomStatistics.', () => 
            testRandomStatistics(sut, n, min, max));
    }

    describe('TriangularRandom', () => {
        describe('create() factory method', () => {
            it('should throw error if the arguments has illegal order relation', () => {
                assert.throw(() => TriangularRandom.create(1, 1)); // min === max
                assert.throw(() => TriangularRandom.create(2, 1)); // min > max
                assert.throw(() => TriangularRandom.create(1, 1, 1)); // a === b
                assert.throw(() => TriangularRandom.create(1, 2, 1)); // a === c
                assert.throw(() => TriangularRandom.create(1, 2, 2)); // b === c
                assert.throw(() => TriangularRandom.create(3, 1, 2)); // a > b
                assert.throw(() => TriangularRandom.create(1, 2, 0)); // a > c
                assert.throw(() => TriangularRandom.create(1, 2, 3)); // b < c
            });
        });

        describe('Simple (a=-1, b=1, c=0)', () => 
            test(TriangularRandom.create(), n));

        describe('Symmetric (c=(a+b)/2)', () => 
            test(TriangularRandom.create(0, 1), n));

        describe('General', () => 
            test(TriangularRandom.create(-1, 2, 1), n));
    });

    describe('ExponentialRandom', () => {
        describe('create() factory method', () => {
            it('should throw error if lambda is not positive', () => {
                assert.throw(() => ExponentialRandom.create(0)); // lambda === 0
                assert.throw(() => ExponentialRandom.create(-2)); // lambda < 0
            });
        });

        describe('Simple (lambda=1)', () => 
            test(ExponentialRandom.create(), n, 0, 5));

        describe('General', () => 
            test(ExponentialRandom.create(3), n, 0, 10));
    });
});