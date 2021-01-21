import { Injectable, OnDestroy } from '@angular/core';
import { ControlsService } from './controls.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { IFunctionArgs, IWindowFrame } from '../models/types/coefficientTypes';
import { MAIN_FUNCTION_VALUE } from '../models/maths/MAIN_FUNCTION';
import { debounceTime, filter } from 'rxjs/operators';

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
        combineLatest([this.controls.functionArgs$, this.controls.windowFrame$])
            .pipe(debounceTime(1))
            .subscribe(([args, frame]) => {
                console.log(args, frame);
                this.createLine(args, frame);
            });
    }

    private createLine(args: IFunctionArgs, frame: IWindowFrame) {
        const res = [];
        // console.log(7.50, MAIN_FUNCTION_VALUE(args.alpha, args.beta, args.gamma, args.delta, args.epsilon, 7.50));
        // console.log(7.51, MAIN_FUNCTION_VALUE(args.alpha, args.beta, args.gamma, args.delta, args.epsilon, 7.51));
        // console.log(7.52, MAIN_FUNCTION_VALUE(args.alpha, args.beta, args.gamma, args.delta, args.epsilon, 7.52));
        // console.log(7.53, MAIN_FUNCTION_VALUE(args.alpha, args.beta, args.gamma, args.delta, args.epsilon, 7.53));
        // console.log(7.54, MAIN_FUNCTION_VALUE(args.alpha, args.beta, args.gamma, args.delta, args.epsilon, 7.54));
        const res2 = [];
        for (let x = -10; x < 10; x += 0.01) {
            res.push([
                x,
                MAIN_FUNCTION_VALUE(
                    args.alpha,
                    args.beta,
                    args.gamma,
                    args.delta,
                    args.epsilon,
                    x,
                ),
            ]);
        }
        for (let x = -10; x < 10; x += 0.1) {
            res2.push([
                +x.toFixed(2),
                MAIN_FUNCTION_VALUE(
                    args.alpha,
                    args.beta,
                    args.gamma,
                    args.delta,
                    args.epsilon,
                    +x.toFixed(2),
                ),
            ]);
        }
        console.log(
            res,
            res2,
            res2.find(x => x[0] === 5.7),
            res.find(x => x[0] === 5.7),
        );
        this.res.next(res);
    }
}
