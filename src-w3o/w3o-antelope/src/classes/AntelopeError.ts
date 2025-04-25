// w3o-antelope/src/classes/AntelopeError.ts

import { W3oError } from "@vapaee/w3o-core";

// Represents a specific error within Web3 Octopus
export class AntelopeError extends W3oError {

    constructor(error: { message: string, code: number }, payload?: any) {
        super(error, payload);
    }

    // List of error codes
    public static readonly WHARFKIT_NOT_FOUND = { message: 'Wharfkit not found', code: 2000 };

}



