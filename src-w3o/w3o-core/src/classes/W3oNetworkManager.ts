// w3o-core/src/classes/W3oNetworkManager.ts

import { BehaviorSubject } from 'rxjs';

import {
    W3oGlobalSettings,
    W3oNetworkInstance,
    W3oNetworkName,
    W3oInstance,
} from '../types';

import { W3oContextFactory, W3oContext } from './W3oContext';
import { W3oNetwork } from './W3oNetwork';
import { W3oError } from './W3oError';
import { W3oManager } from './W3oManager';

const logger = new W3oContextFactory('W3oNetworkManager');

// Representa un manejador de redes, incluyendo métodos para registrar, obtener y listar redes, y actualizar el estado
export class W3oNetworkManager extends W3oManager implements W3oNetworkInstance {
    private __networks: W3oNetwork[] = [];

    public onNetworkChange$: BehaviorSubject<W3oNetworkName | null> = new BehaviorSubject<string | null>(null);

    octopus!: W3oInstance;

    constructor(
        settings: W3oGlobalSettings,
        parent: W3oContext
    ) {
        logger.method('constructor', {settings}, parent);
        super('W3oNetworkManager');
    }

    // Getter para obtener el nombre de la red actual
    get currentNetworkName(): string | null {
        return this.onNetworkChange$.value;
    }

    // Getter para obtener la red actual
    get current(): W3oNetwork {
        const name = this.currentNetworkName;
        if (!name) {
            throw new W3oError(W3oError.NETWORK_NOT_FOUND, { name, snapshot: this.snapshot() });
        }
        return this.getNetwork(name, W3oContextFactory.current!);
    }

    // Getter para obtener la lista de redes
    get list(): W3oNetwork[] {
        return this.__networks;
    }

    // Método para inicializar el manejador de redes
    init(
        octopus: W3oInstance,
        parent: W3oContext
    ): void {
        const context = logger.method('init', { octopus }, parent);
        this.octopus = octopus;
        if (this.__initCalled) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'W3oNetworkManager', message: 'Network manager already initialized' });
        }
        this.__initCalled = true;
        this.__initialized$.next(true);
    }

    // Método para registrar una red
    addNetwork(network: W3oNetwork, parent: W3oContext): void {
        logger.method('addNetwork', { network }, parent);
        if (this.__initCalled) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'W3oNetworkManager', message: 'Network manager already initialized' });
        }
        this.__networks.push(network);
    }

    // Método para obtener una red por su nombre
    getNetwork(name: W3oNetworkName, parent: W3oContext): W3oNetwork {
        logger.method('getNetwork', { name }, parent);
        const network = this.__networks.find(network => network.settings.name === name);
        if (!network) {
            throw new W3oError(W3oError.NETWORK_NOT_FOUND, { name, snapshot: this.snapshot() });
        }
        return network;
    }

    // Método para establecer la red actual
    setCurrentNetwork(name: W3oNetworkName, parent: W3oContext): void {
        const context = logger.method('setCurrentNetwork', { name }, parent);
        const net =  this.getNetwork(name, context) as W3oNetwork;
        if (!net) {
            context.error
            throw new W3oError(W3oError.NETWORK_NOT_FOUND, { name, snapshot: this.snapshot() });
        }
        this.onNetworkChange$.next(name);
    }

    // Método para obtener la red actual
    getCurrentNetwork(): W3oNetwork {
        return this.current;
    }

    // Método para actualizar el estado de todas las redes
    // TODO: cambiar el tipo de retorno a Observable y hacer que los networks sean actualizados todos a las vez y no secuencialmente (remove this comment when implemented)
    async updateState(): Promise<void> {
        for (const network of this.__networks) {
            await network.updateState(); // asumir que devuelve un observable
        }
    }

    // Método para tomar una instantánea del estado del manejador de redes
    snapshot(): any {
        return {
            _class: 'W3oNetworkManager',
            networks: this.__networks.map(network => network.snapshot()),
            currentNetworkName: this.currentNetworkName,
        };
    }
}
