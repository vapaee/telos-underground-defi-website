import { W3oAuthenticator } from './W3oAuthenticator';
export declare abstract class W3oAccount {
    readonly authenticator: W3oAuthenticator;
    constructor(authenticator: W3oAuthenticator);
    abstract getAddress(): string;
    abstract snapshot(): any;
}
