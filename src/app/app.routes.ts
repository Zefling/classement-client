import { Routes, UrlSegment } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./content/home/classement-home.routes').then(m => m.HOME_ROUTES),
    },
    {
        path: 'list',
        loadChildren: () => import('./content/list/classement-list.routes').then(m => m.LIST_ROUTES),
    },
    {
        path: 'infos',
        loadChildren: () => import('./content/infos/infos.routes').then(m => m.INFOS_ROUTES),
    },
    {
        path: 'edit',
        loadChildren: () => import('./content/classement/classement.routes').then(m => m.CLASSEMENT_ROUTES),
    },
    {
        path: 'user',
        loadChildren: () => import('./content/user/user.routes').then(m => m.USER_ROUTES),
    },
    {
        path: 'navigate',
        loadChildren: () => import('./content/navigate/classement-navigate.routes').then(m => m.NAVIGATE_ROUTES),
    },
    {
        path: 'admin',
        loadChildren: () => import('./content/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    },
    {
        matcher: url => {
            if (url.length === 0) {
                return null;
            }
            const reg = /^(?<symbol>[~])(?<id>.*)$/;
            const param = url[0].toString();
            const match = param.match(reg);
            return match
                ? { consumed: url, posParams: { id: new UrlSegment(decodeURIComponent(match['2']), {}) } }
                : null;
        },
        redirectTo: '/navigate/view/:id',
    },
    {
        matcher: url => {
            if (url.length === 0) {
                return null;
            }
            const reg = /^(?<symbol>[\@])(?<id>.*)$/;
            const param = url[0].toString();
            const match = param.match(reg);
            return match ? { consumed: url, posParams: { id: new UrlSegment(match['0'], {}) } } : null;
        },
        redirectTo: '/user/:id',
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
