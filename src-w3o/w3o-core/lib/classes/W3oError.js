"use strict";
// w3o-core/src/classes/W3oError.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oError = void 0;
// Represents a specific error within Web3 Octopus
class W3oError extends Error {
    constructor(error, payload) {
        super(error.message);
        this.code = error.code;
        this.payload = payload;
        this.name = 'W3oError';
    }
}
exports.W3oError = W3oError;
// List of error codes
W3oError.NETWORK_NOT_FOUND = { message: 'Network not found', code: 1000 };
W3oError.SESSION_NOT_FOUND = { message: 'Session not found', code: 1001 };
W3oError.NETWORK_MANAGER_NOT_CREATED = { message: 'Network manager was not created', code: 1002 };
W3oError.SESSION_MANAGER_NOT_CREATED = { message: 'Session manager was not created', code: 1003 };
W3oError.SERVICE_OBJECT_NOT_FOUND = { message: 'Service object wa not created', code: 1004 };
W3oError.SESSION_NOT_EDITABLE = { message: 'Session is not editable', code: 1005 };
W3oError.SESSION_WITHOUT_ACCOUNT = { message: 'Session without account', code: 1006 };
W3oError.SESSION_WITHOUT_NETWORK = { message: 'Session without network', code: 1007 };
W3oError.SESSION_NOT_MULTIPLE = { message: 'You are not working with multiple sessions', code: 1008 };
W3oError.ALREADY_INITIALIZED = { message: 'Already initialized', code: 1009 };
W3oError.MODULE_REQUIREMENTS_NOT_MET = { message: 'Module requirements not met', code: 1010 };
W3oError.AUTH_MANAGER_NOT_CREATED = { message: 'Auth manager was not created', code: 1011 };
W3oError.NOT_INITIALIZED = { message: 'Not initialized', code: 1012 };
W3oError.ACCOUNT_NOT_LOGGED = { message: 'Account not logged', code: 1013 };
W3oError.AUTH_SUPPORT_NOT_FOUND = { message: 'Auth support not found', code: 1014 };
W3oError.OCTOPUS_INSTANCE_NOT_FOUND = { message: 'Octopus instance not found', code: 1015 };
W3oError.MODULE_MANAGER_NOT_CREATED = { message: 'Module manager was not created', code: 1016 };
W3oError.SESSION_ALREADY_EXISTS = { message: 'Session already exists', code: 1017 };
W3oError.SESSION_LOAD_ERROR = { message: 'Session load error', code: 1018 };
W3oError.SESSION_ALREADY_SET = { message: 'Session already set', code: 1019 };
const e = new W3oError(W3oError.NETWORK_NOT_FOUND);
console.log(e.message);
//# sourceMappingURL=W3oError.js.map