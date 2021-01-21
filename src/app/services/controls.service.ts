import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    generateRandomField,
    generateRandomFunctionArgs,
    generateRandomOthersForm,
    randomFieldMaximum,
    randomXZero,
} from '../utils/random';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BehaviorSubject,
    combineLatest,
    Observable,
    race,
    Subscription,
} from 'rxjs';
import {
    betweenValidator,
    BoundsValidator,
    minMaxRangeValidator,
} from '../utils/validators';
import { debounceTime, filter, skip, take, tap } from 'rxjs/operators';
import {
    IFunctionArgs,
    IInterpolationArgs,
    IWindowFrame,
} from '../models/types/coefficientTypes';

@Injectable({
    providedIn: 'root',
})
export class ControlsService implements OnDestroy {
    public functionArgsForm = this.fb.group({
        alpha: ['', [Validators.required, minMaxRangeValidator(-100, 100)]],
        beta: ['', [Validators.required, minMaxRangeValidator(-100, 100)]],
        gamma: ['', [Validators.required, minMaxRangeValidator(-100, 100)]],
        delta: ['', [Validators.required, minMaxRangeValidator(-100, 100)]],
        epsilon: { value: '', disabled: true },
    });
    public windowFrameForm = this.fb.group({
        windowA: ['', [Validators.required]],
        windowB: ['', [Validators.required]],
        windowC: ['', [Validators.required]],
        windowD: ['', [Validators.required]],
    });
    public interpolationForm = this.fb.group({
        XZero: [''],
        n: ['', [Validators.required, minMaxRangeValidator(1, 500)]],
        m: ['', [Validators.required, minMaxRangeValidator(1, 500)]],
        p: ['', [Validators.required, minMaxRangeValidator(0, 25)]],
    });

    private masterSub = new Subscription();
    // tslint:disable-next-line:variable-name
    private _functionArgs = new BehaviorSubject<IFunctionArgs>(undefined);
    public functionArgs$: Observable<IFunctionArgs> = this._functionArgs.pipe(
        filter(x => !!x),
    );
    // tslint:disable-next-line:variable-name
    private _windowFrame = new BehaviorSubject<IWindowFrame>(undefined);
    public windowFrame$: Observable<IWindowFrame> = this._windowFrame.pipe(
        filter(x => !!x),
    );

