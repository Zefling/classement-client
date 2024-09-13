import { Injectable } from '@angular/core';

import { Md5 } from 'ts-md5';

import { ClassementEditComponent } from '../content/classement/classement-edit.component';
import { FileType, FormattedGroup, Options } from '../interface/interface';
import { Utils } from '../tools/utils';

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class MemoryService {
    hasRedo = false;
    hasUndo = false;

    #back: {
        options: Options;
        groups: FormattedGroup[];
        list: FileType[];
    }[] = [];

    #index = 0;

    #image: Record<string, string> = {};

    reset() {
        this.#back = [];
        this.#image = {};
        this.#index = 0;
    }

    addUndo(parent: ClassementEditComponent) {
        if (this.#index < this.#back.length - 1) {
            this.#back.splice(this.#index + 1);
        }

        const copy = {
            options: Utils.jsonCopy(parent.options),
            groups: Utils.jsonCopy(parent.groups),
            list: Utils.jsonCopy(parent.list),
        };

        // save image
        copy.list.forEach(e => this.code(e));
        copy.groups.forEach(list => list.list.forEach(e => this.code(e)));

        this.#back.push(copy);

        if (this.#back.length > 50) {
            this.#back.shift();
        }
        this.#index = this.#back.length - 1;

        this.update();
    }

    undo(parent: ClassementEditComponent) {
        if (this.hasUndo) {
            this.#index--;
            this.change(parent);
            this.update();
        }
    }

    redo(parent: ClassementEditComponent) {
        if (this.hasRedo) {
            this.#index++;
            this.change(parent);
            this.update();
        }
    }

    private update() {
        this.hasUndo = this.#index > 0;
        this.hasRedo = this.#index < this.#back.length - 1;
    }

    private change(parent: ClassementEditComponent) {
        const back = Utils.jsonCopy(this.#back[this.#index]);

        // save image
        back.list.forEach(e => this.decode(e));
        back.groups.forEach(list => list.list.forEach(e => this.decode(e)));

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