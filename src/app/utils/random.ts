export const getRandomNumber = (min, max, round = false) => {
    const num = min + Math.random() * (max - min);
    return round ? Math.round(num) : num;
};

export const randomFunctionArg = () => getRandomNumber(-100, 100).toFixed(2);
export const randomFieldMinimum = () => getRandomNumber(-100, 100, true);
export const randomFieldMaximum = (minValue, delta = 20) =>
    getRandomNumber(minValue, minValue + delta, true);
export const randomInterpolationSteps = () => getRandomNumber(1, 500, true);
export const randomXZero = (XZeroMin, XZeroMax) =>
    getRandomNumber(XZeroMin, XZeroMax, true);
export const randomPrecision = () => getRandomNumber(10, 25, true);

export const generateRandomField = () => {
    const A = randomFieldMinimum();
    const C = randomFieldMinimum();
    return {
        windowA: A,
        windowB: randomFieldMaximum(A),
        windowC: C,
        windowD: randomFieldMaximum(C, 100),
    };
};

export const generateRandomFunctionArgs = () => ({
    alpha: randomFunctionArg(),
    beta: randomFunctionArg(),
    gamma: randomFunctionArg(),
    delta: randomFunctionArg(),
    epsilon: '',
});

export const generateRandomOthersForm = (XZeroMin, XZeroMax) => ({
    XZero: randomXZero(XZeroMin, XZeroMax),
    n: randomInterpolationSteps(),
    m: randomInterpolationSteps(),
    p: randomPrecision(),
});
