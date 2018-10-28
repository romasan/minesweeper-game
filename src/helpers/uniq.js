import {equal} from './equal.js';
export const uniq = a => a.reduce((l, e) => l.some(x => equal(x, e)) ? l : [...l, e], []);
