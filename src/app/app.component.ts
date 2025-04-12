import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '@app/components/nav-bar/nav-bar.component';
import { SideMenuMobileComponent } from '@app/components/side-menu-mobile/side-menu-mobile.component';
import { RedirectService } from '@app/services/redirect.services';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateService } from '@ngx-translate/core';

// import the main class from the core
import {
    Web3Octopus,                          // the main class
    W3oIServices,                         // interface that includes the snapshot function
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
    TelosEvmConfigJSON,                   // contains the mainnet evm network configuration JSON
    TelosEvmTestnetConfigJSON,            // contains the testnet evm network configuration JSON
    TelosZeroConfigJSON,                  // contains the mainnet native network configuration JSON
    TelosZeroTestnetConfigJSON,           // contains the testnet native network configuration JSON
} from '@vapaee/w3o-telos';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NavBarComponent,
        SideMenuMobileComponent,
        SharedModule
    ],
    template: `
        <app-nav-bar class='navbar'></app-nav-bar>
        <div class='view'>
            <router-outlet></router-outlet>
        </div>
        <app-side-menu-mobile></app-side-menu-mobile>
    `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'my-angular-app';


    constructor(
        private redirectService: RedirectService, //Automatically sets redirection rules
        private translate: TranslateService,
    ) {
        // Set default language
        this.translate.use('en');
    }
}
