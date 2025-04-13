"use strict";
// w3o-core/src/classes/Web3Octopus.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Octopus = void 0;
const _1 = require(".");
const W3oAuthManager_1 = require("./W3oAuthManager");
const W3oService_1 = require("./W3oService");
const logger = new _1.Logger('Web3Octopus');
const defaultSettings = {
    multiSession: false,
    autoLogin: true,
};
// Main singleton class that acts as the entry point, includes methods to add network support, register modules, and initialize the state
class Web3Octopus {
    static get instance() {
        if (!Web3Octopus.__instance) {
            throw new _1.W3oError(_1.W3oError.OCTOPUS_INSTANCE_NOT_FOUND);
        }
        return Web3Octopus.__instance;
    }
    constructor(settings = defaultSettings, parent) {
        this.__initialized = false;
        this.__services = [];
        this.__serviceCtrl = null;
        this.__networkCtrl = null;
        this.__sessionCtrl = null;
        this.__authCtrl = null;
        this.__meduleCtrl = null;
        const context = logger.method('constructor', { settings }, parent);
        this.__authCtrl = new W3oAuthManager_1.W3oAuthManager(settings, context);
        this.__networkCtrl = new _1.W3oNetworkManager(settings, context);
        this.__sessionCtrl = new _1.W3oSessionManager(settings, context);
        this.__meduleCtrl = new _1.W3oModuleManager(settings, context);
        // set the instance to this object
        Web3Octopus.__instance = this;
    }
    // Getter to obtain the session manager
    get sessions() {
        if (!this.__sessionCtrl) {
            throw new _1.W3oError(_1.W3oError.SESSION_NOT_FOUND);
        }
        return this.__sessionCtrl;
    }
    // Getter to obtain the network manager
    get networks() {
        if (!this.__networkCtrl) {
            throw new _1.W3oError(_1.W3oError.NETWORK_MANAGER_NOT_CREATED);
        }
        return this.__networkCtrl;
    }
    // Getter to obtain the auth manager
    get auth() {
        if (!this.__authCtrl) {
            throw new _1.W3oError(_1.W3oError.AUTH_MANAGER_NOT_CREATED);
        }
        return this.__authCtrl;
    }
    // Getter to obtain the module manager
    get modules() {
        if (!this.__meduleCtrl) {
            throw new _1.W3oError(_1.W3oError.MODULE_MANAGER_NOT_CREATED);
        }
        return this.__meduleCtrl;
    }
    // Getter to obtain the services
    get services() {
        if (!this.__serviceCtrl) {
            throw new _1.W3oError(_1.W3oError.SERVICE_OBJECT_NOT_FOUND);
        }
        return this.__serviceCtrl;
    }
    // Method to add network support
    addNetworkSupport(support, parent) {
        const context = logger.method('addNetworkSupport', { support }, parent);
        if (this.__initialized) {
            throw new _1.W3oError(_1.W3oError.ALREADY_INITIALIZED, { name: 'Web3Octopus', message: 'Network support can only be added before initialization' });
        }
        // Add support for the network
        for (const network of support.networks) {
            this.networks.addNetwork(network, context);
        }
        // Add support for authentication for this type of network
        for (const auth of support.auth) {
            this.auth.addAuthSupport(auth, context);
        }
    }
    // Method to initialize the framework state
    init(parent) {
        const context = logger.method('init', parent);
        if (this.__initialized) {
            throw new _1.W3oError(_1.W3oError.ALREADY_INITIALIZED, { name: 'Web3Octopus', message: 'Web3Octopus can only be initialized once' });
        }
        this.__initialized = true;
        this.networks.init(context);
        this.sessions.init(context);
        this.__serviceCtrl = this.createService(context);
        context.log('Initialized successfully');
    }
    // Method to register services
    registerServices(services, parent) {
        logger.method('registerServices', { services }, parent);
        this.__services.push(...services);
    }
    // Method to create services
    createService(parent) {
        const context = logger.method('createService', undefined, parent);
        // Create the services object
        const servicesObject = {};
        for (const service of this.__services) {
            context.log('processing service', service.path);
            const path = service.path.split('.');
            let currentLevel = servicesObject;
            for (let i = 0; i < path.length; i++) {
                const part = path[i];
                if (i === path.length - 1) {
                    currentLevel[part] = service;
                }
                else {
                    if (!currentLevel[part]) {
                        currentLevel[part] = {};
                    }
                    currentLevel = currentLevel[part];
                }
            }
        }
        // Add the snapshot method to the services object
        servicesObject.snapshot = () => {
            const snapshot = {};
            const createSnapshot = (src, dest) => {
                for (const key in src) {
                    if (src[key] instanceof W3oService_1.W3oService) {
                        dest[key] = src[key].snapshot();
                    }
                    else if (typeof src[key] === 'object' && src[key] !== null) {
                        dest[key] = {};
                        createSnapshot(src[key], dest[key]);
                    }
                }
            };
            createSnapshot(servicesObject, snapshot);
            return snapshot;
        };
        context.log('services created successfully', { services: servicesObject });
        return servicesObject;
    }
    // Method to take a snapshot of the framework state
    snapshot() {
        if (!this.__initialized) {
            throw new _1.W3oError(_1.W3oError.NOT_INITIALIZED, { message: 'snapshots can only be taken after initialization' });
        }
        return {
            auth: this.auth.snapshot(),
            networks: this.networks.snapshot(),
            sessions: this.sessions.snapshot(),
            services: this.services.snapshot(),
        };
    }
}
exports.Web3Octopus = Web3Octopus;
// static getter para obtener la instancia de Octopus casteada a la interfaz W3oInstance
Web3Octopus.__instance = null;
//# sourceMappingURL=Web3Octopus.js.map