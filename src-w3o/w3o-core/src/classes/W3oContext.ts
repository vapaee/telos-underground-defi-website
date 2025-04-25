// w3o-core/src/classes/W3oContext.ts

import { BehaviorSubject, Observable } from 'rxjs';
import { W3oStorage } from './W3oStorage';

type LogMethod = 'log' | 'error' | 'info' | 'warn' | 'debug' | 'assert';

interface LoggedLine {
    t: number;       // milliseconds since context tree start
    m: LogMethod;    // which method was called
    args: any[];     // arguments passed to the method
}

export class W3oContext {
    private readonly idValue: string;
    private readonly parentContext?: W3oContext;
    public readonly root: W3oContext;
    private readonly logsArray: LoggedLine[] = [];
    private readonly levelValue: number;
    private readonly startTime: number;
    private readonly argsValue: any;
    private readonly storage: W3oStorage;
    private readonly destroyedSubject = new BehaviorSubject<boolean>(false);
    private rootTimeoutId?: number;
    readonly indent: string;

    // generate a random 2-digit hexadecimal ID
    private static generateUniqueId(): string {
        const rand = Math.floor(Math.random() * 256);
        return rand.toString(16).padStart(2, '0');
    }

    constructor(
        className: string,
        methodName: string,
        args: any,
        parentContext?: W3oContext
    ) {
        // generate and assign unique ID
        this.idValue = W3oContext.generateUniqueId();
        this.parentContext = parentContext;

        // carry over timing and nesting level
        this.startTime = parentContext ? parentContext.startTime : Date.now();
        this.levelValue = parentContext ? parentContext.levelValue + 1 : 0;

        // set indentation based on nesting level
        this.indent = '  '.repeat(this.levelValue);

        // compute root once
        this.root = parentContext ? parentContext.root : this;

        // share or create storage
        this.storage = parentContext
            ? parentContext.storage
            : new W3oStorage();

        // if this is the root, set up a 10s timer to warn if not dismissed
        if (!parentContext) {
            this.rootTimeoutId = window.setTimeout(() => {
                if (!this.destroyedSubject.value) {
                    console.warn(
                        'Warning: context not dismissed after 10 seconds',
                        this
                    );
                }
            }, 10_000);
        }

        // initial log entry
        this.log(`${className}.${methodName}()`, args);
        this.argsValue = args;
    }

    // expose destroyed as an observable
    public get destroyed$(): Observable<boolean> {
        return this.destroyedSubject.asObservable();
    }

    // clean up all in-memory data for this context tree
    public dismiss(): void {
        // clear logged lines
        this.logsArray.length = 0;
        // clear shared storage at root
        this.root.storage.clear();
        // signal destruction
        this.destroyedSubject.next(true);
        // cancel the root warning timer
        if (this.rootTimeoutId !== undefined) {
            clearTimeout(this.rootTimeoutId);
        }
    }

    // return this context's ID
    public id(): string {
        return this.idValue;
    }

    // return the parent context, if any
    public parent(): W3oContext | undefined {
        return this.parentContext;
    }

    // return the arguments passed into this context
    public args<T = any>(): T {
        return this.argsValue as T;
    }

    // return all logged lines in this node
    public logs(): LoggedLine[] {
        return this.logsArray;
    }

    // return nesting level (0 = root)
    public level(): number {
        return this.levelValue;
    }

    // milliseconds since the root context was created
    private getCurrentTime(): number {
        return Date.now() - this.startTime;
    }

    // formatted timestamp (padded to 6 digits)
    public timestamp(): string {
        let t = this.getCurrentTime().toString();
        while (t.length < 6) {
            t = ' ' + t;
        }
        return t;
    }

    // branch identifier built from ancestor IDs
    public branch(): string {
        const prefix = this.parentContext ? this.parentContext.branch() : '';
        return `${prefix}${this.idValue}`;
    }

    // prefix shown in console output
    get prefix(): string {
        const indent = '  '.repeat(this.levelValue);
        return `${this.timestamp()} ${this.branch()}: ${indent}`;
    }

    // record a log entry internally
    private pushLog(method: LogMethod, args: any[]): void {
        this.logsArray.push({ t: this.getCurrentTime(), m: method, args });
    }

    // standard log
    public log(...args: any[]): void {
        this.pushLog('log', args);
        console.log(this.prefix, ...args);
    }

    // error log, with W3oError support
    public error(...args: any[]): void {
        this.pushLog('error', args);
        if (typeof args[0] === 'string' && typeof args[1]?.print === 'function') {
            const msg = args[0];
            const err = args[1] as { print: (msg: string) => void };
            err.print(`${this.prefix} ${msg}`);
        } else if (typeof args[0]?.print === 'function') {
            const err = args[0] as { print: (msg: string) => void };
            err.print(this.prefix);
        } else {
            console.error(this.prefix, ...args);
        }
    }

    // info log
    public info(...args: any[]): void {
        this.pushLog('info', args);
        console.info(this.prefix, ...args);
    }

    // warn log
    public warn(...args: any[]): void {
        this.pushLog('warn', args);
        console.warn(this.prefix, ...args);
    }

    // debug log
    public debug(...args: any[]): void {
        this.pushLog('debug', args);
        console.debug(this.prefix, ...args);
    }

    // assertion
    public assert(condition: boolean, ...args: any[]): void {
        this.pushLog('assert', args);
        console.assert(condition, this.prefix, ...args);
    }
}

export class W3oContextFactory {
    private className: string;
    public static current?: W3oContext;

    constructor(className: string) {
        this.className = className;
    }

    // create a new context node for `methodName`
    public method(methodName: string, args?: any, context?: W3oContext): W3oContext {
        if (args instanceof W3oContext) {
            context = args;
            args = undefined;
        }
        const ctx = new W3oContext(this.className, methodName, args, context);
        W3oContextFactory.current = ctx;
        return ctx;
    }

    // Console API ----
    private static get console(): W3oContext | Console {
        return W3oContextFactory.current ?? console;
    }

    public log(...args: any[]): void {
        W3oContextFactory.console.log(...args);
    }

    public error(...args: any[]): void {
        W3oContextFactory.console.error(...args);
    }

    public info(...args: any[]): void {
        W3oContextFactory.console.info(...args);
    }

    public warn(...args: any[]): void {
        W3oContextFactory.console.warn(...args);
    }

    public debug(...args: any[]): void {
        W3oContextFactory.console.debug(...args);
    }

    public assert(condition: boolean, ...args: any[]): void {
        W3oContextFactory.console.assert(condition, ...args);
    }
}
