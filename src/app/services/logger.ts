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
    log(value: string, level: LoggerLevel = LoggerLevel.log, ...values: any[]) {
        if (level < (LoggerLevel as any)[environment.minLogLevel || 'info'] || 0) {
            return;
        }

        switch (level) {
            case LoggerLevel.log:
                console.log(value, ...values);
                break;
            case LoggerLevel.info:
                console.info(value, ...values);
                break;
            case LoggerLevel.debug:
                console.debug(value, ...values);
                break;
            case LoggerLevel.warn:
                console.warn(value, ...values);
                break;
            case LoggerLevel.error:
                console.error(value, ...values);
                break;
        }
    }
}
