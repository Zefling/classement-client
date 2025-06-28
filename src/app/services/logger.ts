import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

export enum LoggerLevel {
    log,
    info,
    debug,
    warn,
    error,
}

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class Logger {
    suffix = '[classement] ';

    log(value: string, level: LoggerLevel = LoggerLevel.log, ...values: any[]) {
        if (level < (LoggerLevel as any)[environment.minLogLevel || 'info'] || 0) {
            return;
        }

        switch (level) {
            case LoggerLevel.log:
                console.log(this.suffix + value, ...values);
                break;
            case LoggerLevel.info:
                console.info(this.suffix + value, ...values);
                break;
            case LoggerLevel.debug:
                console.debug(this.suffix + value, ...values);
                break;
            case LoggerLevel.warn:
                console.warn(this.suffix + value, ...values);
                break;
            case LoggerLevel.error:
                console.error(this.suffix + value, ...values);
                break;
        }
    }

    error(value: string, ...values: any[]) {
        this.log(value, LoggerLevel.error, ...values);
    }
}
