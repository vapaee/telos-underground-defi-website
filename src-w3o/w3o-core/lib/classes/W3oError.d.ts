export declare class W3oError extends Error {
    code: number;
    payload: any;
    constructor(error: {
        message: string;
        code: number;
    }, payload?: any);
    static readonly NETWORK_NOT_FOUND: {
        message: string;
        code: number;
    };
    static readonly SESSION_NOT_FOUND: {
        message: string;
        code: number;
    };
    static readonly NETWORK_MANAGER_NOT_CREATED: {
        message: string;
        code: number;
    };
    static readonly SESSION_MANAGER_NOT_CREATED: {
        message: string;
        code: number;
    };
    static readonly SERVICE_OBJECT_NOT_FOUND: {
        message: string;
        code: number;
    };
    static readonly SESSION_NOT_EDITABLE: {
        message: string;
        code: number;
    };
    static readonly SESSION_WITHOUT_ACCOUNT: {
        message: string;
        code: number;
    };
    static readonly SESSION_WITHOUT_NETWORK: {
        message: string;
        code: number;
    };
    static readonly SESSION_NOT_MULTIPLE: {
        message: string;
        code: number;
    };
    static readonly ALREADY_INITIALIZED: {
        message: string;
        code: number;
    };
    static readonly MODULE_REQUIREMENTS_NOT_MET: {
        message: string;
        code: number;
    };
    static readonly AUTH_MANAGER_NOT_CREATED: {
        message: string;
        code: number;
    };
    static readonly NOT_INITIALIZED: {
        message: string;
        code: number;
    };
    static readonly ACCOUNT_NOT_LOGGED: {
        message: string;
        code: number;
    };
    static readonly AUTH_SUPPORT_NOT_FOUND: {
        message: string;
        code: number;
    };
    static readonly OCTOPUS_INSTANCE_NOT_FOUND: {
        message: string;
        code: number;
    };
    static readonly MODULE_MANAGER_NOT_CREATED: {
        message: string;
        code: number;
    };
    static readonly SESSION_ALREADY_EXISTS: {
        message: string;
        code: number;
    };
    static readonly SESSION_LOAD_ERROR: {
        message: string;
        code: number;
    };
    static readonly SESSION_ALREADY_SET: {
        message: string;
        code: number;
    };
}
