"use strict";
// w3o-core/src/classes/W3oContractManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oContractManager = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Logger_1 = require("./Logger");
const logger = new Logger_1.Logger('W3oContractManager');
// Represents a contract manager, including methods to add, get, and list contracts
class W3oContractManager {
    constructor(network, parent) {
        this.network = network;
        // This is a contract cache that will fill as they are requested
        this.__contracts = {};
        logger.method('constructor', { network }, parent);
    }
    // Property to get the list of contracts
    get list() {
        // Debemos filtrar los valores null para que la lista solo contenga contratos válidos
        return Object.values(this.__contracts).filter(contract => contract !== null);
    }
    // Property to get the list of contract addresses
    get addresses() {
        return Object.keys(this.__contracts).map(address => address);
    }
    // Method to add a contract
    addContract(address, contract, parent) {
        const context = logger.method('addContract', { address, contract }, parent);
        if (contract) {
            this.__contracts[address] = contract;
            context.info(`Contract added at address: ${address}`, parent);
        }
        else {
            context.warn(`No contract provided for address: ${address}`, parent);
        }
    }
    // Method to get a contract by its address
    getContract(address, parent) {
        const context = logger.method('getContract', { address }, parent);
        const contract = this.__contracts[address];
        if (contract !== undefined) {
            return (0, rxjs_1.from)(Promise.resolve(contract));
        }
        return this.fetchContract(address, context).pipe((0, operators_1.mergeMap)(fetchedContract => {
            if (fetchedContract) {
                this.addContract(address, fetchedContract, context);
            }
            else {
                this.__contracts[address] = null;
            }
            return (0, rxjs_1.from)(Promise.resolve(fetchedContract));
        }));
    }
    // Method to get all contracts
    getContracts(parent) {
        logger.method('getContracts', undefined, parent);
        return this.list;
    }
    // Method to get a token contract by its symbol
    getTokenContract(symbol, parent) {
        const context = logger.method('getTokenContract', { symbol }, parent);
        const token = this.network.getToken(symbol, parent);
        if (!token) {
            context.warn(`No token found with symbol: ${symbol}`, parent);
            return (0, rxjs_1.from)(Promise.resolve(null));
        }
        const existingContract = this.list.find(contract => contract.address === token.address) || null;
        if (existingContract) {
            context.info(`Token contract found with symbol: ${symbol}`, parent);
            return (0, rxjs_1.from)(Promise.resolve(existingContract));
        }
        return this.fetchContract(token.address, context).pipe((0, operators_1.mergeMap)(fetchedContract => {
            if (fetchedContract) {
                this.addContract(token.address, fetchedContract, context);
            }
            return (0, rxjs_1.from)(Promise.resolve(fetchedContract));
        }));
    }
    // Method to take a snapshot of the contract manager state
    snapshot() {
        return {
            contracts: this.list.map(contract => contract.snapshot()),
        };
    }
}
exports.W3oContractManager = W3oContractManager;
//# sourceMappingURL=W3oContractManager.js.map