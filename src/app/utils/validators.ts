import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export const minMaxRangeValidator: (min, max) => ValidatorFn = (min, max) => (
    control: AbstractControl,
) =>
    min && max && control.value > min && control.value < max
        ? null
        : { range: true };

export const boundsValidator: (form, compareField, isMinimal) => ValidatorFn = (
    form: FormGroup,
    compareField,
    isMinimal,
) => (control: AbstractControl) => {
    if (isMinimal) {
        return form?.controls[compareField].value > control.value
            ? null
            : { illegalBound: true };
    } else {
        return form?.controls[compareField].value < control.value
            ? null
            : { illegalBound: true };
    }
};

export const betweenValidator: (min, max) => ValidatorFn = (min,max) => (control) => {
  return control.value >= min && control.value <= max ? null : { illegalXZeroValue: true };
};
