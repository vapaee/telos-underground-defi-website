"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oContract = void 0;
const Logger_1 = require("./Logger");
const logger = new Logger_1.Logger('W3oContract');
// Representa un contrato, incluyendo métodos para obtener su ABI y un snapshot del estado interno
class W3oContract {
    constructor(address, name, abi, parent) {
        this.address = address;
        this.name = name;
        this.abi = abi;
        logger.method('constructor', { address, name, abi }, parent);
    }
    // Método para tomar una instantánea del estado del contrato
    snapshot() {
        return {
            address: this.address,
            name: this.name,
            abi: this.abi,
        };
    }
}
exports.W3oContract = W3oContract;
//# sourceMappingURL=W3oContract.js.map