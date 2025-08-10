import { Injectable, inject, signal } from '@angular/core';

import { Logger, LoggerLevel, jsonCopy } from '@ikilote/magma';

import { Md5 } from 'ts-md5';

import { ClassementEditComponent } from '../content/classement/classement-edit.component';
import { FileType, FormattedGroup, Options } from '../interface/interface';

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class MemoryService {
    private readonly logger = inject(Logger);

    hasRedo = signal(false);
    hasUndo = signal(false);

    #back: {
        options: Options;
        groups: FormattedGroup[];
        list: FileType[];
    }[] = [];

    #index = 0;
    inChange = false;

    #image: Record<string, string> = {};

    private debounceTimeout: any = undefined;

    reset() {
        this.#back = [];
        this.#image = {};
        this.#index = 0;
    }

    addUndo(parent: ClassementEditComponent, delay: number = 1000) {
        if (this.debounceTimeout) {
            this.clearTimer();
        }

        this.debounceTimeout = setTimeout(() => {
            this.addUndoAction(parent);
            this.clearTimer();
        }, delay);
    }

    undo(parent: ClassementEditComponent) {
        if (this.hasUndo()) {
            this.logger.log('undo', LoggerLevel.info, this.#index);
            this.inChange = true;
            this.#index--;
            this.change(parent);
            this.update();
            setTimeout(() => {
                this.inChange = false;
            }, 20);
        }
    }

    redo(parent: ClassementEditComponent) {
        if (this.hasRedo()) {
            this.logger.log('redo', LoggerLevel.info, this.#index);
            this.inChange = true;
            this.#index++;
            this.change(parent);
            this.update();
            setTimeout(() => {
                this.inChange = false;
            }, 20);
        }
    }

    private clearTimer() {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = undefined;
    }

    private addUndoAction(parent: ClassementEditComponent) {
        if (this.inChange) {
            return;
        }

        if (this.#index < this.#back.length - 1) {
            this.#back.splice(this.#index + 1);
        }

        const copy = {
            options: jsonCopy(parent.options),
            groups: jsonCopy(parent.groups),
            list: jsonCopy(parent.list),
        };

        // save image
        copy.list.forEach(e => this.code(e));
        (copy.list as any).id = (parent.list as any).id;
        (copy.list as any).type = (parent.list as any).type;
        copy.groups.forEach((list, index) => {
            list.list.forEach(e => this.code(e));
            (list.list as any).id = (parent.groups[index].list as any).id;
            (list.list as any).type = (parent.groups[index].list as any).type;
        });

        this.#back.push(copy);

        if (this.#back.length > 50) {
            this.#back.shift();
        }
        this.#index = this.#back.length - 1;

        this.update();

        this.logger.log('add undo', LoggerLevel.info, this.#index);
    }

    private update() {
        this.hasUndo.set(this.#index > 0);
        this.hasRedo.set(this.#index < this.#back.length - 1);
    }

    private change(parent: ClassementEditComponent) {
        const back = jsonCopy(this.#back[this.#index]);

        // save image
        back.list.forEach(e => this.decode(e));

        (back.list as any).id = (this.#back[this.#index].list as any).id;
        (back.list as any).type = (this.#back[this.#index].list as any).type;

        back.groups.forEach((list, index) => {
            list.list.forEach(e => this.decode(e));
            (list.list as any).id = (this.#back[this.#index].groups[index].list as any).id;
            (list.list as any).type = (this.#back[this.#index].groups[index].list as any).type;
        });

        parent.options = back.options;
        parent.groups = back.groups;
        parent.list = back.list;
    }

    private code(e: FileType) {
        if (e?.url?.startsWith('data:')) {
            const id = Md5.hashStr(e.url);
            if (!this.#image[id]) {
                this.#image[id] = e?.url;
            }
            e.url = `md5:${id}`;
        }
    }

    private decode(e: FileType) {
        if (e?.url?.startsWith('md5:')) {
            e.url = this.#image[e?.url.replace('md5:', '')];
        }
    }
}
