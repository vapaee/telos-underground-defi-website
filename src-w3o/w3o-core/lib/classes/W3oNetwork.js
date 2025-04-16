"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oNetwork = void 0;
const Logger_1 = require("./Logger");
const W3oModule_1 = require("./W3oModule");
const logger = new Logger_1.Logger('W3oNetwork');
// Clase abstracta que representa una red específica, incluyendo métodos para obtener información sobre la red y sus contratos
class W3oNetwork extends W3oModule_1.W3oModule {
    constructor(settings, parent) {
        const context = logger.method('constructor', { settings }, parent);
        super(context);
        this.settings = settings;
        this.__contractCtrl = this.createContractManager(this, context);
    }
    // Getter para obtener el tipo de red
    get type() {
        return this.settings.type;
    }
    // Getter para obtener el nombre de la red
    get name() {
        return this.settings.name;
    }
    // Método abstracto para obtener el tipo de red
    getNetworkType() {
        return this.type;
    }
    // Método para obtener un token a partir de su dirección o symbolo
    getToken(token, parent) {
        logger.method('getToken', { token }, parent);
        return this.getTokensList().find(t => t.symbol === token || t.address === token) || null;
    }
    // Método para obtener el manejador de contratos de la red
    getContractManager() {
        return this.__contractCtrl;
    }
}
exports.W3oNetwork = W3oNetwork;
//# sourceMappingURL=W3oNetwork.js.map