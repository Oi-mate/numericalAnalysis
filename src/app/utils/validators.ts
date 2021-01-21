import {
    AbstractControl,
    AsyncValidatorFn,
    FormGroup,
    ValidatorFn,
} from '@angular/forms';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

export const minMaxRangeValidator: (min, max) => ValidatorFn = (min, max) => (
    control: AbstractControl,
) => {
    return control.value > min && control.value < max ? null : { range: true };
};

export const betweenValidator: (min, max) => ValidatorFn = (
    min,
    max,
) => control => {
    return +control.value >= min && +control.value <= max
        ? null
        : { illegalXZeroValue: true };
};

export class BoundsValidator {
    static createValidator(
        form: FormGroup,
        compareField,
        isMinimal,
    ): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return timer(10).pipe(
                map(() => {
                    if (isMinimal) {
                        return form?.controls[compareField].value >
                            control.value
                            ? null
                            : { illegalBound: true };
                    } else {
                        return form?.controls[compareField].value <
                            control.value
                            ? null
                            : { illegalBound: true };
                    }
                }),
            );
        };
    }
}
