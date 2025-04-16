import { Observable } from 'rxjs';
import { LoggerContext, W3oAccount, W3oTransactionResponse } from '.';
import { W3oAddress, W3oNetworkName, W3oTransaction } from '../types';
import { W3oAuthSupport } from './W3oAuthSupport';
export declare class W3oAuthenticator {
    readonly support: W3oAuthSupport;
    private __account;
    private __sessionId;
    constructor(support: W3oAuthSupport, parent: LoggerContext);
    get account(): W3oAccount;
    get name(): string;
    get type(): string;
    get sessionId(): string;
    setSessionId(sessionId: string, parent: LoggerContext): void;
    isLogged(): boolean;
    getAddress(): W3oAddress;
    getAccount(): W3oAccount | null;
    isReadOnly(): boolean;
    signTransaction(trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse>;
    login(network: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount>;
    autoLogin(network: W3oNetworkName, address: W3oAddress, parent: LoggerContext): Observable<W3oAccount>;
    logout(parent: LoggerContext): void;
    snapshot(): any;
}
