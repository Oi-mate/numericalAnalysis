import {EqParameters} from '../../utils/form-utils';

export interface IWindowFrame {
    windowA: number;
    windowB: number;
    windowC: number;
    windowD: number;
}

export interface IFunctionArgs {
    alpha: number;
    beta: number;
    gamma: number;
    delta: number;
    epsilon: number;
    chosenParam: EqParameters;
}

export interface IInterpolationArgs {
    XZero: number;
    n: number;
    m: number;
    p: number;
}
