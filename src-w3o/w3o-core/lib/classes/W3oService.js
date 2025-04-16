"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oService = void 0;
const Logger_1 = require("./Logger");
const W3oModule_1 = require("./W3oModule");
const logger = new Logger_1.Logger('W3oService');
// Clase abstracta que representa un módulo, incluyendo un método para inicializar el módulo y obtener un snapshot del estado interno
class W3oService extends W3oModule_1.W3oModule {
    constructor(path, parent) {
        const context = logger.method('constructor', { path }, parent);
        super(context);
        this.path = path;
    }
}
exports.W3oService = W3oService;
/*
import { W3oIServices } from '../types';
import {
    Web3Octopus,
} from '.';
// -- ejemplo de uso --
class MyServiceClass extends W3oService {
    w3oName = 'my-service';
    w3oVersion = '1.0.0';
    w3oRequire = [];
    constructor(public path: string)  {
        super(path);
    }
    init(): void {
        console.log('init');
        this.initialized$.next(true);
    }
    snapshot(): any {
        return {};
    }
    hello() {
        console.log('hello');
    }
}


interface IMyServices extends W3oIServices {
    foo: MyServiceClass;
}
const octopus = new Web3Octopus<IMyServices>();
const myService = new MyServiceClass('foo');

export function getOctopus() {
    return octopus;
}
// --
const oct = getOctopus();
oct.services.foo.hello();
myService.hello();

*/ 
//# sourceMappingURL=W3oService.js.map