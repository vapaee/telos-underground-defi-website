"use strict";
// w3o-core/src/classes/W3oContractManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oAuthManager = void 0;
const rxjs_1 = require("rxjs");
const _1 = require(".");
const logger = new _1.Logger('W3oAuthManager');
// Represents a contract manager, including methods to add, get, and list contracts
class W3oAuthManager {
    constructor(settings, parent) {
        this.__initialized = false;
        this.__byType = {};
        this.__byName = {};
        logger.method('constructor', { settings }, parent);
    }
    // Method to initialize the auth manager
    init(parent) {
        const context = logger.method('init', undefined, parent);
        if (this.__initialized) {
            throw new _1.W3oError(_1.W3oError.ALREADY_INITIALIZED, { name: 'W3oAuthManager', message: 'Auth manager already initialized' });
        }
        this.__initialized = true;
        context.error('Not implemented yet');
    }
    // Method to add an authenticator to the manager
    addAuthSupport(auth, parent) {
        logger.method('add', { auth }, parent);
        this.__byName[auth.name] = auth;
        if (!this.__byType[auth.type]) {
            this.__byType[auth.type] = [];
        }
        this.__byType[auth.type].push(auth);
    }
    // Method to get an authenticator by name
    get(name) {
        return this.__byName[name];
    }
    // Method to get a list of authenticators by type
    list(type) {
        return this.__byType[type];
    }
    // Method to create an authenticator from its name
    createAuthenticator(name, parent) {
        logger.method('createAuthenticator', { name }, parent);
        const auth = this.get(name);
        if (!auth) {
            throw new _1.W3oError(_1.W3oError.AUTH_SUPPORT_NOT_FOUND, { name });
        }
        return auth.createAuthenticator(parent);
    }
    // Main method to authenticate a user from a service
    login(network, authName, parent) {
        const context = logger.method('login', { network, authName }, parent);
        const auth = this.get(authName);
        if (!auth) {
            throw new _1.W3oError(_1.W3oError.AUTH_SUPPORT_NOT_FOUND, { authName });
        }
        const obs = new rxjs_1.Observable(subscriber => {
            try {
                // 1. Get the network instance
                const networkInstance = _1.Web3Octopus.instance.networks.getNetwork(network, context);
                // 2. Create an authenticator
                const authenticator = auth.createAuthenticator(context);
                // 3. Call authenticator.login to get an account
                authenticator.login(network, context).subscribe({
                    next: account => {
                        // 4. Create a new session
                        const session = _1.Web3Octopus.instance.sessions.createCurrentSession(account.getAddress(), authenticator, networkInstance, context);
                        // 5. Notify the subscriber of the created session
                        subscriber.next(session);
                        subscriber.complete();
                    },
                    error: err => {
                        subscriber.error(err);
                    }
                });
            }
            catch (error) {
                subscriber.error(error);
            }
        });
        return obs;
    }
    // Method to take a snapshot of the auth manager state
    snapshot() {
        const snapshot = {
            byType: Object.assign({}, this.__byType),
            byName: [],
        };
        for (const type in snapshot.byType) {
            snapshot.byType[type] = snapshot.byType[type].map(auth => auth.snapshot());
        }
        snapshot.byName.push(...Object.keys(this.__byName));
        return snapshot;
    }
}
exports.W3oAuthManager = W3oAuthManager;
//# sourceMappingURL=W3oAuthManager.js.map