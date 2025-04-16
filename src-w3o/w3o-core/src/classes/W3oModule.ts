import {
    BehaviorSubject
} from 'rxjs';
import { Logger, LoggerContext } from './Logger';

const logger = new Logger('W3oModule');

// Clase abstracta que representa un módulo (authenticador, network o servicio), su ID ()
export abstract class W3oModule {
    initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        parent: LoggerContext,
    ) {
        logger.method('constructor', { w3oId: this.w3oId }, parent);
    }

    // Método abstracto que deberá ser implementado por los móidulos que lo necesiten
    // esta función será llamada cuando todos los módulos requeridos estén inicializados
    init(parent: LoggerContext): void {
        logger.method('init', { w3oId: this.w3oId }, parent);
        this.initialized$.next(true);
    }

    // Método abstracto para obtener la versión del módulo
    abstract get w3oVersion(): string;

    // Método abstracto para obtener el nombre del módulo
    abstract get w3oName(): string;

    // Método abstracto para obtener la lista de dependencias del módulo
    abstract get w3oRequire(): string[];

    // Devuelve el ID del módulo
    get w3oId(): string {
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
