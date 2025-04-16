"use strict";
// w3o-core/src/classes/W3oAuthenticator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oAuthenticator = void 0;
const rxjs_1 = require("rxjs");
const _1 = require(".");
const logger = new _1.Logger('W3oAuthenticator');
class W3oAuthenticator {
    constructor(support, parent) {
        this.support = support;
        this.__account = null;
        this.__sessionId = '';
        logger.method('constructor', { support }, parent);
    }
    // Getter to obtain the user's account (throws an exception if not authenticated)
    get account() {
        if (!this.__account) {
            throw new _1.W3oError(_1.W3oError.ACCOUNT_NOT_LOGGED, { authenticator: this });
        }
        return this.__account;
    }
    // Getter to obtain the authenticator's name from its support
    get name() {
        return this.support.name;
    }
    // Getter to obtain the authenticator's type from its support
    get type() {
        return this.support.type;
    }
    // Getter to obtain the session ID
    get sessionId() {
        return this.__sessionId;
    }
    // Method to set the session ID (throws exception if the session is already set)
    setSessionId(sessionId, parent) {
        logger.method('setSessionId', { sessionId }, parent);
        if (this.__sessionId !== '') {
            throw new _1.W3oError(_1.W3oError.SESSION_ALREADY_SET, { authenticator: this, sessionId });
        }
        this.__sessionId = sessionId;
    }
    // Method to check if the user is authenticated
    isLogged() {
        return this.account !== null;
    }
    // Method to obtain the user's address
    getAddress() {
        return this.account.getAddress();
    }
    // Method to obtain the user's account or null if not authenticated
    getAccount() {
        return this.__account;
    }
    // Method to check if the authenticator is read-only
    isReadOnly() {
        return this.support.isReadOnly();
    }
    // Method to sign a transaction
    signTransaction(trx, parent) {
        const context = logger.method('signTransaction', { trx }, parent);
        return new rxjs_1.Observable(subscriber => {
            try {
                const response = this.support.signTransaction(trx, context);
                response.subscribe({
                    next: (res) => subscriber.next(res),
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
            }
            catch (error) {
                context.error(error.message);
                subscriber.error(error);
            }
        });
    }
    // Method to log in to a specific network
    login(network, parent) {
        const context = logger.method('login', { network }, parent);
        return new rxjs_1.Observable(subscriber => {
            try {
                const accountObservable = this.support.login(network, context);
                accountObservable.subscribe({
                    next: (account) => {
                        this.__account = account;
                        subscriber.next(account);
                    },
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
            }
            catch (error) {
                context.error(error.message);
                subscriber.error(error);
            }
        });
    }
    // Method to automatically log in to a specific network
    autoLogin(network, address, parent) {
        const context = logger.method('autoLogin', { network, address }, parent);
        return new rxjs_1.Observable(subscriber => {
            try {
                const accountObservable = this.support.autoLogin(network, address, context);
                accountObservable.subscribe({
                    next: (account) => {
                        this.__account = account;
                        subscriber.next(account);
                    },
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
            }
            catch (error) {
                context.error(error.message);
                subscriber.error(error);
            }
        });
    }
    // Method to log out
    logout(parent) {
        const context = logger.method('logout', undefined, parent);
        try {
            this.support.logout(context);
            this.__account = null;
            _1.Web3Octopus.instance.sessions.deleteSession(this.sessionId, context);
            this.__sessionId = '';
        }
        catch (error) {
            context.error(error.message);
        }
    }
    // Method to take a snapshot of the authenticator's state
    snapshot() {
        return {
            account: this.__account ? this.__account.snapshot() : null,
            support: this.support.snapshot(),
        };
    }
}
exports.W3oAuthenticator = W3oAuthenticator;
//# sourceMappingURL=W3oAuthenticator.js.map