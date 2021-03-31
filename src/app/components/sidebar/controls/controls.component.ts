import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ControlsService } from '../../../services/controls.service';
import {
    randomFieldMaximum,
    randomFieldMinimum,
    randomFunctionArg,
    randomInterpolationSteps,
    randomPrecision,
    randomXZero,
} from '../../../utils/random';
import {parameterValues} from '../../../utils/form-utils';


@Component({
    selector: 'na-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent implements OnInit {

    paramValues = parameterValues;
    randomFunctionArg = randomFunctionArg;
    randomFieldMinimum = randomFieldMinimum;
    randomFieldMaximum = randomFieldMaximum;
    randomInterpolationSteps = randomInterpolationSteps;
    randomXZero = randomXZero;
    randomPrescision = randomPrecision;

    constructor(public service: ControlsService) {}

    ngOnInit(): void {}
}
