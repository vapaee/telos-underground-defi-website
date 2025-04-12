import { W3oModule, Web3Octopus } from '.';
import { W3oIServices } from '../types';
export declare abstract class W3oService extends W3oModule {
    path: string;
    constructor(path: string);
}
declare class MyServiceClass extends W3oService {
    path: string;
    w3oName: string;
    w3oVersion: string;
    w3oRequire: never[];
    constructor(path: string);
    init(): void;
    snapshot(): any;
    hello(): void;
}
interface IMyServices extends W3oIServices {
    foo: MyServiceClass;
}
export declare function getOctopus(): Web3Octopus<IMyServices>;
export {};
