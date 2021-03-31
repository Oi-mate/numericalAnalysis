import {Injectable, OnDestroy} from '@angular/core';
import {ControlsService} from './controls.service';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {IFunctionArgs, IInterpolationArgs, IWindowFrame} from '../models/types/coefficientTypes';
import {MAIN_FUNCTION_VALUE} from '../models/maths/MAIN_FUNCTION';
import {debounceTime, filter} from 'rxjs/operators';
import {EqParameters, ValuesToNumber} from '../utils/form-utils';

@Injectable({
    providedIn: 'root',
})
export class WorkspaceService implements OnDestroy {
    private masterSub = new Subscription();
    private args: IFunctionArgs;
    private frame: IWindowFrame;

    private originLine = new BehaviorSubject<[number, number][]>(undefined);
    originLine$ = this.originLine.pipe(filter(x => !!x?.length));

    private interpolatedLine = new BehaviorSubject<[number, number][]>(undefined);
    interpolatedLine$ = this.interpolatedLine.pipe(filter(x => !!x?.length));

    constructor(private controls: ControlsService) {
        this.createMainSub();
    }

    ngOnDestroy(): void {
        this.masterSub.unsubscribe();
    }

    private createMainSub() {
        combineLatest([
          this.controls.functionArgs$,
          this.controls.windowFrame$,
          this.controls.interpolationArgs$,
          this.controls.steps$
        ])
            .pipe(debounceTime(1))
            .subscribe(([args, frame, interpolation, steps]) => {
                this.args = args as IFunctionArgs;
                this.frame = (ValuesToNumber(frame) as IWindowFrame);
                this.createOriginLine(this.args, this.frame, interpolation, steps);
            });
    }

    private createOriginLine(args: IFunctionArgs, frame: IWindowFrame, interpolation: IInterpolationArgs, steps: number) {
        console.log(args, frame, interpolation, args.chosenParam === EqParameters.alpha);
        const origin = [];
        const interpolated = [];
        const fx = (yo, x) => MAIN_FUNCTION_VALUE(
          args.chosenParam === EqParameters.alpha ? x : args.alpha,
          args.chosenParam === EqParameters.beta ? x : args.beta,
          args.chosenParam === EqParameters.gamma ? x : args.gamma,
          args.chosenParam === EqParameters.delta ? x : args.delta,
          args.chosenParam === EqParameters.epsilon ? x : args.epsilon,
          yo,
        );
        for (let x = frame.windowA; x < frame.windowB; x += steps) {

                let y = +interpolation.XZero;

                for (let i = 0; i < interpolation.m; i++) {
                    y = fx(y, x);
                }
                if (y > frame.windowC && y < frame.windowD) {
                    origin.push([x, y]);
                }
                for (let i = 0; i < interpolation.n; i++) {
                    y = fx(y, x);
                    if (y > frame.windowC && y < frame.windowD) {
                        if (i % (+interpolation.p) === 0) {
                            interpolated.push([x, y]);
                        }
                    }
                }
        }
        this.originLine.next(origin);
        this.interpolatedLine.next(interpolated);
    }
}
