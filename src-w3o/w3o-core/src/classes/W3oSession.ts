import { Observable, Subject } from 'rxjs';
import { W3oAddress, W3oSessionInstance } from '../types';

import { Logger, LoggerContext } from './Logger';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oNetwork } from './W3oNetwork';

const logger = new Logger('W3oSession');

// Representa una sesión, incluyendo métodos para obtener la cuenta y la red asociadas, almacenar y recuperar datos, y obtener un snapshot del estado interno
export class W3oSession {

    // propiedad estática que provee el separador que se usará para construir el ID de la sesión
    public static readonly ID_SEPARATOR = '--';

    // storage for user custom properties for the session
    // private __storage: {[key in string]: any} = {};
    // identifier for the session
    private __id: string = '';
    onLogout$: Subject<any> = new Subject<any>();

    constructor(
        public readonly manager: W3oSessionInstance,
        public readonly address: W3oAddress,
        public readonly authenticator: W3oAuthenticator,
        public readonly network: W3oNetwork,
        parent: LoggerContext,
    ) {
        logger.method('constructor', {address, authenticator, network}, parent);
        this.__id = `${address}${W3oSession.ID_SEPARATOR}${authenticator.name}${W3oSession.ID_SEPARATOR}${network.name}`;
    }

    // Getter para obtener el ID de la sesión
    get id(): string {
        return this.__id;
    }

    logout(parent: LoggerContext) {
        const context = logger.method('logout', undefined, parent);
        this.authenticator.logout(context);
        this.manager.deleteSession(this.id, context);
        // emit logout event
        this.onLogout$.next(null);
        this.onLogout$.complete();
    }

    // Método para tomar una instantánea del estado de la sesión
    snapshot(): any {
        return {
            authenticator: this.authenticator.snapshot(),
            network: this.network.snapshot(),
        };
    }
}
