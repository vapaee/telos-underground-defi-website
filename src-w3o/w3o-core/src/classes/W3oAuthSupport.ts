
import { Observable } from 'rxjs';
import {
    W3oAddress,
    W3oAuthSupportName,
    W3oNetworkName,
    W3oNetworkType,
    W3oInstance,
    W3oTransaction
} from '../types';
import { Logger, LoggerContext } from './Logger';
import { W3oModule } from './W3oModule';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oTransactionResponse } from './W3oTransactionResponse';
import { W3oAccount } from './W3oAccount';
import { W3oNetwork } from './W3oNetwork';

const logger = new Logger('W3oAuthSupport');

// Clase abstracta que representa un autenticador de usuario
export abstract class W3oAuthSupport extends W3oModule {
    constructor(
        public readonly name: W3oAuthSupportName,
        public readonly type: W3oNetworkType,
        parent: LoggerContext,
    ) {
        const context = logger.method('constructor', { name, type }, parent);
        super(context);
    }

    // Método para crear un autenticador
    createAuthenticator(network: W3oNetwork, parent: LoggerContext): W3oAuthenticator {
        const context = logger.method('createAuthenticator', {network}, parent);
        return new W3oAuthenticator(this, network, context);
    }

    // Método abstracto para verificar si el autenticador es de solo lectura
    abstract isReadOnly(): boolean;

    // Método abstracto para firmar una transacción
    abstract signTransaction(auth: W3oAuthenticator, trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse>;

    // Método abstracto para iniciar sesión en una red específica
    abstract login(auth: W3oAuthenticator, network: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount>;

    // Método abstracto para iniciar sesión automáticamente en una red específica
    abstract autoLogin(auth: W3oAuthenticator, network: W3oNetworkName, address: W3oAddress, parent: LoggerContext): Observable<W3oAccount>;

    // Método abstracto para cerrar sesión
    abstract logout(auth: W3oAuthenticator, parent: LoggerContext): void;

}
