import { Observable } from 'rxjs';
import { LoggerContext, W3oAuthenticator, W3oSession } from '.';
import { W3oAuthInstance, W3oAuthSupportName, W3oGlobalSettings, W3oNetworkType } from '../types';
import { W3oAuthSupport } from './W3oAuthSupport';
export declare class W3oAuthManager implements W3oAuthInstance {
    private __initialized;
    private __byType;
    private __byName;
    constructor(settings: W3oGlobalSettings, parent: LoggerContext);
    init(parent: LoggerContext): void;
    addAuthSupport(auth: W3oAuthSupport, parent: LoggerContext): void;
    get(name: string): W3oAuthSupport;
    list(type: string): W3oAuthSupport[];
    createAuthenticator(name: W3oAuthSupportName, parent: LoggerContext): W3oAuthenticator;
    login(network: W3oNetworkType, authName: W3oAuthSupportName, parent: LoggerContext): Observable<W3oSession>;
    snapshot(): any;
}
