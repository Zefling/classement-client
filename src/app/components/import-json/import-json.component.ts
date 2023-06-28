import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    booleanAttribute,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Buffer } from 'buffer';
import { Subscription } from 'rxjs';

import { Data, FileString, importData } from '../../interface';
import { DBService } from '../../services/db.service';
import { GlobalService, TypeFile } from '../../services/global.service';
import { Logger, LoggerLevel } from '../../services/logger';
import { MessageService, MessageType } from '../info-messages/info-messages.component';

export type ImportJsonEvent = { action: 'replace' | 'new' | 'cancel'; data?: Data };

@Component({
    selector: 'import-json',
    templateUrl: './import-json.component.html',
    styleUrls: ['./import-json.component.scss'],
})
export class ImportJsonComponent implements OnDestroy {
    jsonTmp?: importData[];

    onLoad = false;

    @Input({ transform: booleanAttribute })
    multi = false;

    @Input()
    actions: 'importOnly' | 'all' = 'all';

    @Output()
    load = new EventEmitter<ImportJsonEvent>();

    @ViewChild('fileImport')
    private fileImport!: ElementRef<HTMLInputElement>;

    private _sub: Subscription[] = [];

    constructor(
        private readonly translate: TranslateService,
        private readonly globalService: GlobalService,
        private readonly messageService: MessageService,
        private readonly dbService: DBService,
        private readonly logger: Logger,
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
            const data = JSON.parse(Buffer.from(fileString!, 'base64').toString('utf-8')) as Data | Data[];

            this.jsonTmp = [];

            if (!Array.isArray(data)) {
                if (Array.isArray(data.groups) && data.groups.length > 0 && Array.isArray(data.list) && data.options) {
                    this.jsonTmp = [{ data: data, selected: true }];
                } else {
                    this.messageService.addMessage(this.translate.instant('message.json.read.echec'), {
                        type: MessageType.error,
                    });
                }
            } else if (this.multi) {
                for (const json of data) {
                    this.jsonTmp?.push(
                        Array.isArray(json.groups) && json.groups.length > 0 && Array.isArray(json.list) && json.options
                            ? { data: json, selected: true }
                            : { error: true },
                    );
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

    selectAll(select: boolean) {
        this.jsonTmp!.forEach(e => (e.selected = select));
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
        this.dbService.accessState = true;
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
