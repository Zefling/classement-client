import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    inject,
    viewChild,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputRadio,
    MagmaInputSelect,
    MagmaInputText,
    randomNumber,
    ulrToBase64,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Theme } from '../../../interface/interface';
import { Genres } from '../../../interface/movie';
import { APIAnilistService, AniListMedia } from '../../../services/api.anilist.service';
import { GlobalService, TypeFile } from '../../../services/global.service';
import { PreferencesService } from '../../../services/preferences.service';

@Component({
    selector: 'external-anilist',
    templateUrl: './external.anilist.component.html',
    styleUrls: ['./external.anilist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MagmaDialog,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputCheckbox,
        MagmaInputRadio,
        MagmaInputSelect,
        FormsModule,
        ReactiveFormsModule,
        TranslocoPipe,
        MagmaInputSelect,
    ],
})
export class ExternalAnilistComponent {
    private readonly anilist = inject(APIAnilistService);
    private readonly prefs = inject(PreferencesService);
    private readonly globalService = inject(GlobalService);
    protected readonly cd = inject(ChangeDetectorRef);

    dialog = viewChild.required<MagmaDialog>(MagmaDialog);

    @Output()
    change = new EventEmitter<Theme>();

    searchAnilistForm?: FormGroup;

    genres?: Genres;

    results?: AniListMedia[];

    withTitle = false;
    withYear = false;
    titleSource = 'english';
    include = [''];

    get keyApi() {
        return this.prefs.preferences.authApiKeys.tmdb;
    }

    get baseImg() {
        return this.anilist.baseImg;
    }

    constructor() {
        this.searchAnilistForm = new FormGroup({
            query: new FormControl(''),
            type: new FormControl('ANIME'),
        });
    }

    async search() {
        if (this.searchAnilistForm!.value?.query?.trim()) {
            const data = await this.anilist.search({ ...this.searchAnilistForm!.value, pageSize: 12 });
            this.results = data.data.Page.media?.length ? data.data.Page.media : [];
            this.cd.markForCheck();
        }
    }

    async addTile(ani: AniListMedia) {
        if (!ani.disabled) {
            const image = (await ulrToBase64(this.baseImg + ani.coverImage?.extraLarge)) as string;
            this.globalService.onFileLoaded.next({
                filter: TypeFile.image,
                file: {
                    id: `tile-${randomNumber()}`,
                    title:
                        (this.withTitle
                            ? this.titleSource === 'english'
                                ? ani.title.english || ani.title.romaji
                                : this.titleSource === 'romaji'
                                  ? ani.title.romaji || ani.title.english
                                  : ani.title.native || ani.title.romaji || ani.title.english
                            : '') +
                        (this.withYear && this.withTitle
                            ? ' (' + new Date(ani.startDate.year).getFullYear() + ')'
                            : ''),
                    annotation: this.include?.length
                        ? this.include
                              .map(e => (ani.title as any)[e])
                              .filter(e => e)
                              .join('\n')
                        : '',
                    name: '',
                    url: image,
                    size: image.length,
                    type: 'image/jpeg',
                    realSize: image.length,
                    date: 0,
                },
                add: {
                    title: this.withTitle,
                    annotation: (this.include?.length || 0) > 0,
                },
            });

            ani.disabled = true;
            this.cd.markForCheck();
        }
    }

    open() {
        this.dialog().open();
    }

    close() {
        this.dialog().close();
    }
}
