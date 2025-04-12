"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oNetworkManager = void 0;
// w3o-core\src\classes\W3oNetworkManager.ts
const rxjs_1 = require("rxjs");
const _1 = require(".");
const logger = new _1.Logger('W3oNetworkManager');
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
            throw new _1.W3oError(_1.W3oError.NETWORK_NOT_FOUND, { name });
        }
        return this.getNetwork(name, _1.Logger.current);
    }
    // Getter para obtener la lista de redes
    get list() {
        return this.__networks;
    }
    // Método para inicializar el manejador de redes
    init(parent) {
        const context = logger.method('init', undefined, parent);
        if (this.__initialized) {
            throw new _1.W3oError(_1.W3oError.ALREADY_INITIALIZED, { name: 'W3oNetworkManager', message: 'Network manager already initialized' });
        }
        this.__initialized = true;
        context.log('Not implemented yet');
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
            throw new _1.W3oError(_1.W3oError.NETWORK_NOT_FOUND, { name });
        }
        return network;
    }
    // Método para establecer la red actual
    setCurrentNetwork(name, parent) {
        const context = logger.method('setCurrentNetwork', { name }, parent);
        const net = this.getNetwork(name, context);
        if (!net) {
            throw new _1.W3oError(_1.W3oError.NETWORK_NOT_FOUND, { name });
        }
        this.onNetworkChange$.next(name);
    }
    // Método para obtener la red actual
    getCurrentNetwork() {
        return this.current;
    }
    // Método para actualizar el estado de todas las redes
    // TODO: cambiar el tipo de retorno a Observable y hacer que los networks sean actualizados todos a las vez y no secuencialmente (remove this comment when implemented)
    updateState() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const network of this.__networks) {
                yield network.updateState(); // asumir que devuelve un observable
            }
        });
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