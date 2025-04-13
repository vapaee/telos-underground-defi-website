"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oSession = void 0;
const _1 = require(".");
const logger = new _1.Logger('W3oSession');
// Representa una sesión, incluyendo métodos para obtener la cuenta y la red asociadas, almacenar y recuperar datos, y obtener un snapshot del estado interno
class W3oSession {
    constructor(address, authenticator, network, parent) {
        this.address = address;
        this.authenticator = authenticator;
        this.network = network;
        // storage for user custom properties for the session
        this.__storage = {};
        // identifier for the session
        this.__id = '';
        logger.method('constructor', { address, authenticator, network }, parent);
        this.__id = `${address}${W3oSession.ID_SEPARATOR}${authenticator.name}${W3oSession.ID_SEPARATOR}${network.name}`;
    }
    // Getter para obtener el ID de la sesión
    get id() {
        return this.__id;
    }
    // Método para almacenar un valor en la sesión
    set(key, value) {
        this.__storage[key] = value;
    }
    // Método para recuperar un valor de la sesión
    get(key) {
        return this.__storage[key];
    }
    // Método para eliminar un valor de la sesión
    remove(key) {
        delete this.__storage[key];
    }
    // Metodo para obtener las claves almacenadas en la sesión
    keys() {
        return Object.keys(this.__storage);
    }
    // Método para tomar una instantánea del estado de la sesión
    snapshot() {
        return {
            authenticator: this.authenticator.snapshot(),
            network: this.network.snapshot(),
            __storage: Object.assign({}, this.__storage)
        };
    }
}
exports.W3oSession = W3oSession;
// propiedad estática que provee el separador que se usará para construir el ID de la sesión
W3oSession.ID_SEPARATOR = '--';
//# sourceMappingURL=W3oSession.js.map