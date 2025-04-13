"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oAuthSupport = void 0;
const _1 = require(".");
const logger = new _1.Logger('W3oAuthSupport');
// Clase abstracta que representa un autenticador de usuario
class W3oAuthSupport extends _1.W3oModule {
    constructor(name, type) {
        super();
        this.name = name;
        this.type = type;
    }
    // Método para crear un autenticador
    createAuthenticator(parent) {
        logger.method('createAuthenticator', undefined, parent);
        return new _1.W3oAuthenticator(this);
    }
}
exports.W3oAuthSupport = W3oAuthSupport;
//# sourceMappingURL=W3oAuthSupport.js.map