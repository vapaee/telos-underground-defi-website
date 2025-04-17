// src/app/services/web3-octopus.service.ts

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// Web3Octopus

// import the main class from the core
import {
    Web3Octopus,                          // the main class
    W3oService,                           // interface that includes the snapshot function
    W3oNetworkSupportSettings,            // interface that includes the network support settings
    Logger,                               // logger class
} from '@vapaee/w3o-core';

// import the classes to support Antelope (EOSIO) networks
import {
    AntelopeNetwork,                      // extends W3oNetwork
    AntelopeTokensService,                // extends W3oService
    AntelopeBalancesService,              // extends W3oService
    AntelopeAnchorAuth,                   // extends W3oAuthenticator
} from '@vapaee/w3o-antelope';

// import the configuration for each of the four Telos networks
import {
    TelosZeroConfigJSON,                  TelosZeroNetwork,                  // contains the mainnet native network configuration JSON
    TelosZeroTestnetConfigJSON,
    TelosZeroTestnetNetwork,           // contains the testnet native network configuration JSON
} from '@vapaee/w3o-telos';

import { VortDEXw3oDUMMY } from '@app/types';

// declare the window.v3o object which is used to store the instance of Web3Octopus so any javascript code can access it through window.v3o
declare global {
    interface Window {
        w3o: Web3Octopus<VortDEXw3oDUMMY>;
    }
}

const logger = new Logger('Web3OctopusService');

@Injectable({
    providedIn: 'root',
})
export class Web3OctopusService implements OnDestroy {
    private destroy$ = new Subject<void>();
    public octopus: Web3Octopus<VortDEXw3oDUMMY>;



    constructor(
    ) {
        const context = logger.method('constructor');
        const octopus = new Web3Octopus<VortDEXw3oDUMMY>(context);
        this.octopus = octopus;
        window.w3o = octopus; // assign the instance to the window object so it can be accessed from anywhere
        try {
            // ---- Register Telos/EOS support ----
            const telosEosSupportSettings: W3oNetworkSupportSettings = {
                // Network type
                type: 'antelope',
                // list of supported wallets for Antelope networks
                auth: [
                    new AntelopeAnchorAuth(context)
                ],
                // list of supported Antelope networks
                networks: [
                    new TelosZeroNetwork({}, context),
                    new TelosZeroTestnetNetwork({}, context),
                ]
            }
            this.octopus.addNetworkSupport(telosEosSupportSettings, context);

            // ---- Register the services ----
            // paths must match the keys in the IMyServices interface
            const services: W3oService[] = [
                new AntelopeTokensService('zero.tokens', context),
                new AntelopeBalancesService('zero.balances', context),
            ];
            octopus.registerServices(services);
            octopus.init(
                {
                    multiSession: false,
                    autoLogin: true,
                },
                context
            );
        } catch (error) {
            context.error('constructor', error);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
