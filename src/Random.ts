export abstract class Random{

    /** Return a random number. */
    abstract next(): number;
}

/**
 *  Create a new Random Number Generator (RNG).
 */
export function* newRNG(rand: Random){
    while(true) yield rand.next();
}