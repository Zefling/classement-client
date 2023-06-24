import { Component, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Data, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ImportJsonEvent } from 'src/app/components/import-json/import-json.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { SortableDirective } from 'src/app/directives/sortable.directive';
import { FormatedInfos } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Logger } from 'src/app/services/logger';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

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
    @ViewChild(SortableDirective) sortableDirective!: SortableDirective;

    filter = '';

    result!: FormatedInfos[];

    itemCurrent?: FormatedInfos;

    serverIds: string[] = [];

    modeApi = environment.api?.active || false;

    changeTemplate = false;

    quota?: StorageEstimate;

    private listener = Subscriptions.instance();

    constructor(
        private readonly dbservice: DBService,
        private readonly userService: APIUserService,
        private readonly router: Router,
        private readonly translate: TranslateService,
        private readonly messageService: MessageService,
        private readonly globalService: GlobalService,
        private readonly logger: Logger,
    ) {
        this.showList();

        this.listener.push(
            this.globalService.onUpdateList.subscribe(() => {
                this.showList();
            }),
        );
    }

    updateFilter(filterInput: HTMLInputElement, filter: string = '') {
        this.filter = filter;
        setTimeout(() => {
            filterInput.dispatchEvent(new InputEvent('input'));
            filterInput.focus();
        });
    }

    sortableFilter = (key: string, item: FormatedInfos, _index: number): boolean => {
        return (
            (!key.startsWith('#') && Utils.normalizeString(item.options.title).includes(Utils.normalizeString(key))) ||
            (key.startsWith('#') &&
                item.options.tags?.map(e => `#${Utils.normalizeString(e)}`).includes(`${Utils.normalizeString(key)}`))
        );
    };

    tagClick(event: string, filterInput: HTMLInputElement) {
        this.updateFilter(filterInput, `#${event}`);
    }

    ngOnInit() {
        if (this.modeApi && this.userService.logged) {
            if (this.pageMode) {
                this.router.navigate(['/user/lists/browser']);
            } else {
                // list of server ranking
                this.userService.user!.classements?.forEach(e => {
                    if (e.rankingId) {
                        this.serverIds.push(e.rankingId);
                    }
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.listener.clear();
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
                        linkId: info.infos.linkId,
                        // data
                        groups: info.data.groups,
                        list: info.data.list,
                        dateCreate: Utils.toISODate(info.infos.dateCreate || info.infos.data),
                        dateChange: Utils.toISODate(info.infos.dateChange),
                    });
                });
            }

            Utils.downloadFile(JSON.stringify(list), 'classements.json', 'text/plain');
        });
    }

    showList() {
        this.dbservice.getLocalList().then(result => {
            this.result = result;
            this.sortableDirective.sortLines();

            navigator.storage.estimate().then(quota => {
                this.quota = quota;
            });
        });
    }

    delete(item: FormatedInfos) {
        this.dialogDelete.open();
        this.itemCurrent = item;
    }

    clone(item: FormatedInfos) {
        this.dialogClone.open();
        this.itemCurrent = item;
        this.changeTemplate = false;
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
            this.dbservice.clone(this.itemCurrent, value || '', this.changeTemplate).then(item => {
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
                    this.sortableDirective.sortLines();
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
                            this.sortableDirective.sortLines();
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
}
