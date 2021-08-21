import { logGamma } from "./GammaFunction"

export function pGammaNormalizable(a: number, x: number, logGamma_a: number): number {
    if(x >= 1 + a) return 1 - qGammaNormalizable(a, x, logGamma_a);
    if(x === 0)    return 0;

    let result = Math.exp(a * Math.log(x) - x - logGamma_a) / a,
        term   = result;
    for(let k = 1; k < 1000; k++){
        const prev = result;
        term *= x / (a + k);
        result += term;
        if(result === prev) return result;
    }
    return Number.NaN;
} 

export function qGammaNormalizable(a: number, x: number, logGamma_a: number): number {
    if(x < 1 + a) return 1 - pGammaNormalizable(a, x, logGamma_a);
    let w = Math.exp(a * Math.log(x) - x - logGamma_a);
    let la = 1, lb = 1 + x - a, result = w / lb;
    for(let k = 2; k < 1000; k++){
        let temp = ((k-1-a)*(lb-la) + (k+x)*lb)/k;
        la = lb; lb = temp;
        w *= (k-1-a)/k;
        temp = w/(la*lb);
        const prev = result;
        result += temp;
        if(result === prev) return result;
    }
    return Number.NaN;
}

// //***** incomplete gamma function *****
// export function pGamma(a: number, x: number): number {
//     return pGammaNormalizable(a, x, logGamma(a));
// }

// export function qGamma(a: number, x: number): number {
//     return qGammaNormalizable(a, x, logGamma(a));
// }

// //***** chi square distribution *****
// export function pChi2(x: number, nFree: number): number {
//     return pGamma(0.5*nFree, 0.5*x);
// }

// export function qChi2(x: number, nFree: number): number {
//     return qGamma(0.5*nFree, 0.5*x);
// }