"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oAuthSupport = void 0;
const Logger_1 = require("./Logger");
const W3oModule_1 = require("./W3oModule");
const W3oAuthenticator_1 = require("./W3oAuthenticator");
const logger = new Logger_1.Logger('W3oAuthSupport');
// Clase abstracta que representa un autenticador de usuario
class W3oAuthSupport extends W3oModule_1.W3oModule {
    constructor(name, type, parent) {
        const context = logger.method('constructor', { name, type }, parent);
        super(context);
        this.name = name;
        this.type = type;
    }
    // Método para crear un autenticador
    createAuthenticator(parent) {
        const context = logger.method('createAuthenticator', undefined, parent);
        return new W3oAuthenticator_1.W3oAuthenticator(this, context);
    }
}
exports.W3oAuthSupport = W3oAuthSupport;
//# sourceMappingURL=W3oAuthSupport.js.map