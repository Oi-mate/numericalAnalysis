import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    generateRandomField,
    generateRandomFunctionArgs,
    generateRandomOthersForm,
    randomFieldMaximum,
    randomXZero,
} from '../utils/random';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ControlsService implements OnDestroy {
    public functionArgsForm: FormGroup;
    public windowFrameForm: FormGroup;
    public othersForm: FormGroup;

    private masterSub = new Subscription();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.functionArgsForm = this.fb.group(generateRandomFunctionArgs());
        this.windowFrameForm = this.fb.group(generateRandomField());
        this.othersForm = this.fb.group(
            generateRandomOthersForm(
                this.windowFrameForm.getRawValue().windowC,
                this.windowFrameForm.getRawValue().windowD,
            ),
        );
        this.resolveQuery();
        this.createUpdateLinkSubscription();
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
        this.route.queryParams.pipe(skip(1)).subscribe(x => {
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
                randomXZero(values.windowC, values.windowD),
            );
        }
    }

    public randomizeOtherArgs() {
        this.functionArgsForm.patchValue(generateRandomFunctionArgs());
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
