import equal from './equal';
export const uniq = a => a.reduce((l, e) => l.some(x => equal(x, e)) ? l : [...l, e], []);
export default uniq;
