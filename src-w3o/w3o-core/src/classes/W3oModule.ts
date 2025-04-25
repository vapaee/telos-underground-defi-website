// w3o-core/src/classes/W3oModule.ts

import {
    BehaviorSubject,
    filter,
    Observable
} from 'rxjs';
import { W3oContextFactory, W3oContext } from './W3oContext';
import { W3oInstance } from '../types';

const logger = new W3oContextFactory('W3oModule');

// Clase abstracta que representa un módulo (authenticador, network o servicio), su ID ()
export abstract class W3oModule {
    // -- Static registry of modules --
    static modules: {[w3oId: string]: W3oModule} = {};
    static registerModule(module: W3oModule, parent: W3oContext): void {
        logger.method('registerModule', { w3oId: module.w3oId, module }, parent);
        if (W3oModule.modules[module.w3oId]) {
            throw new Error(`Module ${module.w3oId} already registered`);
        }
        W3oModule.modules[module.w3oId] = module;
    }
    static getModule(w3oId: string, parent: W3oContext): W3oModule | undefined {
        logger.method('getModule', { w3oId }, parent);
        return W3oModule.modules[w3oId];
    }
    static getModules(parent: W3oContext): W3oModule[] {
        logger.method('getModules', {}, parent);
        return Object.values(W3oModule.modules);
    }

    private __octopus!: W3oInstance;
    private __requirements!: W3oModule[];
    private __initialized$: BehaviorSubject<W3oModule | false> = new BehaviorSubject<W3oModule | false>(false);

    constructor(
        parent: W3oContext,
    ) {
        const context = logger.method('constructor', parent);
        // Register the module in the static modules list
        const [name, version] = this.w3oId.split('@');
        if (!!name && !!version) {
            W3oModule.registerModule(this, context);
        } else {
            setTimeout(() => {
                if (!W3oModule.modules[this.w3oId]) {
                    context.error('Module not registered. Try to register yourself after W3oModule constructor', { w3oId: this.w3oId });
                }
            }, 0);
        }
    }

    /**
     * Gets an observable that only emits when the module has been initialized.
     * Subscribers before init will wait; subscribers after init will immediately
     * receive the module instance.
     */
    get initialized$(): Observable<W3oModule> {
        return this.__initialized$.asObservable().pipe(
            // filter out the initial `false`, narrow the type to W3oModule
            filter((value): value is W3oModule => value !== false)
        );
    }

    get initialized(): boolean {
        return this.__initialized$.getValue() !== false;
    }

    get octopus(): W3oInstance {
        if (!this.__octopus) {
            throw new Error(`Module(${this.w3oId}) not initialized. Try to initialize yourself after W3oModule constructor`);
        }
        return this.__octopus;
    }

    get requirements(): W3oModule[] {
        if (!this.__requirements) {
            throw new Error(`Module(${this.w3oId}) not initialized. Try to initialize yourself after W3oModule constructor`);
        }
        return this.__requirements;
    }


    // Método abstracto que deberá ser implementado por los móidulos que lo necesiten
    // esta función será llamada cuando todos los módulos requeridos estén inicializados
    init(octopus: W3oInstance, requirements: W3oModule[], parent: W3oContext): void {
        logger.method('init', { w3oId: this.w3oId, octopus, requirements }, parent);
        this.__octopus = octopus;
        this.__requirements = requirements;
        this.__initialized$.next(this);
    }

    // Método abstracto para obtener la versión del módulo
    abstract get w3oVersion(): string;

    // Método abstracto para obtener el nombre del módulo
    abstract get w3oName(): string;

    // Método abstracto para obtener la lista de dependencias del módulo
    abstract get w3oRequire(): string[];

    // Devuelve el ID del módulo
    public get w3oId(): string {
        return this.w3oName + '@' + this.w3oVersion;
    }

    // Method to take a snapshot of the module identifier
    snapshot() {
        return {
            w3oId: this.w3oId,
            w3oName: this.w3oName,
            w3oVersion: this.w3oVersion,
            w3oRequire: this.w3oRequire,
        };
    }
}
