export function xAxisTickLabelFormatterFn() {
    const modPi = Math.abs(+(this.value % Math.PI).toFixed(2));
    const piCount = Math.round(this.value / Math.PI);
    const modPiBy2 = Math.abs(+(this.value % (Math.PI / 2)).toFixed(2));
    return modPi === 0 || modPi === +Math.PI.toFixed(2)
        ? `${
              Math.round(this.value / Math.PI) === 0
                  ? '0'
                  : Math.round(this.value / Math.PI) + 'π'
          }`
        : modPiBy2 === 0 || modPiBy2 === +(Math.PI / 2).toFixed(2)
        ? `${
              Math.round(this.value / (Math.PI / 2)) === 0
                  ? this.value < 0 ? '-' : ''
                  : Math.round(this.value / (Math.PI / 2)) + ''
          }π/2`
        : this.value;
}
