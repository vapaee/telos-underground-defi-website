// w3o-core/src/classes/W3oStorage.ts

export type W3oMappingType = { [key: string]: any };

// simple key/value store for sharing data across a context tree
export class W3oStorage {
    private data: W3oMappingType = {};

    // store a value under `key`
    public set<T>(key: string, value: T): void {
        this.data[key] = value;
    }

    // retrieve a value by `key`
    public get<T = any>(key: string): T | undefined {
        return this.data[key] as T | undefined;
    }

    // remove a value by `key`
    public remove(key: string): void {
        delete this.data[key];
    }

    // check if a key exists
    public has(key: string): boolean {
        return this.data.hasOwnProperty(key);
    }

    // get all keys
    public keys(): string[] {
        return Object.keys(this.data);
    }

    // clear all data
    public clear(): void {
        this.data = {};
    }

    // get a snapshot of the current state
    public snapshot(): W3oMappingType {
        return { ...this.data };
    }
}
