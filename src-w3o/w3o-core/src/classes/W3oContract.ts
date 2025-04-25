// w3o-core/src/classes/W3oContract.ts

import {
    W3oContractABI
} from '../types';
import { W3oContextFactory, W3oContext } from './W3oContext';

const logger = new W3oContextFactory('W3oContract');

// Represents a contract, including methods to get its ABI and a snapshot of its internal state
export abstract class W3oContract {

    constructor(
        public readonly address: string,
        public readonly name: string,
        public readonly abi: W3oContractABI,
        parent: W3oContext
    ) {
        logger.method('constructor', { address, name, abi }, parent);
    }

    // Method to take a snapshot of the contract's state
    snapshot(): any {
        return {
            address: this.address,
            name: this.name,
            abi: this.abi,
        };
    }
}
