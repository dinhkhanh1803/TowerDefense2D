export const PatternEasing = {
    Linear: {
        None: (k: number) => k,
    },
    Quadratic: {
        In: (k: number) => k * k,
        Out: (k: number) => k * (2 - k),
        InOut: (k: number) => {
            if ((k *= 2) < 1) return 0.5 * k * k;
            return - 0.5 * (--k * (k - 2) - 1);
        }
    },
    Cubic: {
        In: (k: number) => k * k * k,
        Out: (k: number) => --k * k * k + 1,
        InOut: (k: number) => {
            if ((k *= 2) < 1) return 0.5 * k * k * k;
            return 0.5 * ((k -= 2) * k * k + 2);
        }
    },
    Quartic: {
        In: (k: number) => k * k * k * k,
        Out: (k: number) => 1 - (--k * k * k * k),
        InOut: (k: number) => {
            if ((k *= 2) < 1) return 0.5 * k * k * k * k;
            return - 0.5 * ((k -= 2) * k * k * k - 2);
        }
    },
    Quintic: {
        In: (k: number) => k * k * k * k * k,
        Out: (k: number) => --k * k * k * k * k + 1,
        InOut: (k: number) => {
            if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        }
    },
    Sinusoidal: {
        In: (k: number) => 1 - Math.cos(k * Math.PI / 2),
        Out: (k: number) => Math.sin(k * Math.PI / 2),
        InOut: (k: number) => 0.5 * (1 - Math.cos(Math.PI * k))
    },
    Exponential: {
        In: (k: number) => k === 0 ? 0 : Math.pow(1024, k - 1),
        Out: (k: number) => k === 1 ? 1 : 1 - Math.pow(2, - 10 * k),
        InOut: (k: number) => {
            if (k === 0) return 0;
            if (k === 1) return 1;
            if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
            return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
        }
    },
    Circular: {
        In: (k: number) => 1 - Math.sqrt(1 - k * k),
        Out: (k: number) => Math.sqrt(1 - (--k * k)),
        InOut: (k: number) => {
            if ((k *= 2) < 1) return - 0.5 * (Math.sqrt(1 - k * k) - 1);
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    },
    Elastic: {
        In: (k: number) => {
            let s = 0, a = 0.1;
            const p = 0.4;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) { a = 1; s = p / 4; } else s = p * Math.asin(1 / a) / (2 * Math.PI);
            return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        },
        Out: (k: number) => {
            let s = 0, a = 0.1;
            const p = 0.4;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) { a = 1; s = p / 4; } else s = p * Math.asin(1 / a) / (2 * Math.PI);
            return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        },
        InOut: (k: number) => {
            let s = 0, a = 0.1;
            const p = 0.4;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) { a = 1; s = p / 4; } else s = p * Math.asin(1 / a) / (2 * Math.PI);
            if ((k *= 2) < 1) return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
        }
    },
    Back: {
        In: (k: number) => {
            const s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },
        Out: (k: number) => {
            const s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        },
        OutTopup: (k: number) => {
            const s = 3;
            return --k * k * ((s + 1) * k + s) + 1;
        },
        Out33: (k: number) => {
            const s = 0.94431; //coeff 3.3%
            return --k * k * ((s + 1) * k + s) + 1;
        },
        Out66: (k: number) => {
            const s = 1.34996; //coeff 6.6%
            return --k * k * ((s + 1) * k + s) + 1;
        },
        InOut: (k: number) => {
            const s = 1.70158 * 1.525;
            if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    },
    Bounce: {
        In: (k: number) => 1 - PatternEasing.Bounce.Out(1 - k),
        Out: (k: number) => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (k < (1 / d1)) {
                return n1 * k * k;
            } else if (k < (2 / d1)) {
                return n1 * (k -= (1.5 / d1)) * k + 0.75;
            } else if (k < (2.5 / d1)) {
                return n1 * (k -= (2.25 / d1)) * k + 0.9375;
            } else {
                return n1 * (k -= (2.625 / d1)) * k + 0.984375;
            }
        },
        InOut: (k: number) => {
            if (k < 0.5) return PatternEasing.Bounce.In(k * 2) * 0.5;
            return PatternEasing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        },
        SymbolOut1: (k: number) => {
            /**
             * y=10\cdot x\cdot x
             * y=1.2\cdot\left(x-0.65\right)\cdot\left(x-0.65\right)+\ 0.855
             */
            if (k < 0.3146) {
                return (10 * k * k);
            } else {
                return (1.5 * (k - 0.65) * (k - 0.65) + 0.83);
            }
        },
        SymbolOut2: (k: number) => {
            /**
             * y=15\cdot x\cdot x
             *  y=1.2\cdot\left(x-0.48\right)\cdot\left(x-0.48\right)+\ 0.94
             * y=1.2\cdot\left(x-0.85\right)\cdot\left(x-0.85\right)\ +\ 0.97
             * */
            if (k < 0.2581) {
                return (15 * k * k);
            } else if (k < 0.6988) {
                return (1.2 * (k - 0.48) * (k - 0.48) + 0.94);
            } else {
                return (1.2 * (k - 0.85) * (k - 0.85) + 0.97);
            }
        },
        SymbolOut3: (k: number) => {
            /**
             * https://www.desmos.com/calculator/zukjgk9iry
             * y=15\cdot x\cdot x
             * y=1.7\cdot\left(x-0.42\right)\cdot\left(x-0.42\right)+\ 0.955
             * y=1.7\cdot\left(x-0.70\right)\cdot\left(x-0.70\right)\ +\ 0.97
             * y=1.7\cdot\left(x-0.90\right)\cdot\left(x-0.90\right)\ +\ 0.99
            */
            if (k < 0.2581) {
                return (15 * k * k);
            } else if (k < 0.5758) {
                return (1.7 * (k - 0.42) * (k - 0.42) + 0.955);
            } else if (k < 0.8294) {
                return (1.7 * (k - 0.7) * (k - 0.7) + 0.97);
            } else {
                return (1.7 * (k - 0.9) * (k - 0.9) + 0.99);
            }
        }
    },
    // Easy:{
    //     In: (k: number) => { },
    //     Out: (k: number) => { },
    //     InOut: (k: number) => { }
    // }
};
