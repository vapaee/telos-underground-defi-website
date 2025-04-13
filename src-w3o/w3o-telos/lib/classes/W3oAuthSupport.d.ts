import { Observable } from 'rxjs';
import { LoggerContext, W3oAccount, W3oAuthenticator, W3oModule, W3oTransactionResponse } from '.';
import { W3oAddress, W3oAuthSupportName, W3oNetworkName, W3oNetworkType, W3oTransaction } from '../types';
export declare abstract class W3oAuthSupport extends W3oModule {
    readonly name: W3oAuthSupportName;
    readonly type: W3oNetworkType;
    constructor(name: W3oAuthSupportName, type: W3oNetworkType);
    createAuthenticator(parent: LoggerContext): W3oAuthenticator;
    abstract isReadOnly(): boolean;
    abstract signTransaction(trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse>;
    abstract login(network: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount>;
    abstract autoLogin(network: W3oNetworkName, address: W3oAddress, parent: LoggerContext): Observable<W3oAccount>;
    abstract logout(parent: LoggerContext): void;
    abstract snapshot(): any;
}
