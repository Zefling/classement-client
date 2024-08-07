import { Component, EventEmitter, Output, viewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Select2Data, Select2Option } from 'ng-select2-component';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Theme } from 'src/app/interface/interface';
import { Genres, MovieSearch } from 'src/app/interface/movie';
import { APIImdbService } from 'src/app/services/api.imdb.service';
import { GlobalService, TypeFile } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'external-imdb',
    templateUrl: './external.imdb.component.html',
    styleUrls: ['./external.imdb.component.scss'],
})
export class ExternalImdbComponent {
    dialog = viewChild.required<DialogComponent>(DialogComponent);

    @Output()
    change = new EventEmitter<Theme>();

    searchMovieForm: FormGroup;

    genres?: Genres;

    results?: MovieSearch[];

    withTitle = false;
    withYear = false;

    languages?: Select2Data;

    get keyApi() {
        return this.prefs.preferences.authApiKeys.imdb;
    }

    get baseImg() {
        return this.imdb.baseImg;
    }

    constructor(
        private readonly imdb: APIImdbService,
        private readonly prefs: PreferencesService,
        private readonly globalService: GlobalService,
    ) {
        let language = 'en-US';
        if ((this.prefs.preferences.interfaceLanguage = 'fr')) {
            language = 'fr-FR';
        } else if ((this.prefs.preferences.interfaceLanguage = 'ja')) {
            language = 'ja-JP';
        }

        this.searchMovieForm = new FormGroup({
            query: new FormControl(''),
            include_adult: new FormControl(''),
            language: new FormControl(language),
            primary_release_year: new FormControl(''),
            year: new FormControl(''),
            region: new FormControl(''),
        });

        this.imdb
            .acceptedLanguages()
            .then(list => (this.languages = list.map<Select2Option>(e => ({ label: e, value: e }))));
    }

    async search() {
        if (this.searchMovieForm.value?.query?.trim()) {
            const page = await this.imdb.searchMovies({ ...this.searchMovieForm.value, page: 1 });
            this.results = page.results?.length ? page.results : [];
        }
    }

    async addTile(movie: MovieSearch) {
        if (!movie.disabled) {
            const image = (await Utils.ulrToBase64(this.baseImg + movie.poster_path)) as string;

            this.globalService.onFileLoaded.next({
                filter: TypeFile.image,
                file: {
                    title:
                        (this.withTitle ? movie.title : '') +
                        (this.withYear ? ' (' + new Date(movie.release_date).getFullYear() + ')' : ''),
                    name: '',
                    url: image,
                    size: image.length,
                    type: 'image/jpeg',
                    realSize: image.length,
                    date: 0,
                },
            });

            movie.disabled = true;
        }
    }

    open() {
        this.dialog().open();
    }

    close() {
        this.dialog().close();
    }
}
