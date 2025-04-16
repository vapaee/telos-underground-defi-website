"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntelopeAuthSupport = void 0;
const w3o_core_1 = require("@vapaee/w3o-core");
const rxjs_1 = require("rxjs");
const logger = new w3o_core_1.Logger('AntelopeAuthSupport');
class AntelopeAuthSupport extends w3o_core_1.W3oAuthSupport {
    constructor(name, parent) {
        const context = logger.method('constructor', undefined, parent);
        super(name, 'antelope', context);
    }
    // Abstract methods from W3oAuthSupport
    createAuthenticator(parent) {
        const context = logger.method('createAuthenticator', undefined, parent);
        context.error('NOT IMPLEMENTED');
        return new w3o_core_1.W3oAuthenticator(this, context);
    }
    // Method to check if the authenticator is read-only
    isReadOnly() {
        const context = logger.method('isReadOnly', undefined);
        context.error('isReadOnly() NOT IMPLEMENTED');
        return false;
    }
    // Method to sign a transaction
    signTransaction(trx, parent) {
        const context = logger.method('signTransaction', { trx, parent });
        context.error('signTransaction() NOT IMPLEMENTED');
        return new rxjs_1.Observable();
    }
    // Method to log in to a specific network
    login(network, parent) {
        const context = logger.method('login', { network, parent });
        context.error('login() NOT IMPLEMENTED');
        return new rxjs_1.Observable();
    }
    // Method to automatically log in to a specific network
    autoLogin(network, address, parent) {
        const context = logger.method('autoLogin', { network, address, parent });
        context.error('autoLogin() NOT IMPLEMENTED');
        return new rxjs_1.Observable();
    }
    // Method to log out
    logout(parent) {
        const context = logger.method('logout', { parent });
        context.error('logout() NOT IMPLEMENTED');
    }
}
exports.AntelopeAuthSupport = AntelopeAuthSupport;
//# sourceMappingURL=AntelopeAuthSupport.js.map