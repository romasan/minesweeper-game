export const flatten = a => a.reduce((l, e) => e && Array.isArray(e) ? [...l, ...e] : [...l, e], []);
export default flatten;
