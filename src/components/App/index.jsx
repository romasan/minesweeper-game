import React, {Component} from 'react';
import update from 'immutability-helper';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import classNames from 'classnames';

import './style.scss';

const EMPTY = 0,
      BOMB  = '💣';

const MAX_WIDTH = 20,
      MAX_HEIGHT = 20;

const around = (items, p) => [
    [-1, -1], [-1,  0], [-1, +1],
    [ 0, -1],           [ 0, +1],
    [+1, -1], [+1,  0], [+1, +1]
  ].map(([y, x]) => get(items, [p.y + y, p.x + x]))
    .filter(e => e);

const sumAround = (items, p) => around(items, p).reduce((sum, item) => sum += item.value == BOMB, 0);

const getSpaces = (items, p) => {

  const {x, y} = p;
  const item = items[y][x];

  let queue = [item];
  let used = [];
  let spaces = [...used];

  while (queue.length) {
    const node = queue.shift();
    used.push(node);
    queue.push(...around(items, node).filter(
      e => e.value == EMPTY
      && !used.find(o => o.x == e.x && o.y == e.y)
      && !queue.find(o => o.x == e.x && o.y == e.y)
    ));
  }

  used.forEach(e => {
    spaces.push(...around(items, e));
  });
  spaces = uniq(spaces);

  return spaces;
};

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      items: [],
      width: 30,
      height: 30,
      bombs_count: 10,
    };
  }

  componentDidMount () {
    this.generateField();
  }

  generateField = () => {

    const {width, height, bombs_count} = this.state;

    let items = [
      ...new Array(~~height)
    ].map(
      (e, y) => [
        ...new Array(~~width)
      ].map((e, x) => ({
        'value': EMPTY,
        'open': false,
        'checked': false,
        x,
        y
      }))
    );

    const bombs = [...new Array(~~width * ~~height)]
      .map((e, i) => ({
        'x': i % ~~width,
        'y': ~~(i / ~~width)
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, ~~bombs_count);

    bombs.forEach(({x, y}) => {
      items[y][x].value = BOMB;
    });

    items = items.map((line, y) => line.map(
      (item, x) => item.value == BOMB
        ? item
        : {
          ...item,
          'value': sumAround(items, {x, y})
        }
    ));

    this.setState({items});
  }

  handleChange = name => event => {
    this.setState({
      [name]: ~~event.target.value
    });
  }

  open = p => e => {
    
    const {x, y} = p;
    const {open, checked, value} = this.state.items[y][x];

    if (open || checked) {
      return;
    }

    if (value == BOMB) {
      console.log('show explosion');
    }

    if (value == EMPTY) {
      const spaces = getSpaces(this.state.items, {x, y});
      spaces.forEach(e => {
        this.setState(state => ({'items': update(state.items, {
          [e.y]: {
            [e.x]: {
              'open': {$set: true}
            }
          }
        })}));
      });
    }

    this.setState(state => ({'items': update(state.items, {
      [y]: {
        [x]: {
          'open': {$set: true}
        }
      }
    })}));

    this.checkFinish();
  }

  check = p => e => {

    e.preventDefault();

    const {x, y} = p;
    const {open, checked} = this.state.items[y][x];

    if (open) {
      return;
    }

    this.setState(state => ({'items': update(state.items, {
      [y]: {
        [x]: {
          'checked': {$set: !checked}
        }
      }
    })}));

    this.checkFinish();
  }

  checkFinish () {

    const {checked, open} = flatten(this.state.items).reduce(
      ({checked, open}, item) => ({'open': open + item.open, 'checked': checked + item.checked}), {'open': 0, 'checked': 0}
    );

    const {bombs_count, width, height} = this.state;

    console.log('#', checked, bombs_count, '-', open + checked, width * height, '-', open, checked, width, height)

    if (
      checked == bombs_count
     && (open + checked) == (width * height)
    ) {
      console.log('Win :)');
    }
  }

  render () {

    const {width, height, bombs_count, items} = this.state;

    return (
      <div className="app">
        <div className="header">Minesweeper</div>
        <div className="bar">
          Width:  <input size="2" onChange={this.handleChange('width')}       value={width}/>&nbsp;
          Height: <input size="2" onChange={this.handleChange('height')}      value={height}/>&nbsp;
          Count:  <input size="2" onChange={this.handleChange('bombs_count')} value={bombs_count}/>&nbsp;
          <button onClick={this.generateField}>Generate</button>
        </div>
        <div className="field">
          {items.map(
            (line, y) => <div key={y}>{line.map(
              (item, x) => (
                <div
                  key={`${x}_${y}`}
                  className={classNames('item', {
                    [`color-${item.value}`]: typeof item.value == 'number',
                    'open': item.open,
                    'checked': item.checked
                  })}
                  onClick={this.open({x, y})}
                  onContextMenu={this.check({x, y})}
                >
                  {item.open ? item.value : ''}
                </div>
              )
            )}</div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
