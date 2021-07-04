import { assert } from 'chai';

import { Random } from './Random';
import { Distribution } from './Distribution';
import { TriangularDistribution } from './TriangularDistribution'
import { ExponentialDistribution } from './ExponentialDistribution'

import { testRandomStatistics } from './Random.spec';

describe('VariousDistribution', () => {
    const n = 100000;

    function test(sut: Distribution, n: number, min?: number, max?: number){
        it('should pass test of testRandomStatistics.', () => 
            testRandomStatistics(sut, n, min, max));
    }

    describe('TriangularDistribution', () => {
        describe('create() factory method', () => {
            it('should throw error if the arguments has illegal order relation', () => {
                assert.throw(() => TriangularDistribution.create(1, 1)); // min === max
                assert.throw(() => TriangularDistribution.create(2, 1)); // min > max
                assert.throw(() => TriangularDistribution.create(1, 1, 1)); // a === b
                assert.throw(() => TriangularDistribution.create(1, 2, 1)); // a === c
                assert.throw(() => TriangularDistribution.create(1, 2, 2)); // b === c
                assert.throw(() => TriangularDistribution.create(3, 1, 2)); // a > b
                assert.throw(() => TriangularDistribution.create(1, 2, 0)); // a > c
                assert.throw(() => TriangularDistribution.create(1, 2, 3)); // b < c
            });
        });

        describe('Simple (a=-1, b=1, c=0)', () => 
            test(TriangularDistribution.create(), n));

        describe('Symmetric (c=(a+b)/2)', () => 
            test(TriangularDistribution.create(0, 1), n));

        describe('General', () => 
            test(TriangularDistribution.create(-1, 2, 1), n));
    });

    describe('ExponentialDistribution', () => {
        describe('create() factory method', () => {
            it('should throw error if lambda is not positive', () => {
                assert.throw(() => ExponentialDistribution.create(0)); // lambda === 0
                assert.throw(() => ExponentialDistribution.create(-2)); // lambda < 0
            });
        });

        describe('Simple (lambda=1)', () => 
            test(ExponentialDistribution.create(), n, 0, 5));

        describe('General', () => 
            test(ExponentialDistribution.create(3), n, 0, 10));
    });
});