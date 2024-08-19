import { Subscription } from 'rxjs';

export class Subscriptions {
    private listener = new Subscription();

    public static instance() {
        return new Subscriptions();
    }

    private constructor() {}

    push(...list: Subscription[]) {
        list.forEach(sub => this.listener.add(sub));
    }

    clear() {
        this.listener.unsubscribe();
    }
}
