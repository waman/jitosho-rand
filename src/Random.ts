interface Random{
    next(): number;
}

export function* newRandomNumberGenerator(rand?: Random){
    const rng = rand ? rand : UniformRandom.getDefault();
    while(true){
        yield rng.next();
    }
}

export abstract class UniformRandom implements Random{
    abstract next(): number;

    nextNumber(max: number): number {
        return this.next() * max;
    }

    nextNumberIn(min: number, max: number): number {
        return min + this.next() * (max - min);
    }

    static getDefault(): UniformRandom{
        return new DefaultUniformRandom();
    }
}

class DefaultUniformRandom extends UniformRandom{
    next(): number {
        return Math.random();
    }
}