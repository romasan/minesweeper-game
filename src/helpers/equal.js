export const equal = (a, b) => a === b || typeof a == typeof b && typeof a == 'object' && Object.entries(a).every(([k, v]) => equal(v, b[k])) && Object.entries(b).every(([k, v]) => equal(v, a[k]));
export default equal;
