export interface Message<T> {
    code: number;
    message: T;
    status: 'OK';
}

export interface MessageError {
    code: number;
    errorCode: number;
    errorMessage: string;
    status: 'KO';
}

export interface Login {
    user: string;
    token: string;
}
