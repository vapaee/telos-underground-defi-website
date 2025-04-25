// w3o-core/src/classes/W3oError.ts

import { W3oContextFactory, W3oContext } from "./W3oContext";

// Represents a specific error within Web3 Octopus
export class W3oError extends Error {
    public code: number;
    public payload: any;

    constructor(error: { message: string, code: number }, payload?: any) {
        super(error.message);
        this.code = error.code;
        this.payload = payload;
        this.name = 'W3oError';
        const context = W3oContextFactory.current;
        this.print(context?.prefix ?? error.message, context);
    }

    public override toString(): string {
        return `${this.name} [${this.code}]: ${this.message}`;
    }

    public print(prefix: string = '', context: W3oContext | undefined = undefined): void {
        if (context) {
            if (this.payload) {
                context.error(prefix + this.toString(), this.payload);
            } else {
                context.error(prefix + this.toString());
            }
        } else {
            if (this.payload) {
                console.error(prefix + this.toString(), this.payload);
            } else {
                console.error(prefix + this.toString());
            }
        }
    }

    public static print(t: unknown, e?: unknown, p?: W3oContext): void {
        if (typeof t === 'string' && e instanceof W3oError) {
            e.print(t, p);
        } else if (t instanceof W3oError) {
            t.print('', p);
        }
        console.error( !!t ? t : 'Unknown error:', e);
    }

    // List of error codes sorted alphabetically with sequential codes
    public static readonly ACCOUNT_NOT_LOGGED             = { message: 'Account not logged', code: 1000 };
    public static readonly ALREADY_INITIALIZED            = { message: 'Already initialized', code: 1001 };
    public static readonly AUTH_MANAGER_NOT_CREATED       = { message: 'Auth manager was not created', code: 1002 };
    public static readonly AUTH_SUPPORT_NOT_FOUND         = { message: 'Auth support not found', code: 1003 };
    public static readonly AUTH_WITHOUT_ACCOUNT           = { message: 'Authenticator without account', code: 1004 };
    public static readonly KEY_NOT_FOUND                  = { message: 'Key not found', code: 1005 };
    public static readonly MODULE_MANAGER_NOT_CREATED     = { message: 'Module manager was not created', code: 1006 };
    public static readonly MODULE_REQUIREMENTS_NOT_MET    = { message: 'Module requirements not met', code: 1007 };
    public static readonly NETWORK_MANAGER_NOT_CREATED    = { message: 'Network manager was not created', code: 1008 };
    public static readonly NETWORK_NOT_FOUND              = { message: 'Network not found', code: 1009 };
    public static readonly NOT_INITIALIZED                = { message: 'Not initialized', code: 1010 };
    public static readonly OCTOPUS_INSTANCE_NOT_FOUND     = { message: 'Octopus instance not found', code: 1011 };
    public static readonly READ_ONLY_AUTHENTICATOR        = { message: 'Read only authenticator', code: 1012 };
    public static readonly SERVICE_OBJECT_NOT_FOUND       = { message: 'Service object wa not created', code: 1013 };
    public static readonly SETTINGS_NOT_FOUND             = { message: 'Settings not found', code: 1014 };
    public static readonly SESSION_ALREADY_EXISTS         = { message: 'Session already exists', code: 1015 };
    public static readonly SESSION_ALREADY_SET            = { message: 'Session already set', code: 1016 };
    public static readonly SESSION_LOAD_ERROR             = { message: 'Session load error', code: 1017 };
    public static readonly SESSION_MANAGER_NOT_CREATED    = { message: 'Session manager was not created', code: 1018 };
    public static readonly SESSION_MISSING_KEY            = { message: 'Session missing key', code: 1019 };
    public static readonly SESSION_NOT_EDITABLE           = { message: 'Session is not editable', code: 1020 };
    public static readonly SESSION_NOT_FOUND              = { message: 'Session not found', code: 1021 };
    public static readonly SESSION_NOT_MULTIPLE           = { message: 'You are not working with multiple sessions', code: 1022 };
    public static readonly SESSION_NOT_SET                = { message: 'Session not set', code: 1023 };
    public static readonly SESSION_WITHOUT_ACCOUNT        = { message: 'Session without account', code: 1024 };
    public static readonly SESSION_WITHOUT_NETWORK        = { message: 'Session without network', code: 1025 };
    public static readonly SUPPORT_NOT_FOUND              = { message: 'Support not found', code: 1026 };
    public static readonly TRANSACTION_ERROR              = { message: 'Transaction error', code: 1027 };
}



