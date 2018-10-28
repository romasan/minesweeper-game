export const get = (e, a, d) => ((x = (typeof a == 'string' ? a.split(/[\[\]\.]+/) : a).reduce((p, n) => p && p[n], e)) => typeof x != 'undefined' ? x : d)();
export default get;
