// w3o-core/src/classes/W3oNetwork.ts

import { BehaviorSubject, Observable } from 'rxjs';

import {
    W3oInstance,
    W3oNetworkName,
    W3oNetworkSettings,
    W3oNetworkType,
} from '../types';

import { W3oContextFactory, W3oContext } from './W3oContext';
import { W3oModule } from './W3oModule';
import { W3oContractManager } from './W3oContractManager';
import { W3oToken } from './W3oToken';
import { W3oSession } from './W3oSession';

const logger = new W3oContextFactory('W3oNetwork');

// Clase abstracta que representa una red específica, incluyendo métodos para obtener información sobre la red y sus contratos
export abstract class W3oNetwork extends W3oModule {
    transact(arg0: W3oSession, transaction: any, context: W3oContext) {
        throw new Error('Method not implemented.');
    }
    private __contractCtrl: W3oContractManager;
    private __tokens$ = new BehaviorSubject<W3oToken[]>([]);

    constructor(
        public readonly settings: W3oNetworkSettings,
        parent: W3oContext
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
    get name(): W3oNetworkName {
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

    override init(octopus: W3oInstance, requirements: W3oModule[], parent: W3oContext): void {
        const context = logger.method('init', { w3oId: this.w3oId, octopus, requirements }, parent);
        this.fetchTokens(context).subscribe(tokens => {
            logger.info('Tokens fetched', { tokens });
            this.__tokens$.next(tokens);
            super.init(octopus, requirements, context);
        });
    }

    fetchTokens(parent: W3oContext): Observable<W3oToken[]> {
        const context = logger.method('fetchTokens', { w3oId: this.w3oId }, parent);
        return new Observable<W3oToken[]>(subscriber => {
            fetch(this.settings.tokensUrl)
                .then(response => response.json())
                .then((tokens: W3oToken[]) => {
                    logger.info('Tokens fetched', { w3oId: this.w3oId, tokens });
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
    getToken(token: string, parent: W3oContext): W3oToken | null {
        logger.method('getToken', {token}, parent);
        return this.tokens.find(t => t.symbol === token || t.address === token) || null;
    }

    // Método para obtener el manejador de contratos de la red
    getContractManager(): W3oContractManager {
        return this.__contractCtrl;
    }

    // Método abstracto para crear el contract manager específico de la red
    abstract createContractManager(network: W3oNetwork, parent: W3oContext): W3oContractManager;

    // Método abstracto para obtener el token del sistema de la red
    abstract getSystemToken(): W3oToken;

    // Método abstracto para actualizar el estado de la red
    abstract updateState(): Observable<void>;

    // Método abstracto para realizar una consulta a un contrato específico o a la read
    abstract queryContract(params: { [key: string]: any }): Observable<any>;

    // Método abstracto para validar si un account existe en la red
    validateAccount(address: string, parent: W3oContext): Observable<boolean> {
        logger.method('validateAccount', {address}, parent);
        return new Observable<boolean>(subscriber => {
            subscriber.next(true); // Simulate a successful validation (Ethereum, Solana, etc.)
            subscriber.complete();
        });
    }

}
