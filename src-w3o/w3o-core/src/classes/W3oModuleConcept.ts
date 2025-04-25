import {
    BehaviorSubject
} from 'rxjs';
import { Logger, LoggerContext } from './Logger';
import { W3oModule } from './W3oModule';

const logger = new Logger('W3oModuleConcept');

// Clase abstracta que representa un módulo (authenticador, network o servicio), su ID ()
export class W3oModuleConcept<T> extends W3oModule {
    constructor(
        private readonly moduleId: {v: string, n: string, r: string[]},
        public readonly data: T,
        parent: LoggerContext,
    ) {
        const context = logger.method('constructor', parent);
        super(context);
        // Register the module in the static modules list
        const [name, version] = [moduleId.n, moduleId.v];
        if (!!name && !!version) {
            W3oModule.registerModule(this, context);
        } else {
            context.error('Module not registered. review the moduleId', { moduleId });
        }
    }
    override get w3oVersion(): string {
        return this.moduleId?.v ?? '' ;
    }
    override get w3oName(): string {
        return this.moduleId?.n ?? '' ;
    }
    override get w3oRequire(): string[] {
        return this.moduleId?.r ?? '' ;
    }
}
