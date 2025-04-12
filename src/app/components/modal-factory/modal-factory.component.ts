import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { IModalData } from 'src/types/IModalData';
import { ModalComponent } from 'src/app/components/base-components/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal-factory',
    template: `
        <pre>{{ modals.length }} modals</pre>
        <ng-container *ngFor='let modal of modals'>
            <app-modal
                [modalData]='modal'
                (dismiss)='onDismiss(modal, $event)'
            >
                <div modalHeader class="modal-header">
                    <h2>Header</h2>
                </div>
                <div modalBody class="modal-body">
                    <p>Body</p>
                </div>
                <div modalFooter class="modal-footer">
                    <button class="btn btn-primary" (click)='onDismiss(modal, { reason: "close" })'>Close</button>
                    <button class="btn btn-secondary" (click)='onDismiss(modal, { reason: "cancel" })'>Cancel</button>
                </div>
            </app-modal>
        </ng-container>
    `,
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalFactoryComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();
    modals: IModalData[] = [] as IModalData[];
    constructor(
        private modalService: ModalService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        console.log('ModalFactoryComponent.ngOnInit()');
        // Detect modals from the service
        this.modalService.modals$
            .pipe(takeUntil(this.destroy$))
            .subscribe((modals) => {
                this.modals = modals;
                this.cdr.markForCheck();
            });
    }

    // Handle dismiss event from modal component
    onDismiss(modal: IModalData, result: unknown): void {
        console.log('ModalFactoryComponent.onDismiss()', result);
        this.modalService.closeModal(modal.id, result);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
