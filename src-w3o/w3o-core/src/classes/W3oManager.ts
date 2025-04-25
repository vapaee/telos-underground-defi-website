// w3o-core/src/classes/W3oManager.ts

import { BehaviorSubject, filter, take, Observable, map } from 'rxjs';
import { W3oContextFactory } from './W3oContext';

const logger = new W3oContextFactory('W3oModuleManager');

// Clase que implementa un administrador de módulos
export class W3oManager {
    protected __initCalled = false;
    protected __initialized$ = new BehaviorSubject<boolean>(false);

    constructor(
        private managerName: string = 'W3oManager'
    ) {
        this.whenReady.subscribe(() => {
            W3oContextFactory.current?.log(`✅ ${this.managerName} ready!`);
        });
    }

    get initialized$(): Observable<boolean> {
        return this.__initialized$.asObservable();
    }

    get initialized(): boolean {
        return this.__initialized$.value;
    }

    get whenReady(): Observable<void> {
        return this.initialized$.pipe(
            filter((value) => value),
            take(1),
            map(() => {
                return
            })
        );
    }
}
