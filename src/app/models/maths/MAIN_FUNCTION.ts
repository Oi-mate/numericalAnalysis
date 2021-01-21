export const MAIN_FUNCTION_VALUE = (alpha, beta, gamma, delta, epsilon, x) => {
    return (
        alpha * Math.sin(Math.pow(Math.abs(x), beta)) +
        gamma * Math.cos(Math.tan(delta * x))
    );
};
