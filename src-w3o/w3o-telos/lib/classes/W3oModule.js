"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oModule = void 0;
const rxjs_1 = require("rxjs");
// Clase abstracta que representa un módulo (authenticador, network o servicio), su ID ()
class W3oModule {
    constructor() {
        this.initialized$ = new rxjs_1.BehaviorSubject(false);
    }
    // Método abstracto que deberá ser implementado por los móidulos que lo necesiten
    // esta función será llamada cuando todos los módulos requeridos estén inicializados
    init() {
        this.initialized$.next(true);
    }
    // Devuelve el ID del módulo
    get w3oId() {
        return this.w3oName + '@' + this.w3oVersion;
    }
}
exports.W3oModule = W3oModule;
//# sourceMappingURL=W3oModule.js.map