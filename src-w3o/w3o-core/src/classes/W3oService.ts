import { Logger, LoggerContext } from "./Logger";
import { W3oModule } from "./W3oModule";

const logger = new Logger('W3oService');

// Clase abstracta que representa un módulo, incluyendo un método para inicializar el módulo y obtener un snapshot del estado interno
export abstract class W3oService extends W3oModule {
    constructor(
        public path: string,
        parent: LoggerContext,
    ) {
        const context = logger.method('constructor', { path }, parent);
        super(context);
    }
}