    // tslint:disable-next-line:variable-name
    private _interpolationArgs = new BehaviorSubject<IInterpolationArgs>(
        undefined,
    );
    public interpolationArgs$: Observable<IInterpolationArgs> = this._interpolationArgs.pipe(
        filter(x => !!x),
    );

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.functionArgsForm.patchValue(generateRandomFunctionArgs(), {
            emitEvent: false,
        });
        this.functionArgsForm.markAllAsTouched();
        this.initFrameForm();
        this.initOthersForm();
        this.createUpdateParamsSubscription();
        this.resolveQuery();
    }

    private initFrameForm() {
        this.windowFrameForm.patchValue(generateRandomField(), {
            emitEvent: false,
        });
        this.windowFrameForm.controls.windowA.setAsyncValidators([
            BoundsValidator.createValidator(
                this.windowFrameForm,
                'windowB',
                true,
            ),
        ]);
        this.windowFrameForm.controls.windowB.setAsyncValidators([
            BoundsValidator.createValidator(
                this.windowFrameForm,
                'windowA',
                false,
            ),
        ]);
        this.windowFrameForm.controls.windowC.setAsyncValidators([
            BoundsValidator.createValidator(
                this.windowFrameForm,
                'windowD',
                true,
            ),
        ]);
        this.windowFrameForm.controls.windowD.setAsyncValidators([
            BoundsValidator.createValidator(
                this.windowFrameForm,
                'windowC',
                false,
            ),
        ]);
        this.windowFrameForm.updateValueAndValidity();
        this.masterSub.add(
            combineLatest([
                this.windowFrameForm.controls.windowA.valueChanges,
            ]).subscribe(),
        );
        this.windowFrameForm.markAllAsTouched();
    }

    private initOthersForm() {
        this.interpolationForm.patchValue(
            generateRandomOthersForm(
                this.windowFrameForm.getRawValue().windowC,
                this.windowFrameForm.getRawValue().windowD,
            ),
            { emitEvent: false },
        );
        this.masterSub.add(
            combineLatest([
                this.windowFrameForm.controls.windowC.valueChanges,
                this.windowFrameForm.controls.windowD.valueChanges,
            ])
                .pipe(debounceTime(1))
                .subscribe(() => {
                    this.setZXeroValidators();
                }),
        );
        this.setZXeroValidators();
        this.interpolationForm.markAllAsTouched();
    }

    private setZXeroValidators() {
        this.interpolationForm.controls.XZero.setValidators([
            betweenValidator(
                this.windowFrameForm.controls.windowC.value,
                this.windowFrameForm.controls.windowD.value,
            ),
            Validators.required,
        ]);
        this.interpolationForm.controls.XZero.updateValueAndValidity();
    }

    ngOnDestroy(): void {
        this.masterSub.unsubscribe();
    }

    createUpdateParamsSubscription() {
        this.masterSub.add(
            race([
                this.functionArgsForm.valueChanges,
                this.windowFrameForm.valueChanges,
                this.interpolationForm.valueChanges,
            ])
                .pipe(debounceTime(1), skip(1))
                .subscribe(() => this.updateParams()),
        );
    }

    updateParams() {
        if (
            this.windowFrameForm.valid &&
            this.interpolationForm.valid &&
            this.functionArgsForm.valid
        ) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: Object.assign(
                    this.functionArgsForm.getRawValue(),
                    this.interpolationForm.getRawValue(),
                    this.windowFrameForm.getRawValue(),
                ),
            });
            this._functionArgs.next(this.functionArgsForm.getRawValue());
            this._interpolationArgs.next(this.interpolationForm.getRawValue());
            this._windowFrame.next(this.windowFrameForm.getRawValue());
        }
    }

    resolveQuery(): void {
        this.route.queryParams.pipe(skip(1), take(1)).subscribe(x => {
            Object.keys(x).length
                ? this.updateFormsValuesFromQuery(x)
                : this.updateParams();
        });
    }

    private updateFormsValuesFromQuery(params: any) {
        this.functionArgsForm.patchValue(params);
        this.windowFrameForm.patchValue(params);
        this.interpolationForm.patchValue(params);
        setTimeout(() => this.updateParams(), 10);
    }

    public randomizeFunctionArgs() {
        this.functionArgsForm.patchValue(generateRandomFunctionArgs());
        this.updateParams();
    }

    public randomizeWindowFrame() {
        const values = generateRandomField();
        this.windowFrameForm.patchValue(values);
        this.performXZeroCheck();
        this.updateParams();
    }

    public performXZeroCheck() {
        let currentXZero = this.interpolationForm.getRawValue().XZero;
        const values = this.windowFrameForm.getRawValue();
        if (isNaN(currentXZero)) {
            currentXZero = randomXZero(+values.windowC, +values.windowD);
        }
        if (+values.windowC > currentXZero || +values.windowD < currentXZero) {
            this.interpolationForm.controls.XZero.patchValue(
                randomXZero(+values.windowC, +values.windowD),
                { emitEvent: false },
            );
            this.interpolationForm.controls.XZero.updateValueAndValidity();
            this.updateParams();
        }
    }

    public randomizeOtherArgs() {
        this.interpolationForm.patchValue(
            generateRandomOthersForm(
                +this.windowFrameForm.getRawValue().windowC,
                +this.windowFrameForm.getRawValue().windowD,
            ),
        );
        this.updateParams();
    }

    public randomize(form: FormGroup, field, fn) {
        let newVal;
        switch (field) {
            case 'windowA':
                newVal = fn();
                if (newVal > +form.getRawValue().windowB) {
                    form.controls.windowB.patchValue(
                        randomFieldMaximum(newVal),
                        { emitEvent: false },
                    );
                }
                form.controls.windowA.patchValue(newVal, {
                    emitEvent: false,
                });
                break;
            case 'windowB':
                newVal = fn(+form.getRawValue().windowA);
                form.controls.windowB.patchValue(randomFieldMaximum(newVal));
                break;
            case 'windowC':
                newVal = fn();
                form.controls.windowC.patchValue(newVal, { emitEvent: false });
                if (newVal > +form.getRawValue().windowD) {
                    form.controls.windowD.patchValue(
                        randomFieldMaximum(newVal),
                        { emitEvent: false },
                    );
                }
                this.performXZeroCheck();
                break;
            case 'windowD':
                newVal = fn(+form.getRawValue().windowC);
                form.controls.windowD.patchValue(randomFieldMaximum(newVal));
                this.performXZeroCheck();
                break;
            case 'XZero':
                this.interpolationForm.controls.XZero.patchValue(
                    fn(
                        +this.windowFrameForm.getRawValue().windowC,
                        +this.windowFrameForm.getRawValue().windowD,
                    ),
                    { emitEvent: false },
                );
                break;
            default:
                try {
                    form.controls[field].patchValue(fn(), { emitEvent: false });
                } catch (e) {
                    console.error(
                        `an error occured while randomizing ${field} control on ${form} group with ${fn}`,
                    );
                }
        }
        this.updateParams();
    }
}
