import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '@app/components/nav-bar/nav-bar.component';
import { SideMenuMobileComponent } from '@app/components/side-menu-mobile/side-menu-mobile.component';
import { RedirectService } from '@app/services/redirect.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@app/services/messages.service';
import { MessageFactoryComponent } from '@app/components/message-factory/message-factory.component';
import { Ban, MessageCircleWarning, TriangleAlert } from 'lucide-angular';
import { ModalService } from './services/modal.service';
import { ModalFactoryComponent } from './components/modal-factory/modal-factory.component';
import { IModalData } from 'src/types/IModalData';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NavBarComponent,
        SideMenuMobileComponent,
        SharedModule,
        MessageFactoryComponent,
        ModalFactoryComponent,
    ],
    template: `
        <app-nav-bar class='navbar'></app-nav-bar>
        <div class='view'>
            <router-outlet></router-outlet>
        </div>
        <app-side-menu-mobile></app-side-menu-mobile>
        <app-message-factory></app-message-factory>
        <app-modal-factory></app-modal-factory>
    `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'my-angular-app';

    public icons = {
        error: Ban,
        info: MessageCircleWarning,
        warning: Ban,
        success: TriangleAlert
    }

    constructor(
        private redirectService: RedirectService, // Automatically sets redirection rules
        private translate: TranslateService,
        private messageService: MessageService,
        private modalService: ModalService
    ) {

        console.log('AppComponent initialized', { redirect: this.redirectService, translate: this.translate, message: this.messageService, modal: this.modalService });

        // Set default language
        this.translate.use('en');


        // Generamos un Modal de forma programática usando la siguiente interface como parámetro:
        /*
        export interface IModalData {
            id: string;                     // Unique identifier for the modal
            allowBackdropClose: boolean;    // Flag to allow closing modal on backdrop click
            destroying?: boolean;           // Flag indicating if modal is being destroyed (for animations)
            onDismiss?: (result?: any) => void;  // Callback when modal is dismissed
            headerTemplate?: TemplateRef<any>;   // Optional template for header content
            bodyTemplate?: TemplateRef<any>;     // Optional template for body content
            footerTemplate?: TemplateRef<any>;   // Optional template for footer content
        }

        para ello debemos crear un TemplateRef para cada una de las tres partes: header, body y footer.
        En este caso, vamos a crear un modal de error con un botón de cerrar y un mensaje de error.
        */
        setTimeout(() => {
            const modalData = {
                id: 'error-modal',
                allowBackdropClose: true,
                headerTemplate: null,
                bodyTemplate: null,
                footerTemplate: null,
                onDismiss: (result: any) => {
                    console.log('AppComponent - Modal dismissed with result:', result);
                }
            } as unknown as IModalData;
            modalService.openModal(modalData);
        }, 2000);

    }
}
