import get from './get';
export const around2d = (map, {x, y}) => [
    [-1, -1], [-1,  0], [-1, +1],
    [ 0, -1],           [ 0, +1],
    [+1, -1], [+1,  0], [+1, +1]
  ].map(([_y, _x]) => get(map, [y + _y, x + _x]))
    .filter(e => e);
export default around2d;