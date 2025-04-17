// w3o-core/src/classes/Web3Octopus.ts

import { BehaviorSubject, filter } from 'rxjs';
import {
    W3oGlobalSettings,
    W3oInstance,
    W3oIServices,
    W3oNetworkSupportSettings,
} from '../types';

import { Logger, LoggerContext } from './Logger';
import { W3oAuthManager } from './W3oAuthManager';
import { W3oService } from './W3oService';
import { W3oNetworkManager } from './W3oNetworkManager';
import { W3oSessionManager } from './W3oSessionManager';
import { W3oModuleManager } from './W3oModuleManager';
import { W3oError } from './W3oError';
import { W3oModuleInstance } from './W3oModuleInstance';
import { W3oModule } from './W3oModule';

const logger = new Logger('Web3Octopus');

const defaultSettings: W3oGlobalSettings = {
    multiSession: false,
    autoLogin: true,
};

interface WithSnapshot {
    snapshot(): any;
}

// Main singleton class that acts as the entry point, includes methods to add network support, register modules, and initialize the state
export class Web3Octopus<Tw3o extends W3oIServices & WithSnapshot> implements W3oInstance {

    private __initialized = false;
    public onInitialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.__initialized);
    public onManagersReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private __authCtrl: W3oAuthManager | null = null;
    private __networkCtrl: W3oNetworkManager | null = null;
    private __sessionCtrl: W3oSessionManager | null = null;
    private __moduleCtrl: W3oModuleManager | null = null;
    private __services: W3oService[] = [];
    private __serviceCtrl: Tw3o | null = null;

    // static getter para obtener la instancia de Octopus casteada a la interfaz W3oInstance
    private static __instance: W3oInstance | null = null;
    static get instance(): W3oInstance {
        if (!Web3Octopus.__instance) {
            throw new W3oError(W3oError.OCTOPUS_INSTANCE_NOT_FOUND);
        }
        return Web3Octopus.__instance;
    }

    constructor(parent?: LoggerContext) {
        logger.method('constructor', parent);
        Web3Octopus.__instance = this;
    }

    // Getter to obtain the session manager
    get sessions(): W3oSessionManager {
        if (!this.__sessionCtrl) {
            throw new W3oError(W3oError.SESSION_NOT_FOUND);
        }
        return this.__sessionCtrl;
    }

    // Getter to obtain the network manager
    get networks(): W3oNetworkManager {
        if (!this.__networkCtrl) {
            throw new W3oError(W3oError.NETWORK_MANAGER_NOT_CREATED);
        }
        return this.__networkCtrl;
    }

    // Getter to obtain the auth manager
    get auth(): W3oAuthManager {
        if (!this.__authCtrl) {
            throw new W3oError(W3oError.AUTH_MANAGER_NOT_CREATED);
        }
        return this.__authCtrl;
    }

    // Getter to obtain the module manager
    get modules(): W3oModuleManager {
        if (!this.__moduleCtrl) {
            throw new W3oError(W3oError.MODULE_MANAGER_NOT_CREATED);
        }
        return this.__moduleCtrl;
    }

    // Getter to obtain the services
    get services(): Tw3o {
        if (!this.__serviceCtrl) {
            throw new W3oError(W3oError.SERVICE_OBJECT_NOT_FOUND);
        }
        return this.__serviceCtrl;
    }

    // Method to add network support
    addNetworkSupport(support: W3oNetworkSupportSettings, parent?: LoggerContext): void {
        const context = logger.method('addNetworkSupport', {support}, parent);
        if (this.__initialized) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'Web3Octopus', message: 'Network support can only be added before initialization' });
        }

        // at this point network and auth managers are not created yet
        // so we need to subscribe to the onManagersReady$ observable to add network and auth support
        const sub = this.onManagersReady$.pipe(
            filter((initialized) => initialized), // only proceed when initialized
        ).subscribe(() => {
            console.assert(!!this.networks, context.indent + 'Network manager not created');
            console.assert(!!this.auth, context.indent + 'Auth manager not created');

            // Add support for the network
            for (const network of support.networks) {
                this.networks.addNetwork(network, context);
                // Register generic support module
                // const supportModule = new W3oModuleInstance(
                //     {
                //         v:'1.0.0',
                //         n: `${support.type}.${network.name}`,
                //         r: [] as string[],
                //     },
                //     context
                // );
                // W3oModule.registerModule(supportModule, context);
            }

            // Add support for authentication for this type of network
            for (const auth of support.auth) {
                this.auth.addAuthSupport(auth, context);
            }

            sub.unsubscribe(); // Unsubscribe after adding support
        });
    }

    init(settings: W3oGlobalSettings = defaultSettings, parent?: LoggerContext): void {
        const context = logger.method('init', parent);
        if (this.__initialized) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'Web3Octopus', message: 'Web3Octopus can only be initialized once' });
        }
        const octopus = this;
        this.__initialized = true;
        this.__networkCtrl = new W3oNetworkManager(settings, context);
        this.__sessionCtrl = new W3oSessionManager(settings, context);
        this.__authCtrl = new W3oAuthManager(settings, context);
        this.__moduleCtrl = new W3oModuleManager(settings, context);
        this.__serviceCtrl = this.createServiceCustomInstance(context);
        console.log(`✅ Web3Octopus managers ready!!`);
        this.onManagersReady$.next(true);

        // Initialize the managers
        this.modules.init(octopus, context);
        this.auth.init(octopus, context);
        this.sessions.init(octopus, context);
        this.networks.init(octopus, context);
        // imprimir un ícono de un check verde seguido del texto: "Web3Octopus initialized"
        console.log(`✅ Web3Octopus initialized successfully!!`);
        this.onInitialized$.next(this.__initialized);
    }

    // Method to register services
    registerServices(services: W3oService[], parent?: LoggerContext): void {
        const context = logger.method('registerServices', {services}, parent);
        this.__services.push(...services);

        // at this point network and auth managers are not created yet
        // so we need to subscribe to the onManagersReady$ observable to register the services
        // const sub = this.onManagersReady$.pipe(
        //     filter((initialized) => initialized), // only proceed when initialized
        // ).subscribe(() => {
        //     console.assert(!!this.modules, context.indent + 'Module manager not created');
        //     for (const service of services) {
        //         context.log('registering service', service.path);
        //         // Register the service in the module manager
        //         // this.modules.registerModule(service, context);
        //     }
        //     sub.unsubscribe(); // Unsubscribe after adding support
        // });
    }

    // Method to create services
    private createServiceCustomInstance(parent?: LoggerContext): Tw3o {
        const context = logger.method('createServiceCustomInstance', undefined, parent);

        // Create the services object
        const servicesObject: Tw3o = { snapshot: () => ({}) } as Tw3o;
        for (const service of this.__services) {
            context.log('processing service', service.path);
            const path = service.path.split('.');
            let currentLevel = servicesObject as unknown as { [part: string]: W3oService };

            for (let i = 0; i < path.length; i++) {
                const part = path[i];
                if (currentLevel[part] instanceof W3oService) {
                    if (i === path.length - 1) {
                        currentLevel[part] = service;
                    } else {
                        if (!currentLevel[part]) {
                            currentLevel[part] = {} as W3oService;
                        }
                        currentLevel = currentLevel[part] as unknown as { [part: string]: W3oService };
                    }
                }
            }
        }

        // Add the snapshot method to the services object
        (servicesObject as unknown as WithSnapshot).snapshot = () => {
            const snapshot: any = {};
            const createSnapshot = (src: any, dest: any) => {
                for (const key in src) {
                    if (src[key] instanceof W3oService) {
                        dest[key] = src[key].snapshot();
                    } else if (typeof src[key] === 'object' && src[key] !== null) {
                        dest[key] = {};
                        createSnapshot(src[key], dest[key]);
                    }
                }
            };
            createSnapshot(servicesObject, snapshot);
            return snapshot;
        };

        context.log('services created successfully', {services: servicesObject});
        return servicesObject as Tw3o;
    }

    // Method to take a snapshot of the framework state
    snapshot(): any {
        if (!this.__initialized) {
            throw new W3oError(W3oError.NOT_INITIALIZED, { message: 'snapshots can only be taken after initialization' });
        }
        return {
            class: 'Web3Octopus',
            auth: this.auth.snapshot(),
            networks: this.networks.snapshot(),
            sessions: this.sessions.snapshot(),
            services: this.services.snapshot(),
        };
    }
}

