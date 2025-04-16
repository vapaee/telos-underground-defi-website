import { LoggerContext } from "./Logger";
import { W3oModule } from "./W3oModule";
export declare abstract class W3oService extends W3oModule {
    path: string;
    constructor(path: string, parent: LoggerContext);
}
