import {Injectable, OnDestroy} from '@angular/core';
import {ControlsService} from './controls.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {IFunctionArgs} from '../models/types/coefficientTypes';
import {MAIN_FUNCTION_VALUE} from '../models/maths/MAIN_FUNCTION';
import {filter} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class WorkspaceService implements OnDestroy {

    private masterSub = new Subscription();
    res = new BehaviorSubject(undefined);
    res$ = this.res.pipe(filter(x => !!x));

    constructor(private controls: ControlsService) {
        this.createMainSub();
    }

    ngOnDestroy(): void {
        this.masterSub.unsubscribe();
    }

    private createMainSub() {
        this.controls.functionArgs$.subscribe(args => {
            this.createLine(args);
        });
    }

    private createLine(args: IFunctionArgs) {
        const res = [];
        for (let x = 0;x < 10;x += 0.01) {
            res.push([x, MAIN_FUNCTION_VALUE(args.alpha, args.beta, args.gamma, args.delta, args.epsilon, x)]);
        }
        this.res.next(res);
    }
}
