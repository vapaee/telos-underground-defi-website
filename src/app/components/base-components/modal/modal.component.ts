import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { IModalData } from 'src/types/IModalData';

@Component({
    selector: 'app-modal',
    template: `
        <div class="c-modal-backdrop" (click)="onBackdropClick()"></div>
        <div class="c-modal" [ngClass]="{'shake': shaking, 'destroying': modalData.destroying}">
            <div class='c-modal__header'>
                <ng-container *ngIf='modalData.headerTemplate; else headerContent'>
                    <ng-container *ngTemplateOutlet='modalData.headerTemplate'></ng-container>
                </ng-container>
                <ng-template #headerContent>
                    <ng-content select='[modalHeader]'></ng-content>
                </ng-template>
            </div>
            <div class='c-modal__body'>
                <ng-container *ngIf='modalData.bodyTemplate; else bodyContent'>
                    <ng-container *ngTemplateOutlet='modalData.bodyTemplate'></ng-container>
                </ng-container>
                <ng-template #bodyContent>
                    <ng-content select='[modalBody]'></ng-content>
                </ng-template>
            </div>
            <div class='c-modal__footer'>
                <ng-container *ngIf='modalData.footerTemplate; else footerContent'>
                    <ng-container *ngTemplateOutlet='modalData.footerTemplate'></ng-container>
                </ng-container>
                <ng-template #footerContent>
                    <ng-content select='[modalFooter]'></ng-content>
                </ng-template>
            </div>
        </div>
    `,
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class ModalComponent implements OnChanges {
    @Input() modalData!: IModalData;
    @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();

    shaking: boolean = false;

    constructor() {
        console.log('ModalComponent initialized', { modalData: this.modalData });
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ModalComponent.ngOnChanges()', { changes });
        if (changes['modalData']) {
            // this.modalData = changes['modalData'].currentValue;
            console.log('ModalComponent.ngOnChanges()', { modalData: this.modalData });
        }
    }

    // Handle click on backdrop
    onBackdropClick(): void {
        console.log('ModalComponent.onBackdropClick()', { allowBackdropClose: this.modalData.allowBackdropClose });
        if (this.modalData.allowBackdropClose) {
            this.dismiss.emit({ id: this.modalData.id, reason: 'backdrop' });
        } else {
            this.triggerShake();
        }
    }

    // Trigger shake animation to indicate modal cannot be closed via backdrop
    triggerShake(): void {
        console.log('ModalComponent.triggerShake()');
        this.shaking = true;
        setTimeout(() => {
            this.shaking = false;
        }, 500); // Shake animation duration
    }
}
// Compare this snippet from src/app/components/base-components/modal/modal.component.scss:
