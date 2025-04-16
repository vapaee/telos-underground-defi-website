import { Observable } from 'rxjs';
import { W3oAddress, W3oAuthSupportName, W3oNetworkName, W3oNetworkType, W3oTransaction } from '../types';
import { LoggerContext } from './Logger';
import { W3oModule } from './W3oModule';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oTransactionResponse } from './W3oTransactionResponse';
import { W3oAccount } from './W3oAccount';
export declare abstract class W3oAuthSupport extends W3oModule {
    readonly name: W3oAuthSupportName;
    readonly type: W3oNetworkType;
    constructor(name: W3oAuthSupportName, type: W3oNetworkType, parent: LoggerContext);
    createAuthenticator(parent: LoggerContext): W3oAuthenticator;
    abstract isReadOnly(): boolean;
    abstract signTransaction(trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse>;
    abstract login(network: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount>;
    abstract autoLogin(network: W3oNetworkName, address: W3oAddress, parent: LoggerContext): Observable<W3oAccount>;
    abstract logout(parent: LoggerContext): void;
}
