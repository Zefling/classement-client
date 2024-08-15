import { Injectable } from '@angular/core';

import { ClassementEditComponent } from '../content/classement/classement-edit.component';
import { FileType, FormattedGroup, Options } from '../interface/interface';
import { Utils } from '../tools/utils';

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class MemoryService {
    private _back: {
        options: Options;
        groups: FormattedGroup[];
        list: FileType[];
    }[] = [];

    private _index = 0;

    private _image: string[] = [];

    addUndo(parent: ClassementEditComponent) {
        if (this._index < this._back.length - 1) {
            this._back.splice(this._index + 1);
        }

        const copy = {
            options: Utils.jsonCopy(parent.options),
            groups: Utils.jsonCopy(parent.groups),
            list: Utils.jsonCopy(parent.list),
        };

        // TODO reduce RAM usage

        this._back.push(copy);

        if (this._back.length > 50) {
            this._back.shift();
        }
        this._index = this._back.length - 1;
        console.log('addUndo', this._index);
    }

    undo(parent: ClassementEditComponent) {
        this._index--;
        console.log('undo', this._index);

        const back = this._back[this._index];

        parent.options = back.options;
        parent.groups = back.groups;
        parent.list = back.list;
    }

    redo(parent: ClassementEditComponent) {
        this._index++;
        console.log('redo', this._index);

        const back = this._back[this._index];

        parent.options = back.options;
        parent.groups = back.groups;
        parent.list = back.list;
    }
}
