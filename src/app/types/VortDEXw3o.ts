/*
// import the main class from the core
import {
    W3oIServices,                         // interface that includes the snapshot function
} from '@vapaee/w3o-core';

// import the classes to support Antelope (EOSIO) networks
import {
    AntelopeTokensService,                // extends W3oService
    AntelopeBalancesService,              // extends W3oService
} from '@vapaee/w3o-antelope';

// ---- Create the main class instance ----
// the developer user may be creative and create his own service schema
export interface VortDEXw3o extends W3oIServices {
    zero: {
        tokens: AntelopeTokensService<W3oIServices>;     // extends W3oService
        balances: AntelopeBalancesService<W3oIServices>; // extends W3oService
    },
    // example: ExampleService;               // extends W3oService, user module
    // foo: FooService;                       // extends W3oService, user module
}
*/

export interface VortDEXw3oDUMMY {
    snapshot: () => any;
}