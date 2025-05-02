import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';

import { MarkdownModule } from 'ngx-markdown';

import { Classement } from '../../interface/interface';
import { TagListComponent } from '../tag-list/tag-list.component';

@Component({
    selector: 'classement-infos',
    templateUrl: './classement-infos.component.html',
    styleUrls: ['./classement-infos.component.scss'],
    imports: [TranslocoPipe, MarkdownModule, RouterLink, TagListComponent, DatePipe],
})
export class ClassementInfosComponent {
    classementInfo = input.required<Classement>();
}
