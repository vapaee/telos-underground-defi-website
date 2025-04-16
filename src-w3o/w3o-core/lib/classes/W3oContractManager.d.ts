import { Observable } from 'rxjs';
import { W3oAddress } from '../types';
import { LoggerContext } from './Logger';
import { W3oContract } from './W3oContract';
import { W3oNetwork } from './W3oNetwork';
export declare abstract class W3oContractManager {
    readonly network: W3oNetwork;
    private __contracts;
    constructor(network: W3oNetwork, parent: LoggerContext);
    get list(): W3oContract[];
    get addresses(): W3oAddress[];
    addContract(address: W3oAddress, contract: W3oContract | null, parent: LoggerContext): void;
    getContract(address: W3oAddress, parent: LoggerContext): Observable<W3oContract | null>;
    getContracts(parent: LoggerContext): W3oContract[];
    getTokenContract(symbol: string, parent: LoggerContext): Observable<W3oContract | null>;
    abstract fetchContract(address: W3oAddress, parent: LoggerContext): Observable<W3oContract | null>;
    snapshot(): any;
}
