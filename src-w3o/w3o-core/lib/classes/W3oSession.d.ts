import { W3oAddress } from '../types';
import { LoggerContext } from './Logger';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oNetwork } from './W3oNetwork';
export declare class W3oSession {
    readonly address: W3oAddress;
    readonly authenticator: W3oAuthenticator;
    readonly network: W3oNetwork;
    static readonly ID_SEPARATOR = "--";
    private __storage;
    private __id;
    constructor(address: W3oAddress, authenticator: W3oAuthenticator, network: W3oNetwork, parent: LoggerContext);
    get id(): string;
    set<TData>(key: string, value: TData): void;
    get<TData>(key: string): TData;
    remove(key: string): void;
    keys(): string[];
    snapshot(): any;
}
