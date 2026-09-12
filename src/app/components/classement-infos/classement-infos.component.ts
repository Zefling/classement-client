import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, booleanAttribute, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MagmaTagList } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { MarkdownModule } from 'ngx-markdown';

import { Classement, ClassementVotes } from '../../interface/interface';
import { APIClassementService } from '../../services/api.classement.service';
import { APIUserService } from '../../services/api.user.service';

const emojiList = ['👍', '👎', '😂', '😍', '😎', ' 😱', '🤢', '🥵', '💩'];
type VoteResult = { emoji: string; selected: boolean; total: number }[];

@Component({
    selector: 'classement-infos',
    templateUrl: './classement-infos.component.html',
    styleUrls: ['./classement-infos.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoPipe, MarkdownModule, RouterLink, MagmaTagList, DatePipe],
})
export class ClassementInfosComponent implements OnInit {
    protected readonly userService = inject(APIUserService);
    protected readonly api = inject(APIClassementService);
    private readonly router = inject(Router);

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

    navigateTag(tag: string, isParent: boolean) {
        this.router.navigate(['/navigate'], { queryParams: { tag, all: isParent ? 'parent' : 'children' } });
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
