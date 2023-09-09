export interface Anime {
    id: number;
    title: string;
    main_picture: {
        medium: string;
        large: string;
    };
    alternate_titles: {
        synonyms: string[];
        en: string;
        ja: string;
    };
    start_date: string;
    end_date: string;
    synopsis: string;
    mean: string;
    rank: string;
    popularity: number;
    num_list_users: number;
    num_scoring_users: number;
    nsfw: 'white' | 'gray' | 'black';
    genres: { id: number; name: string }[];
    created_at: string;
    updated_at: string;
    media_type: 'unknown' | 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music';
    status: 'finished_airing' | 'currently_airing' | 'not_yet_aired';
    my_list_status: any;
    num_episodes: number;
    start_season: {
        year: number;
        season: 'winter' | 'spring' | 'summer' | 'fall';
    };
    broadcast: {
        day_of_the_week: string;
        start_time: string;
    };
    source:
        | 'other'
        | 'original'
        | 'manga'
        | '4_koma_manga'
        | 'web_manga'
        | 'digital_manga'
        | 'novel'
        | 'light_novel'
        | 'visual_novel'
        | 'game'
        | 'card_game'
        | 'book'
        | 'picture_book'
        | 'radio'
        | 'music';
    average_episode_duration: number;
    /**
     * g 	G - All Ages
     * pg 	PG - Children
     * pg_13 	pg_13 - Teens 13 and Older
     * r 	R - 17+ (violence & profanity)
     * r+ 	R+ - Profanity & Mild Nudity
     * rx 	Rx - Hentai
     */
    rating: string;
    studios: any;

    // for interface
    disabled: boolean;
}

export interface AnimeSearch {
    data: {
        node: Anime[];
    };
    paging: {
        previous: string;
        next: string;
    };
}
