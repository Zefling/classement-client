import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, booleanAttribute, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';

import { MarkdownModule } from 'ngx-markdown';

import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';

import { Classement, ClassementVotes } from '../../interface/interface';
import { TagListComponent } from '../tag-list/tag-list.component';

const emojiList = ['👍', '👎', '😂', '😍', '😎', ' 😱', '🤢', '🥵', '💩'];
type VoteResult = { emoji: string; selected: boolean; total: number }[];

@Component({
    selector: 'classement-infos',
    templateUrl: './classement-infos.component.html',
    styleUrls: ['./classement-infos.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoPipe, MarkdownModule, RouterLink, TagListComponent, DatePipe],
})
export class ClassementInfosComponent implements OnInit {
    protected readonly userService = inject(APIUserService);
    protected readonly api = inject(APIClassementService);

    classementInfo = input.required<Classement>();
    readonly = input(false, { transform: booleanAttribute });

    votes = signal<VoteResult>([]);
    viewCount = signal(0);

    get logged() {
        return this.userService.logged;
    }

    ngOnInit(): void {
        this.viewCount.set(this.classementInfo().viewCount ?? 0);
        this.api.getClassementVotes(this.classementInfo().rankingId).then(votes => {
            this.listVote(votes);
        });
        this.api.getClassementViews(this.classementInfo().rankingId).then(view => {
            this.viewCount.set(view.viewCount);
        });
    }

    async updateVote(emoji: string) {
        const vote = this.votes().find(e => e.emoji === emoji);
        if (vote) {
            vote.selected = !vote.selected;
        }
        const result = await this.api.updateClassementVote(
            this.classementInfo().rankingId,
            this.votes()
                .filter(e => e.selected)
                .map(e => e.emoji),
        );
        if (result.votes) {
            this.listVote(result);
        }
    }

    private listVote(votes: ClassementVotes) {
        const list: VoteResult = [];
        for (const emoji of emojiList) {
            list.push({
                emoji,
                total: votes.votes[emoji] ?? 0,
                selected: votes.userVotes.includes(emoji),
            });
        }
        this.votes.set(list);
    }
}
