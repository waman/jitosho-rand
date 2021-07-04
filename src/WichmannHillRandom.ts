import { UnitUniformRandom } from './UniformDistribution'

/**
 * Ref: 『改訂新版 Cによる標準アルゴリズム事典』Wichmann-Hill の乱数発生法 
 * (Wichmann and Hill's random number generator) whrand.c
 */
export class WichmannHillRandom extends UnitUniformRandom {

    private ix: number;
    private iy: number;
    private iz: number;

    constructor(x = 1, y = 1, z = 1){
        super();
        function validateParam(name: string, t: number){
            if(t < 1 || 30000 < t) throw new Error(`${name} must be in [1,30000]: appear ${t}`);
        }
        validateParam('x', x);
        validateParam('y', y);
        validateParam('z', z);

        this.ix = x;
        this.iy = y;
        this.iz = z;
    }

    next(): number {
        this.ix = 171*(this.ix % 177) - 2*(this.ix/177);
        this.iy = 172*(this.iy % 176) - 35*(this.iy/176);
        this.iz = 170*(this.iz % 177) - 63*(this.iz/178);

        if(this.ix < 0) this.ix += 30269;
        if(this.iy < 0) this.iy += 30307;
        if(this.iz < 0) this.iz += 30323;

        let r = this.ix/30269 + this.iy/30307 + this.iz/30323;
        while(r >= 1) r--;
        return r;
    }
}