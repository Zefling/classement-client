import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Anime } from 'src/app/interface/anime';
import { Theme } from 'src/app/interface/interface';
import { APIMalService } from 'src/app/services/api.mal.service';
import { GlobalService, TypeFile } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'external-mal',
    templateUrl: './external.mal.component.html',
    styleUrls: ['./external.mal.component.scss'],
})
export class ExternalMalComponent {
    @ViewChild(DialogComponent) dialog!: DialogComponent;

    @Output()
    change = new EventEmitter<Theme>();

    searchAnimeForm: FormGroup;

    results?: Anime[];

    withTitle = false;
    withYear = false;

    get keyApi() {
        return this.prefs.preferences.authApiKeys.mal;
    }

    constructor(
        private readonly mal: APIMalService,
        private readonly prefs: PreferencesService,
        private readonly globalService: GlobalService,
    ) {
        this.searchAnimeForm = new FormGroup({
            q: new FormControl(''),
        });
    }

    async search() {
        if (this.searchAnimeForm.value?.q?.trim()) {
            const page = await this.mal.searchAnime({ ...this.searchAnimeForm.value, limit: 16 });
            this.results = page.data?.node?.length ? page.data.node : [];
        }
    }

    async addTile(anime: Anime) {
        if (!anime.disabled) {
            const image = (await Utils.ulrToBase64(anime.main_picture.medium)) as string;

            this.globalService.onFileLoaded.next({
                filter: TypeFile.image,
                file: {
                    title:
                        (this.withTitle ? anime.title : '') +
                        (this.withYear ? ' (' + new Date(anime.start_season.year).getFullYear() + ')' : ''),
                    name: '',
                    url: image,
                    size: image.length,
                    type: 'image/jpeg',
                    realSize: 0,
                    date: 0,
                },
            });

            anime.disabled = true;
        }
    }

    open() {
        this.dialog.open();
    }

    close() {
        this.dialog.close();
    }
}
