"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oNetworkManager = void 0;
// w3o-core\src\classes\W3oNetworkManager.ts
const rxjs_1 = require("rxjs");
const Logger_1 = require("./Logger");
const W3oError_1 = require("./W3oError");
const logger = new Logger_1.Logger('W3oNetworkManager');
// Representa un manejador de redes, incluyendo métodos para registrar, obtener y listar redes, y actualizar el estado
class W3oNetworkManager {
    constructor(settings, parent) {
        this.__initialized = false;
        this.__networks = [];
        this.onNetworkChange$ = new rxjs_1.BehaviorSubject(null);
        logger.method('constructor', { settings }, parent);
    }
    // Getter para obtener el nombre de la red actual
    get currentNetworkName() {
        return this.onNetworkChange$.value;
    }
    // Getter para obtener la red actual
    get current() {
        const name = this.currentNetworkName;
        if (!name) {
            throw new W3oError_1.W3oError(W3oError_1.W3oError.NETWORK_NOT_FOUND, { name });
        }
        return this.getNetwork(name, Logger_1.Logger.current);
    }
    // Getter para obtener la lista de redes
    get list() {
        return this.__networks;
    }
    // Método para inicializar el manejador de redes
    init(parent) {
        const context = logger.method('init', undefined, parent);
        if (this.__initialized) {
            throw new W3oError_1.W3oError(W3oError_1.W3oError.ALREADY_INITIALIZED, { name: 'W3oNetworkManager', message: 'Network manager already initialized' });
        }
        this.__initialized = true;
        context.log('W3onetworkManager.init() Not implemented yet');
    }
    // Método para registrar una red
    addNetwork(network, parent) {
        logger.method('addNetwork', { network }, parent);
        this.__networks.push(network);
    }
    // Método para obtener una red por su nombre
    getNetwork(name, parent) {
        logger.method('getNetwork', { name }, parent);
        const network = this.__networks.find(network => network.settings.name === name);
        if (!network) {
            throw new W3oError_1.W3oError(W3oError_1.W3oError.NETWORK_NOT_FOUND, { name });
        }
        return network;
    }
    // Método para establecer la red actual
    setCurrentNetwork(name, parent) {
        const context = logger.method('setCurrentNetwork', { name }, parent);
        const net = this.getNetwork(name, context);
        if (!net) {
            throw new W3oError_1.W3oError(W3oError_1.W3oError.NETWORK_NOT_FOUND, { name });
        }
        this.onNetworkChange$.next(name);
    }
    // Método para obtener la red actual
    getCurrentNetwork() {
        return this.current;
    }
    // Método para actualizar el estado de todas las redes
    // TODO: cambiar el tipo de retorno a Observable y hacer que los networks sean actualizados todos a las vez y no secuencialmente (remove this comment when implemented)
    async updateState() {
        for (const network of this.__networks) {
            await network.updateState(); // asumir que devuelve un observable
        }
    }
    // Método para tomar una instantánea del estado del manejador de redes
    snapshot() {
        return {
            networks: this.__networks.map(network => network.snapshot()),
            currentNetwork: this.getCurrentNetwork().snapshot(),
        };
    }
}
exports.W3oNetworkManager = W3oNetworkManager;
//# sourceMappingURL=W3oNetworkManager.js.map