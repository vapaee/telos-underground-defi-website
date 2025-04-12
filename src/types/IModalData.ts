import { TemplateRef } from '@angular/core';

export interface IModalData {
    id: string;                     // Unique identifier for the modal
    allowBackdropClose: boolean;    // Flag to allow closing modal on backdrop click
    destroying?: boolean;           // Flag indicating if modal is being destroyed (for animations)
    onDismiss?: (result?: any) => void;  // Callback when modal is dismissed
    headerTemplate?: TemplateRef<any>;   // Optional template for header content
    bodyTemplate?: TemplateRef<any>;     // Optional template for body content
    footerTemplate?: TemplateRef<any>;   // Optional template for footer content
}
