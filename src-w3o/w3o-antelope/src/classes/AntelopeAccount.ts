// w3o-antelope/src/classes/AntelopeAccount.ts

import { W3oContextFactory, W3oContext, W3oAccount, W3oAuthenticator } from '@vapaee/w3o-core';
import { Session } from '@wharfkit/session';

const logger = new W3oContextFactory('AntelopeAccount');

export class AntelopeAccount extends W3oAccount {

    constructor(
        address: string,
        session: Session,
        auth: W3oAuthenticator,
        parent: W3oContext,
    ) {
        const context = logger.method('constructor', { address, auth, session }, parent);
        super(address, auth as W3oAuthenticator, context);
    }

    // Método abstracto para tomar una instantánea del estado de la cuenta
    snapshot(): any {
        return {
            address: this.getAddress(),
            _class: 'AntelopeAccount',
        };
    }
}
