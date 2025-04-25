// w3o-core/src/classes/W3oNetworkManager.ts

import { W3oContextFactory, W3oContext } from "./W3oContext";
import { W3oModule } from "./W3oModule";

const logger = new W3oContextFactory('W3oService');

// Clase abstracta que representa un módulo, incluyendo un método para inicializar el módulo y obtener un snapshot del estado interno
export abstract class W3oService extends W3oModule {
    constructor(
        public path: string,
        parent: W3oContext,
    ) {
        const context = logger.method('constructor', { path }, parent);
        super(context);
    }

    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            path: this.path,
        };
    }
}
