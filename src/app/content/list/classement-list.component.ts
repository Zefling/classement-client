import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, booleanAttribute, computed, inject, input, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Data, Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaMessage,
    MagmaSortableDirective,
    MagmaSortableModule,
    MagmaTableModule,
    MagmaTooltipDirective,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ImportJsonEvent } from 'src/app/components/import-json/import-json.component';
import { FormattedInfos } from 'src/app/interface/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Logger } from 'src/app/services/logger';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { ImportJsonComponent } from '../../components/import-json/import-json.component';
import { TagListComponent } from '../../components/tag-list/tag-list.component';
import { FileSizePipe } from '../../pipes/file-size';

@Component({
    selector: 'classement-list',
    templateUrl: './classement-list.component.html',
    styleUrls: ['./classement-list.component.scss'],
    host: {
        '[class.page]': 'pageMode()',
    },
    imports: [
        FormsModule,
        TagListComponent,
        RouterLink,
        RouterLinkActive,
        ImportJsonComponent,
        DatePipe,
        TranslocoPipe,
        FileSizePipe,
        MagmaTooltipDirective,
        MagmaSortableModule,
        MagmaDialog,
        MagmaTableModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
    ],
})
export class ClassementListComponent implements OnInit, OnDestroy {
    private readonly dbService = inject(DBService);
    private readonly userService = inject(APIUserService);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslocoService);
    private readonly mgMessage = inject(MagmaMessage);
    private readonly global = inject(GlobalService);
    private readonly logger = inject(Logger);

    // input

    pageMode = input<boolean, any>(true, { transform: booleanAttribute });

    // viewChild

    dialogDelete = viewChild.required<MagmaDialog>('dialogDelete');
    dialogClone = viewChild.required<MagmaDialog>('dialogClone');
    dialogImport = viewChild.required<MagmaDialog>('dialogImport');
    sortableDirective = viewChild.required(MagmaSortableDirective);

    filter = '';

    result!: FormattedInfos[];

    itemCurrent?: FormattedInfos;

    serverIds: string[] = [];

    modeApi = computed(() => this.global.withApi());

    changeTemplate = false;

    quota?: StorageEstimate;

    private listener = Subscriptions.instance();

    translateSort = (value: string) => this.translate.translate(value);

    constructor() {
        this.updateTitle();
        this.showList();

        this.listener.push(
            this.global.onUpdateList.subscribe(() => {
                this.showList();
            }),
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.list');
    }

    updateFilter(filterInput: MagmaInputText, filter: string = '') {
        this.filter = filter;
        setTimeout(() => {
            //  filterInput.dispatchEvent(new InputEvent('input'));
            filterInput.focus(true);
        });
    }

    sortableFilter = (key: string, item: FormattedInfos, _index: number): boolean => {
        return (
            (!key.startsWith('#') &&
                Utils.normalizeString(item.options.title || this.translate.translate('list.title.undefined')).includes(
                    Utils.normalizeString(key),
                )) ||
            (key.startsWith('#') &&
                item.options.tags?.map(e => `#${Utils.normalizeString(e)}`).includes(`${Utils.normalizeString(key)}`))
        );
    };

    tagClick(event: string, filterInput: MagmaInputText) {
        this.updateFilter(filterInput, `#${event}`);
    }

    ngOnInit() {
        if (this.modeApi() && this.userService.logged) {
            if (this.pageMode()) {
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
        this.dbService.getLocalData().then(result => {
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
        this.dbService.getLocalList().then(result => {
            this.result = result;
            this.sortableDirective().sortLines();

            navigator.storage.estimate().then(quota => {
                this.quota = quota;
            });
        });
    }

    delete(item: FormattedInfos) {
        this.dialogDelete().open();
        this.itemCurrent = item;
    }

    clone(item: FormattedInfos) {
        this.dialogClone().open();
        this.itemCurrent = item;
        this.changeTemplate = false;
    }

    deleteCurrent(action: boolean) {
        if (!action) {
            this.logger.log(`Not remove line: ${this.itemCurrent?.id}`);
            this.itemCurrent = undefined;
            this.dialogDelete().close();
        } else if (this.itemCurrent?.id) {
            this.dbService.delete(this.itemCurrent.id).then(() => {
                this.logger.log(`Remove line: ${this.itemCurrent?.id}`);
                this.result.splice(this.result.indexOf(this.itemCurrent as FormattedInfos), 1);
                this.mgMessage.addMessage(
                    this.translate
                        .translate('message.remove.success')
                        .replace('%title%', this._getTitle(this.itemCurrent!)),
                );
                this.itemCurrent = undefined;
                this.dialogDelete().close();
            });
        }
    }

    cloneCurrent(action: boolean, value?: string, edit: boolean = false) {
        if (!action) {
            this.logger.log(`Not clone line: ${this.itemCurrent?.id}`);
            this.itemCurrent = undefined;
            this.dialogClone().close();
        } else if (this.itemCurrent?.id) {
            this.dbService.clone(this.itemCurrent, value || '', this.changeTemplate).then(item => {
                this.logger.log(`Clone line: ${this.itemCurrent?.id} - ${item.id}`);

                this.mgMessage.addMessage(
                    this.translate
                        .translate('message.clone.success')
                        .replace('%title%', this._getTitle(this.itemCurrent!)),
                );
                this.itemCurrent = undefined;
                this.dialogClone().close();
                if (edit) {
                    this.router.navigate(['/edit/' + item.id]);
                } else {
                    this.result.push(item);
                    this.sortableDirective().sortLines();
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

                this.dbService
                    .saveLocal(event.data!)
                    .then(item => {
                        this.logger.log(`Add line: ${event.data?.id} - ${item.infos.id}`);

                        this.mgMessage.addMessage(
                            this.translate
                                .translate('message.add.success')
                                .replace('%title%', this._getTitle(this.itemCurrent!)),
                        );
                        this.itemCurrent = undefined;
                        this.dialogClone().close();
                        const index = this.result.findIndex(e => e.id === item.infos.id);
                        if (index === -1) {
                            this.result.push(item.infos);
                            this.sortableDirective().sortLines();
                        } else {
                            this.result[index] = item.infos;
                        }
                    })
                    .catch(() => {
                        this.mgMessage.addMessage(this.translate.translate('message.add.error'));
                    });
                break;
        }
        this.dialogImport().close();
    }

    private _getTitle(info: FormattedInfos) {
        return info?.options?.title.trim() || this.translate.translate('list.title.undefined');
    }
}
