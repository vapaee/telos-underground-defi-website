import { W3oError } from "./W3oError";


type LogMethod = 'log' | 'error';

interface LoggedLine {
    t: number;                            // milliseconds since the root node context was created
    m: LogMethod;                         // method name
    args: any[];                          // arguments passed to the method
}

type LoggerContextParent = LoggerContext | undefined;

export class LoggerContext {
    private static uniqueIdCounter = 0;
    private idValue: string;
    private parentContext: LoggerContextParent;
    private methodName: string;
    private argsValue: any;
    private logsArray: LoggedLine[];
    private levelValue: number;
    private startTime: number;

    constructor(className: string, methodName: string, args: any, parent: LoggerContextParent) {
        const completedName = `${className}.${methodName}`;
        this.idValue = LoggerContext.generateUniqueId();
        this.parentContext = parent;
        this.methodName = methodName;
        this.argsValue = args;
        this.logsArray = [];
        this.levelValue = parent ? parent.level() : 0;
        this.startTime = parent ? parent.startTime : Date.now();
        this.log(`${completedName}()`, args);
        this.levelValue++;
    }

    static generateUniqueId(): string {
        const id = (LoggerContext.uniqueIdCounter++).toString(36);
        return `x${id.length == 1 ? ('0'+id) : id.substring(id.length - 2)}`;
    }

    get root(): LoggerContext {
        return this.parentContext ? this.parentContext.root : this;
    }

    get indent(): string {
        return '  '.repeat(this.levelValue);
    }

    id(): string {
        return this.idValue;
    }

    parent(): LoggerContextParent {
        return this.parentContext;
    }

    args<T = any>(): T {
        return this.argsValue as unknown as T;
    }

    logs(): LoggedLine[] {
        return this.logsArray;
    }

    level(): number {
        return this.levelValue;
    }

    private getCurrentTime(): number {
        return Date.now() - this.startTime;
    }

    timestamp(): string {
        let t = this.getCurrentTime().toString();
        for (let i = t.length; i < 6; i++) {
            t = ' ' + t;
        }
        return t;
    }

    branch(): string {
        const father = this.parentContext ? this.parentContext.branch() : 'x';
        return `${father}${this.idValue}`;
    }

    get prefix(): string {
        // return `${this.id()} ${this.timestamp()}${this.indent}`;
        // return `${this.timestamp()} ${this.branch()}: ${this.indent}`;
        return `${this.timestamp()} ${this.branch()}:    `;
    }

    log(...args: any[]): void {
        this.logsArray.push({
            t: this.getCurrentTime(),
            m: 'log',
            args
        });
        console.log(this.prefix, ...args);
    }

    error(...args: any[]): void {
        this.logsArray.push({
            t: this.getCurrentTime(),
            m: 'error',
            args
        });
        if (typeof args[0] == 'string' && args[1] instanceof W3oError) {
            const prefix = this.prefix + ' ' + args[0];
            const error = args[1] as W3oError;
            error.print(prefix); // pretty print for W3oError
        } else if (args[0] instanceof W3oError) {
            const prefix = this.prefix;
            const error = args[0] as W3oError;
            error.print(prefix); // pretty print for W3oError
        } else {
            // default error print
            console.error(this.prefix, ...args);
        }
    }

    info(...args: any[]): void {
        this.logsArray.push({
            t: this.getCurrentTime(),
            m: 'log',
            args
        });
        console.info(this.prefix, ...args);
    }

    debug(...args: any[]): void {
        this.logsArray.push({
            t: this.getCurrentTime(),
            m: 'log',
            args
        });
        console.debug(this.prefix, ...args);
    }

    warn(...args: any[]): void {
        this.logsArray.push({
            t: this.getCurrentTime(),
            m: 'log',
            args
        });
        console.warn(this.prefix, ...args);
    }
    assert(condition: boolean, ...args: any[]): void {
        this.logsArray.push({
            t: this.getCurrentTime(),
            m: 'log',
            args
        });
        console.assert(condition, this.prefix, ...args);
    }
}


export class Logger {
    private className: string;
    static current: LoggerContext;

    constructor(className: string) {
        this.className = className;
    }

    method(methodName: string, args?: any, context?: LoggerContextParent): LoggerContext {
        if (args instanceof LoggerContext) {
            context = args;
            args = undefined;
        }
        Logger.current = new LoggerContext(this.className, methodName, args, context);
        return Logger.current;
    }
}

// --- example code ---
/*
// Logger object
const logger = new Logger('MyClass');

class MyClass {

    foo(n: number, parent?: LoggerContextParent) {
        const context = logger.method('foo', {n}, parent);
        context.log('log - n:', n);
        setTimeout(() => {
            context.error('error - n:', n);   // this line will be logged after 1000ms
        }, 1000);
    }

    bar(s: string, parent?: LoggerContextParent) {
        const context = logger.method('bar', {s}, parent);
        context.log('log - s:', s);
        setTimeout(() => {
            context.log('log - s:', s);       // this line will be logged after 200ms
        }, 200);
        this.foo(42);
        context.error('error - s:', s);
    }

}

const myClass = new MyClass();
myClass.bar('hello');     // root context AA created
myClass.foo(7);           // root context BB created
// output:
// <root-AA>     0 MyClass.bar() {s: "hello"}
// <root-AA>     0   log - s: "hello"
// <root-AA>     0   MyClass.foo() {n: 42}
// <root-AA>     0     log - n: 42
// <root-AA>     0   error - s: "hello"
// <root-BB>     0 MyClass.foo() {n: 7}
// <root-BB>     0   log - n: 7
// <root-AA>   200   log - s: "hello"
// <root-AA>  1000     error - n: 42
// <root-BB>  1000   error - n: 7
*/


