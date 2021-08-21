import { assert } from 'chai';

import { NormalDistribution } from './NormalDistribution'
import { TriangularDistribution } from './TriangularDistribution'
import { ExponentialDistribution } from './ExponentialDistribution'

import { testDistribution } from './Distribution.spec';

describe('VariousDistribution', () => {
    const n = 250_000;
    const delta = 0.01;

    describe('NormalDistribution', () => {
        const n = 5_000_000;
        describe('create() factory method', () => {
            it('should throw error if sigma2 is not positive', () => {
                assert.throw(() => NormalDistribution.create(0, 0)); // sigma2 === 0
                assert.throw(() => NormalDistribution.create(0, -2)); // sigma2 < 0
            });
        });

        describe('Simple (mu=0, sigma2=1)', () => {
            const dist = NormalDistribution.create();

            it('should pass the testDistribution test', () => 
                testDistribution(dist, n, delta));

            it('should have the pdf that take the value 1/√2π', () => {
                assert.approximately(dist.pdf(0), 1/Math.sqrt(2*Math.PI), 1e-6);
            });
        });

        describe('General', () => {
            const mu = 3, sigma2 = 0.5
            const dist = NormalDistribution.create(mu, sigma2);

            it('should pass the testDistribution test', () => 
                testDistribution(dist, n, delta));

            it('should have the pdf that take the value 1/σ√2π', () => {
                assert.approximately(dist.pdf(mu), 1/Math.sqrt(2*Math.PI*sigma2), 1e-6);
            });
        });
    });

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

        it('Simple (a=-1, b=1, c=0)', () => 
            testDistribution(TriangularDistribution.create(), n, delta));

        it('Symmetric (c=(a+b)/2)', () => 
            testDistribution(TriangularDistribution.create(0, 1), n, delta));

        it('General', () => 
            testDistribution(TriangularDistribution.create(-1, 2, 1), n, delta));
    });

    describe('ExponentialDistribution', () => {
        describe('create() factory method', () => {
            it('should throw error if lambda is not positive', () => {
                assert.throw(() => ExponentialDistribution.create(0)); // lambda === 0
                assert.throw(() => ExponentialDistribution.create(-2)); // lambda < 0
            });
        });

        it('Simple (lambda=1)', () => 
            testDistribution(ExponentialDistribution.create(), n, delta));

        it('General', () => 
            testDistribution(ExponentialDistribution.create(3), n, delta));
    });
});