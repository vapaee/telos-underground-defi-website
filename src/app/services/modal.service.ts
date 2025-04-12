import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IModalData } from 'src/types/IModalData';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private modals: IModalData[] = [];
    public modals$ = new BehaviorSubject<IModalData[]>([]);

    // Open a modal by adding it to the modals stack
    openModal(modalData: IModalData): void {
        console.log('ModalService.openModal()', { modalData });
        this.modals.push(modalData);
        this.modals$.next(this.modals);
    }

    // Close a modal by id, with an optional result
    closeModal(modalId: string, result?: unknown): void {
        console.log('ModalService.closeModal()', { modalId, result });
        const index = this.modals.findIndex(modal => modal.id === modalId);
        if (index !== -1) {
            const modal = this.modals[index];
            // Mark modal as destroying for animation
            modal.destroying = true;
            this.modals$.next(this.modals);
            setTimeout(() => {
                this.modals.splice(index, 1);
                this.modals$.next(this.modals);
                // Trigger onDismiss callback if provided
                if (modal.onDismiss) {
                    modal.onDismiss(result);
                }
            }, 300); // Delay for fade-out animation
        }
    }
}
