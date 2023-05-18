import { Subscription } from 'rxjs';

export class Subscriptions {
    private listener: Subscription[] = [];

    public static instance() {
        return new Subscriptions();
    }

    private constructor() {}

    push(...list: Subscription[]) {
        this.listener.push(...list);
    }

    clear() {
        this.listener.forEach(e => e.unsubscribe());
    }
}
