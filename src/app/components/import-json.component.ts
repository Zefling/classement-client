import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { decode } from 'utf8';

import { MessageService, MessageType } from './info-messages.component';

import { Data, FileString, importData } from '../interface';
import { DBService } from '../services/db.service';
import { GlobalService, TypeFile } from '../services/global.service';
import { Logger, LoggerLevel } from '../services/logger';


export type ImportJsonEvent = { action: 'replace' | 'new' | 'cancel'; data?: Data };

@Component({
    selector: 'import-json',
    templateUrl: './import-json.component.html',
    styleUrls: ['./import-json.component.scss'],
})
export class ImportJsonComponent implements OnDestroy {
    jsonTmp?: importData[];

    onLoad = false;

    @Input()
    multi = false;

    @Input()
    actions: 'importOnly' | 'all' = 'all';

    @Output()
    load = new EventEmitter<ImportJsonEvent>();

    @ViewChild('fileImport')
    private fileImport!: ElementRef<HTMLInputElement>;

    private _sub: Subscription[] = [];

    constructor(
        private translate: TranslateService,
        private globalService: GlobalService,
        private messageService: MessageService,
        private dbService: DBService,
        private logger: Logger,
    ) {
        this._sub.push(
            globalService.onFileLoaded.subscribe(file => {
                if (file.filter === TypeFile.json) {
                    this.onLoad = false;
                    this.addJsonTemp(file.file);
                }
            }),
        );
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
        this.clear();
    }

    importJsonFile(event: Event) {
        this.jsonTmp = undefined;
        this.onLoad = true;
        this.globalService.addFiles((event.target as any).files, TypeFile.json);
    }

    addJsonTemp(file: FileString) {
        try {
            const fileString = file.url?.replace('data:application/json;base64,', '');
            const data = JSON.parse(decode(atob(fileString!))) as Data | Data[];

            this.jsonTmp = [];

            if (!Array.isArray(data)) {
                if (Array.isArray(data.groups) && data.groups.length > 0 && Array.isArray(data.list) && data.options) {
                    this.jsonTmp = [{ data: data }];
                } else {
                    this.messageService.addMessage(this.translate.instant('message.json.read.echec'), {
                        type: MessageType.error,
                    });
                }
            } else if (this.multi) {
                for (const json of data) {
                    const item: importData = {};
                    if (
                        Array.isArray(json.groups) &&
                        json.groups.length > 0 &&
                        Array.isArray(json.list) &&
                        json.options
                    ) {
                        item.data = json;
                        item.selected = true;
                    } else {
                        item.error = true;
                    }
                    this.jsonTmp?.push(item);
                }
            } else {
                this.messageService.addMessage(this.translate.instant('message.json.read.echec'), {
                    type: MessageType.error,
                });
            }
        } catch (e) {
            this.logger.log('json error:', LoggerLevel.error, e);
            this.messageService.addMessage(this.translate.instant('message.json.read.echec'), {
                type: MessageType.error,
            });
        }
    }

    countItem(jsonTmp: importData): number {
        return (
            (jsonTmp?.data?.list?.length || 0) +
            (jsonTmp?.data?.groups?.reduce<number>((prev, curr) => prev + (curr.list?.length || 0), 0) || 0)
        );
    }

    importJson(jsonTmp: importData, type: 'replace' | 'new') {
        this.load.emit({ action: type, data: jsonTmp.data });
        this.clear();
    }

    async importMultiJson(type: 'replace' | 'new') {
        const list = this.jsonTmp!.filter(e => !e.error && e.selected);
        for (const jsonTmp of list) {
            await this.dbService.access();
            this.dbService.accessState = false;
            this.load.emit({ action: type, data: jsonTmp.data });
        }
        this.clear();
    }

    cancelJson() {
        this.load.emit({ action: 'cancel' });
        this.clear();
    }

    clear() {
        this.jsonTmp = undefined;
        // clear input
        if (this.fileImport?.nativeElement) {
            this.fileImport.nativeElement.value = '';
        }
    }
}
