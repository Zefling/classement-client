export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompanie {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
}

export interface Country {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    iso_639_1: string;
    name: string;
}

export interface MovieBookmark {
    poster_path: string;
    id: number;
    title: string;
}
export interface MovieSearch extends MovieBookmark {
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: number[];
    original_title: string;
    original_language: string;
    backdrop_path: string;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
    // for interface
    disabled: boolean;
}

export interface PageResult<T> {
    page: number;
    results: T[];
    total_results: number;
    total_pages: number;
}

export interface Movie extends MovieBookmark {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: null;
    budget: number;
    genres: Genre[];
    homepage: string;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    production_companies: ProductionCompanie[];
    production_countries: Country[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Genres {
    genres: Genre[];
}
