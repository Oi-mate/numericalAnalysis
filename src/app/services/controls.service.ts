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
import { combineLatest, Subscription } from 'rxjs';
import {
    betweenValidator,
    boundsValidator,
    minMaxRangeValidator,
} from '../utils/validators';

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
    public windowFrameForm = this.fb.group(
        {
            windowA: ['', [Validators.required]],
            windowB: ['', [Validators.required]],
            windowC: ['', [Validators.required]],
            windowD: ['', [Validators.required]],
        },
        { validator: boundsValidator },
    );
    public othersForm = this.fb.group({
        XZero: ['', [Validators.required]],
        n: ['', [Validators.required, minMaxRangeValidator(1, 500)]],
        m: ['', [Validators.required, minMaxRangeValidator(1, 500)]],
        p: ['', [Validators.required, minMaxRangeValidator(0, 25)]],
    });

    private masterSub = new Subscription();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.functionArgsForm.patchValue(generateRandomFunctionArgs());
        this.initFrameForm();
        this.initOthersForm();
        this.resolveQuery();
        this.createUpdateLinkSubscription();
    }

    private initFrameForm() {
        this.windowFrameForm.patchValue(generateRandomField());
        this.windowFrameForm.controls.windowA.setValidators(
            boundsValidator(this.windowFrameForm, 'windowB', true),
        );
        this.windowFrameForm.controls.windowB.setValidators(
            boundsValidator(this.windowFrameForm, 'windowA', false),
        );
        this.windowFrameForm.controls.windowC.setValidators(
            boundsValidator(this.windowFrameForm, 'windowD', true),
        );
        this.windowFrameForm.controls.windowD.setValidators(
            boundsValidator(this.windowFrameForm, 'windowC', false),
        );
    }

    private initOthersForm() {
        this.othersForm.patchValue(
            generateRandomOthersForm(
                this.windowFrameForm.getRawValue().windowC,
                this.windowFrameForm.getRawValue().windowD,
            ),
        );
        this.masterSub.add(
            combineLatest([
                this.windowFrameForm.controls.windowC.valueChanges,
                this.windowFrameForm.controls.windowD.valueChanges,
            ]).subscribe(() =>
                this.othersForm.controls.XZero.setValidators([
                    betweenValidator(
                        this.windowFrameForm.controls.windowC.value,
                        this.windowFrameForm.controls.windowC.value,
                    ),
                ]),

            ),
        );
    }

    ngOnDestroy(): void {
        this.masterSub.unsubscribe();
    }

    createUpdateLinkSubscription() {
        this.masterSub.add(
            combineLatest([
                this.functionArgsForm.valueChanges,
                this.windowFrameForm.valueChanges,
                this.othersForm.valueChanges,
            ]).subscribe(() => this.updateQuery()),
        );
    }

    updateQuery() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: Object.assign(
                this.functionArgsForm.getRawValue(),
                this.othersForm.getRawValue(),
                this.windowFrameForm.getRawValue(),
            ),
        });
    }

    resolveQuery(): void {
        this.route.queryParams.subscribe(x => {
            Object.keys(x).length
                ? this.updateFormsValuesFromQuery(x)
                : this.updateQuery();
        });
    }

    private updateFormsValuesFromQuery(params: any) {
        this.functionArgsForm.patchValue(params);
        this.windowFrameForm.patchValue(params);
        this.othersForm.patchValue(params);
    }

    public randomizeFunctionArgs() {
        this.functionArgsForm.patchValue(generateRandomFunctionArgs());
    }

    public randomizeWindowFrame() {
        const values = generateRandomField();
        this.windowFrameForm.patchValue(values);
        this.performXZeroCheck();
    }

    public performXZeroCheck() {
        let currentXZero = this.othersForm.getRawValue().XZero;
        const values = this.windowFrameForm.getRawValue();
        if (isNaN(currentXZero)) {
            currentXZero = randomXZero(+values.windowC, +values.windowD);
        }
        if (+values.windowC > currentXZero || +values.windowD < currentXZero) {
            this.othersForm.controls.XZero.patchValue(
                randomXZero(+values.windowC, +values.windowD),
            );
        }
    }

    public randomizeOtherArgs() {
        this.othersForm.patchValue(
            generateRandomOthersForm(
                +this.windowFrameForm.getRawValue().windowC,
                +this.windowFrameForm.getRawValue().windowD,
            ),
        );
    }

    public randomize(form: FormGroup, field, fn) {
        let newVal;
        switch (field) {
            case 'windowA':
                newVal = fn();
                console.log(newVal, form.getRawValue().windowB);
                if (newVal > +form.getRawValue().windowB) {
                    form.controls.windowA.patchValue(newVal);
                    form.controls.windowB.patchValue(
                        randomFieldMaximum(newVal),
                    );
                }
                break;
            case 'windowB':
                newVal = fn(+form.getRawValue().windowA);
                form.controls.windowB.patchValue(randomFieldMaximum(newVal));
                break;
            case 'windowC':
                newVal = fn();
                console.log(newVal);
                if (newVal > +form.getRawValue().windowD) {
                    form.controls.windowC.patchValue(newVal);
                    form.controls.windowD.patchValue(
                        randomFieldMaximum(newVal),
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
                this.othersForm.controls.XZero.patchValue(
                    fn(
                        +this.windowFrameForm.getRawValue().windowC,
                        +this.windowFrameForm.getRawValue().windowD,
                    ),
                );
                break;
            default:
                try {
                    form.controls[field].patchValue(fn());
                } catch (e) {
                    console.error(
                        `an error occured while randomizing ${field} control on ${form} group with ${fn}`,
                    );
                }
        }
    }
}
