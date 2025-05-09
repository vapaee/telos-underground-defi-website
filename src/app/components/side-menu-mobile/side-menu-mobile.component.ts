import { Component, ViewEncapsulation } from '@angular/core';
import { SideContainerComponent } from '@app/components/base-components/side-container/side-container.component';
import {
    LucideAngularModule,
    ChartCandlestick,
    Settings,
    Coins,
    Wallet,
    LogOut,
    ListTree,
    Users
} from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { SessionService } from '@app/services/session-kit.service';
import { SharedModule } from '@app/shared/shared.module';

@Component({
    selector: 'app-side-menu-mobile',
    imports: [
        SideContainerComponent,
        LucideAngularModule,
        RouterModule,
        SharedModule
    ],
    templateUrl: './side-menu-mobile.component.html',
    styleUrl: './side-menu-mobile.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class SideMenuMobileComponent {
    readonly ChartCandlestickIcon = ChartCandlestick;
    readonly SettingsIcon = Settings;
    readonly CoinsIcon = Coins;
    readonly WalletIcon = Wallet;
    readonly LogoutIcon = LogOut;
    readonly ListTreeIcon = ListTree;
    readonly UsersIcon = Users

    constructor(
        public sessionService: SessionService
    ) {}

    async logout() {
        await this.sessionService.logout();
    }

}