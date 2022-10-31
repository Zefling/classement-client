import { Component, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Data, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ImportJsonEvent } from 'src/app/components/import-json/import-json.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { FormatedInfos } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { Logger } from 'src/app/services/logger';
import { Utils } from 'src/app/tools/utils';


@Component({
    selector: 'classement-list',
    templateUrl: './classement-list.component.html',
    styleUrls: ['./classement-list.component.scss'],
})
export class ClassementListComponent implements OnInit, OnDestroy {
    @HostBinding('class.page')
    @Input()
    pageMode = true;

    @ViewChild('dialogDelete') dialogDelete!: DialogComponent;
    @ViewChild('dialogClone') dialogClone!: DialogComponent;
    @ViewChild('dialogImport') dialogImport!: DialogComponent;

    result!: FormatedInfos[];

    itemCurrent?: FormatedInfos;

    private listener: Subscription[] = [];

    constructor(
        private dbservice: DBService,
        private userService: APIUserService,
        private router: Router,
        private translate: TranslateService,
        private messageService: MessageService,
        private logger: Logger,
    ) {
        this.showList();
    }

    ngOnInit() {
        if (this.pageMode && this.userService.logged) {
            this.router.navigate(['/user/lists/browser']);
        }
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    exportAll() {
        this.dbservice.getLocalData().then(result => {
            const list: Data[] = [];

            if (result.length) {
                result.forEach(info => {
                    list.push({
                        // info
                        options: info.infos.options,
                        id: info.infos.id,
                        rankingId: info.infos.rankingId,
                        templateId: info.infos.templateId,
                        parentId: info.infos.parentId,
                        // data
                        groups: info.data.groups,
                        list: info.data.list,
                    });
                });
            }

            Utils.downloadFile(JSON.stringify(list), 'classements.json', 'text/plain');
        });
    }

    showList() {
        this.dbservice.getLocalList().then(result => {
            this.result = result;
            this._sort();
        });
    }

    delete(item: FormatedInfos) {
        this.dialogDelete.open();
        this.itemCurrent = item;
    }

    clone(item: FormatedInfos) {
        this.dialogClone.open();
        this.itemCurrent = item;
    }

    deleteCurrent(action: boolean) {
        if (!action) {
            this.logger.log(`Not remove line: ${this.itemCurrent?.id}`);
            this.itemCurrent = undefined;
            this.dialogDelete.close();
        } else if (this.itemCurrent?.id) {
            this.dbservice.delete(this.itemCurrent.id).then(() => {
                this.logger.log(`Remove line: ${this.itemCurrent?.id}`);
                this.result.splice(this.result.indexOf(this.itemCurrent as FormatedInfos), 1);
                this.messageService.addMessage(
                    this.translate
                        .instant('message.remove.success')
                        .replace('%title%', this._getTitle(this.itemCurrent!)),
                );
                this.itemCurrent = undefined;
                this.dialogDelete.close();
            });
        }
    }

    cloneCurrent(action: boolean, value?: string, edit: boolean = false) {
        if (!action) {
            this.logger.log(`Not clone line: ${this.itemCurrent?.id}`);
            this.itemCurrent = undefined;
            this.dialogClone.close();
        } else if (this.itemCurrent?.id) {
            this.dbservice.clone(this.itemCurrent, value || '').then(item => {
                this.logger.log(`Clone line: ${this.itemCurrent?.id} - ${item.id}`);

                this.messageService.addMessage(
                    this.translate
                        .instant('message.clone.success')
                        .replace('%title%', this._getTitle(this.itemCurrent!)),
                );
                this.itemCurrent = undefined;
                this.dialogClone.close();
                if (edit) {
                    this.router.navigate(['/edit/' + item.id]);
                } else {
                    this.result.push(item);
                }
            });
        }
    }

    importJson(event: ImportJsonEvent) {
        switch (event.action) {
            case 'new':
            case 'replace':
                if (event.action === 'new') {
                    event.data!.id = undefined;
                    event.action;
                }

                this.dbservice
                    .saveLocal(event.data!)
                    .then(item => {
                        this.logger.log(`Add line: ${event.data?.id} - ${item.infos.id}`);

                        this.messageService.addMessage(
                            this.translate
                                .instant('message.add.success')
                                .replace('%title%', this._getTitle(this.itemCurrent!)),
                        );
                        this.itemCurrent = undefined;
                        this.dialogClone.close();
                        const index = this.result.findIndex(e => e.id === item.infos.id);
                        if (index === -1) {
                            this.result.push(item.infos);
                            this._sort();
                        } else {
                            this.result[index] = item.infos;
                        }
                    })
                    .catch(() => {
                        this.messageService.addMessage(this.translate.instant('message.add.error'));
                    });
                break;
        }
        this.dialogImport.close();
    }

    private _getTitle(info: FormatedInfos) {
        return info?.options?.title.trim() || this.translate.instant('list.title.undefined');
    }

    private _sort() {
        this.result.forEach(d => {
            if (typeof d.date === 'string') {
                d.date = new Date(d.date);
            }
        });
        this.result.sort((e, f) => (f.date as Date).getTime() - (e.date as Date).getTime());
    }
}
