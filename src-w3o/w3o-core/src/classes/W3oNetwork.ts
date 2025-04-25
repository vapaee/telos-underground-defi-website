import { BehaviorSubject, Observable } from 'rxjs';

import {
    W3oInstance,
    W3oNetworkSettings,
    W3oNetworkType,
} from '../types';

import { Logger, LoggerContext } from './Logger';
import { W3oModule } from './W3oModule';
import { W3oContractManager } from './W3oContractManager';
import { W3oToken } from './W3oToken';

const logger = new Logger('W3oNetwork');

// Clase abstracta que representa una red específica, incluyendo métodos para obtener información sobre la red y sus contratos
export abstract class W3oNetwork extends W3oModule {
    private __contractCtrl: W3oContractManager;
    private __tokens$ = new BehaviorSubject<W3oToken[]>([]);

    constructor(
        public readonly settings: W3oNetworkSettings,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', {settings}, parent);
        super(context);
        this.__contractCtrl = this.createContractManager(this, context);
    }

    // Getter para obtener el tipo de red
    get type(): W3oNetworkType {
        return this.settings.type;
    }

    // Getter para obtener el nombre de la red
    get name(): string {
        return this.settings.name;
    }

    // Getter para obtener un observable con los tokens de la red
    get tokens$(): Observable<W3oToken[]> {
        return this.__tokens$.asObservable();
    }

    // Getter para obtener la lista de tokens de la red
    get tokens(): W3oToken[] {
        return this.__tokens$.getValue();
    }

    override init(octopus: W3oInstance, requirements: W3oModule[], parent: LoggerContext): void {
        const context = logger.method('init', { w3oId: this.w3oId, octopus, requirements }, parent);
        this.fetchTokens(context).subscribe(tokens => {
            context.info('Tokens fetched', { tokens });
            this.__tokens$.next(tokens);
            super.init(octopus, requirements, context);
        });
    }

    fetchTokens(parent: LoggerContext): Observable<W3oToken[]> {
        const context = logger.method('fetchTokens', { w3oId: this.w3oId }, parent);
        return new Observable<W3oToken[]>(subscriber => {
            fetch(this.settings.tokensUrl)
                .then(response => response.json())
                .then((tokens: W3oToken[]) => {
                    context.info('Tokens fetched', { w3oId: this.w3oId, tokens });
                    this.__tokens$.next(tokens);
                    subscriber.next(tokens);
                    subscriber.complete();
                })
                .catch(error => {
                    context.error('Error fetching tokens', { error });
                    subscriber.error(error);
                });
        });
    }

    // Método abstracto para obtener el tipo de red
    getNetworkType(): W3oNetworkType {
        return this.type;
    }

    // Método para obtener un token a partir de su dirección o symbolo
    getToken(token: string, parent: LoggerContext): W3oToken | null {
        logger.method('getToken', {token}, parent);
        return this.tokens.find(t => t.symbol === token || t.address === token) || null;
    }

    // Método para obtener el manejador de contratos de la red
    getContractManager(): W3oContractManager {
        return this.__contractCtrl;
    }

    // Método abstracto para crear el contract manager específico de la red
    abstract createContractManager(network: W3oNetwork, parent: LoggerContext): W3oContractManager;

    // Método abstracto para obtener el token del sistema de la red
    abstract getSystemToken(): W3oToken;

    // Método abstracto para actualizar el estado de la red
    abstract updateState(): Observable<void>;

    // Método abstracto para realizar una consulta a un contrato específico o a la read
    abstract queryContract(params: { [key: string]: any }): Observable<any>;

    // Método abstracto para validar si un account existe en la red
    validateAccount(address: string, parent: LoggerContext): Observable<boolean> {
        logger.method('validateAccount', {address}, parent);
        return new Observable<boolean>(subscriber => {
            subscriber.next(true); // Simulate a successful validation (Ethereum, Solana, etc.)
            subscriber.complete();
        });
    }

}
