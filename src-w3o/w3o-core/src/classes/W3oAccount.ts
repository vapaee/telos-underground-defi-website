import { Logger, LoggerContext } from './Logger';
import { W3oAuthenticator } from './W3oAuthenticator';

const logger = new Logger('W3oAccount');

// Representa una cuenta de usuario, incluyendo datos mínimos y una referencia a su autenticador
export abstract class W3oAccount {
    constructor(
        public readonly address: string,
        public readonly authenticator: W3oAuthenticator,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', { authenticator }, parent);
        authenticator.onSessionChange$.subscribe((id) => {
            context.log('session change detected', { id });
        });
    }

    // Método abstracto para obtener la dirección de la cuenta
    getAddress(): string {
        return this.address;
    }

    // Método abstracto para tomar una instantánea del estado de la cuenta
    abstract snapshot(): any;
}
