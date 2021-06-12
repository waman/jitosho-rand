import { UniformRandom } from "./Random";

type TestResult = {mean: boolean, cc: boolean};

export class UniformRandomTester{

  static test(rand: UniformRandom, n: number): boolean {
    const testResults = new Array<TestResult>(20);
    for(let i = 0; i < 20; i++){
      testResults.push(this.testOneTime(rand, n));
    }
    return testResults.filter(r => r.mean).length >= 18  // prefer to 19
            && testResults.filter(r => r.cc).length >= 18;  // prefer to 19
  }

  private static testOneTime(rand: UniformRandom, n: number): TestResult {
    let x = 0.0, x0 = 0.0, s1 = 0.0, s2 = 0.0, r = 0.0;
    for(let xprev = 0.0, i = 0; i < n; i++){
      x = rand.next() - 0.5;
      if(i === 0) x0 = x;
      s1 += x; s2 += x*x; r += xprev*x;
      xprev = x;
    }
    r += x*x0;

    const meanError = s1 * Math.sqrt(12.0/n);

    const s12 = s1*s1;
    const cc = (n*r-s12) / (n*s2 - s12);
    const ccError = ((n-1)*cc+1.0)*Math.sqrt((n+1.0)/(n*(n-3.0)));
    
    // console.log(`mean: ${meanError}, cc: ${ccError}`);
    return {mean: Math.abs(meanError) <= 2.0, cc: Math.abs(ccError) <= 2.0 };
  }
}