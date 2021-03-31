export const ValuesToNumber = (obj: any) => {
  return Object.keys(obj).reduce((p, c) => {
    p[c] = +obj[c];
    return p;
  }, {});
};

export enum EqParameters {
  alpha = 'a',
  beta = 'b',
  gamma = 'c',
  delta = 'd',
  epsilon = 'e'
}

export const parameterValues: {value: EqParameters; text: string}[] = [
  {value: EqParameters.alpha, text: 'α'},
  {value: EqParameters.beta, text: 'β'},
  {value: EqParameters.gamma, text: 'γ'},
  {value: EqParameters.delta, text: 'δ'},
  // {value: EqParameters.epsilon, text: 'ε'},
];
