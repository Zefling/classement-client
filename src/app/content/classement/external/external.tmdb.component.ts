import { DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    inject,
    output,
    viewChild,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    isEmpty,
    randomNumber,
    ulrToBase64,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Select2Data, Select2Option } from 'ng-select2-component';

import { Genres, MovieSearch } from 'src/app/interface/movie';
import { APITmdbService } from 'src/app/services/api.tmdb.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService, TypeFile } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'external-tmdb',
    templateUrl: './external.tmdb.component.html',
    styleUrls: ['./external.tmdb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MagmaDialog,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputCheckbox,
        MagmaInputSelect,
        FormsModule,
        ReactiveFormsModule,
        DatePipe,
        TranslocoPipe,
    ],
})
export class ExternalTmdbComponent implements OnInit, OnDestroy {
    private readonly tmdb = inject(APITmdbService);
    private readonly user = inject(APIUserService);
    private readonly prefs = inject(PreferencesService);
    private readonly globalService = inject(GlobalService);
    private readonly cd = inject(ChangeDetectorRef);

    readonly change = output<void>();

    dialog = viewChild.required<MagmaDialog>(MagmaDialog);

    searchMovieForm?: FormGroup;

    genres?: Genres;

    results?: MovieSearch[];

    withTitle = false;
    withYear = false;

    languages?: Select2Data;

    get keyApi() {
        return this.prefs.preferences.authApiKeys.tmdb;
    }

    get baseImg() {
        return this.tmdb.baseImg;
    }

    private _sub = Subscriptions.instance();

    constructor() {
        let language = 'en-US';
        if ((this.prefs.preferences.interfaceLanguage = 'fr')) {
            language = 'fr-FR';
        } else if ((this.prefs.preferences.interfaceLanguage = 'ja')) {
            language = 'ja-JP';
        } else if ((this.prefs.preferences.interfaceLanguage = 'ar')) {
            language = 'ar';
        }

        this.searchMovieForm = new FormGroup({
            query: new FormControl(''),
            include_adult: new FormControl(''),
            language: new FormControl(language),
            primary_release_year: new FormControl(''),
            year: new FormControl(''),
            region: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this.init();
        this._sub.push(
            this.prefs.onInit.subscribe(() => {
                this.init();
            }),
            this.prefs.onChange.subscribe(() => {
                this.init();
            }),
        );
    }

    ngOnDestroy(): void {
        this._sub.clear();
    }

    async init() {
        if (this.user.logged) {
            await this.loadServer();
        } else if (this.prefs.preferences.authApiKeys.tmdb.trim()) {
            await this.loadLocal();
        }
    }

    private async loadLocal() {
        if (!this.tmdb.active) {
            const list = await this.tmdb.acceptedLanguagesServer();
            if (list) {
                this.updateLang(list);
                this.detectChange();
            }
        } else {
            this.detectChange();
        }
    }

    private async loadServer() {
        if (!this.tmdb.active) {
            const list = await this.tmdb.acceptedLanguagesServer();
            if (list) {
                this.updateLang(list);
                this.detectChange();
            } else {
                this.loadLocal();
            }
        } else {
            this.detectChange();
        }
    }

    detectChange() {
        this.cd.markForCheck();
        this.change.emit();
    }

    async search() {
        if (this.searchMovieForm!.value?.query?.trim()) {
            const page = await this.tmdb.searchMovies({ ...this.searchMovieForm!.value, page: 1 });
            this.results = page.results?.length ? page.results : [];
            this.cd.markForCheck();
        }
    }

    async addTile(movie: MovieSearch) {
        if (!movie.disabled) {
            const image = (await ulrToBase64(this.baseImg + movie.poster_path)) as string;

            this.globalService.onFileLoaded.next({
                filter: TypeFile.image,
                file: {
                    id: `tile-${randomNumber()}`,
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
            this.cd.markForCheck();
        }
    }

    open() {
        this.updateLang(this.tmdb.languageList);
        this.dialog().open();
    }

    close() {
        this.dialog().close();
    }

    private updateLang(list?: string[]) {
        if (!isEmpty(list)) {
            this.languages = list?.map<Select2Option>(e => ({ label: e, value: e }));
        }
    }
}
