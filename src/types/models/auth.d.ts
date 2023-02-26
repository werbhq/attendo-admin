import type { Protocol } from 'puppeteer';
import type { Credentials as Token } from 'google-auth-library/build/src/auth/credentials';

export interface Cookie {
    cookie: Protocol.Network.Cookie[];
    createdTime: string;
    time: string;
}

export interface AuthDoc {
    cookie: Cookie;
    token: Token;
}
