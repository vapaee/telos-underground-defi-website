import { Observable } from 'rxjs';
import { LoggerContext, W3oContract, W3oNetwork } from '.';
import { W3oAddress } from '../types';
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
