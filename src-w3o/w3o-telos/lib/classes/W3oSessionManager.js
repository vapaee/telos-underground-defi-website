"use strict";
// w3o-core\src\classes\W3oSessionManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oSessionManager = void 0;
const rxjs_1 = require("rxjs");
const _1 = require(".");
const logger = new _1.Logger('W3oSessionManager');
const STORAGE_KEY = 'w3o-sessions';
class W3oSessionManager {
    constructor(settings, parent) {
        this.__initialized = false;
        this.__sessions = {};
        this.__autologin = false;
        this.onSessionChange$ = new rxjs_1.BehaviorSubject(null);
        const context = logger.method('constructor', { settings }, parent);
        this.__multiSession = settings.multiSession;
        this.__autologin = settings.autoLogin;
        _1.Web3Octopus.instance.networks.onNetworkChange$.subscribe(() => {
            this.onSessionChange$.next(null);
        });
        this.onSessionChange$.subscribe(() => {
            context.log('session change detected');
            this.saveSessions(context);
        });
    }
    // Getter para obtener el ID de la sesión actual
    get currentSessionId() {
        return this.onSessionChange$.value;
    }
    // Getter para obtener la sesión actual
    get current() {
        const id = this.currentSessionId;
        if (!id) {
            throw new _1.W3oError(_1.W3oError.SESSION_NOT_FOUND, { id });
        }
        return this.__sessions[id];
    }
    // Getter para obtener la lista de sesiones
    get list() {
        return Object.values(this.__sessions);
    }
    // Getter para obtener si se permite multi-sesión
    get isMultiSession() {
        return this.__multiSession;
    }
    // Método para inicializar el manejador de sesiones
    init(parent) {
        const context = logger.method('init', undefined, parent);
        if (this.__initialized) {
            throw new _1.W3oError(_1.W3oError.ALREADY_INITIALIZED, { name: 'W3oSessionManager', message: 'Session manager already initialized' });
        }
        this.__initialized = true;
        this.loadSessions(context);
    }
    // Método para crear una sesión
    createSession(address, authenticator, network, parent) {
        const context = logger.method('createSession', { address, authenticator, network }, parent);
        const session = new _1.W3oSession(address, authenticator, network, context);
        // verificamos que la sessión no exista y la agregamos
        if (this.__sessions[session.id]) {
            throw new _1.W3oError(_1.W3oError.SESSION_ALREADY_EXISTS, { id: session.id });
        }
        this.__sessions[session.id] = session;
        authenticator.setSessionId(session.id, context);
        return session;
    }
    // Método para crear una sesión y setearla como la sesión actual
    createCurrentSession(address, authenticator, network, parent) {
        const context = logger.method('createCurrentSession', { address, authenticator, network }, parent);
        const session = this.createSession(address, authenticator, network, context);
        // verificamos que la sessión no exista
        if (this.__sessions[session.id]) {
            throw new _1.W3oError(_1.W3oError.SESSION_ALREADY_EXISTS, { id: session.id, message: 'use setCurrentSession(id) instead' });
        }
        this.setCurrentSession(session.id, parent);
        return session;
    }
    // Método para obtener una sesión por su ID
    getSession(id, parent) {
        logger.method('getSession', { id }, parent);
        const session = this.__sessions[id];
        if (!session) {
            throw new _1.W3oError(_1.W3oError.SESSION_NOT_FOUND, { id });
        }
        return session;
    }
    // Método para obtener todas las sesiones
    getSessions(parent) {
        logger.method('getSessions', undefined, parent);
        return this.list;
    }
    // Método para eliminar una sesión por su ID
    deleteSession(id, parent) {
        logger.method('deleteSession', { id }, parent);
        if (!this.__sessions[id]) {
            throw new _1.W3oError(_1.W3oError.SESSION_NOT_FOUND, { id });
        }
        delete this.__sessions[id];
        this.onSessionChange$.next(null);
    }
    // Método para establecer la sesión actual
    setCurrentSession(id, parent) {
        logger.method('setCurrentSession', { id }, parent);
        if (!this.__sessions[id]) {
            throw new _1.W3oError(_1.W3oError.SESSION_NOT_FOUND, { id });
        }
        this.onSessionChange$.next(id);
    }
    // Método para obtener la sesión actual
    getCurrentSession(parent) {
        logger.method('getCurrentSession', undefined, parent);
        return this.current;
    }
    // Método para salvar en local storage la información de las sessiones abiertas y cual es la actual
    saveSessions(parent) {
        logger.method('saveSessions', undefined, parent);
        const stored = {
            currentSessionId: this.currentSessionId,
            sessions: Object.keys(this.__sessions),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
    // Método para cargar desde local storage la información de las sessiones abiertas y cual es la actual
    loadSessions(parent) {
        const context = logger.method('loadSessions', undefined, parent);
        // primero verificamos que no haya sesiones abiertas
        if (this.list.length > 0) {
            throw new _1.W3oError(_1.W3oError.SESSION_ALREADY_EXISTS, { id: this.currentSessionId, message: 'close all sessions before loading' });
        }
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                context.log('sessions found in local storage');
                const data = JSON.parse(stored);
                const separator = _1.W3oSession.ID_SEPARATOR;
                for (const id of data.sessions) {
                    const [address, authName, netwokName] = id.split(separator);
                    const network = _1.Web3Octopus.instance.networks.getNetwork(netwokName, context);
                    const authenticator = _1.Web3Octopus.instance.auth.createAuthenticator(authName, context);
                    this.createSession(address, authenticator, network, context);
                }
                if (this.__autologin && data.currentSessionId) {
                    const session = this.__sessions[data.currentSessionId];
                    if (!session) {
                        throw new _1.W3oError(_1.W3oError.SESSION_NOT_FOUND, {
                            id: data.currentSessionId,
                            message: 'could not perform autologin'
                        });
                    }
                    session.authenticator.autoLogin(session.network.settings.name, session.address, context).subscribe(() => {
                        this.setCurrentSession(session.id, context);
                    });
                }
            }
            else {
                context.log('no sessions found in local storage');
            }
        }
        catch (e) {
            throw new _1.W3oError(_1.W3oError.SESSION_LOAD_ERROR, { message: e.message });
        }
    }
    // Método para tomar una instantánea del estado del manejador de sesiones
    snapshot() {
        return {
            currentSessionId: this.currentSessionId,
            sessions: Object.keys(this.__sessions),
        };
    }
}
exports.W3oSessionManager = W3oSessionManager;
//# sourceMappingURL=W3oSessionManager.js.map