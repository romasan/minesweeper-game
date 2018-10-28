import React, {Component} from 'preact-compat';
import update from 'immutability-helper';
import classNames from 'classnames';

import {get, uniq, flatten} from '../../helpers';
import './style.scss';

const EMPTY = ' ',
      BOMB  = '💣';

const MAX_WIDTH = 20,
      MAX_HEIGHT = 20;

const around2d = (items, {x, y}) => [
    [-1, -1], [-1,  0], [-1, +1],
    [ 0, -1],           [ 0, +1],
    [+1, -1], [+1,  0], [+1, +1]
  ].map(([_y, _x]) => get(items, [y + _y, x + _x]))
    .filter(e => e);

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      'items': []
    , 'width': 10
    , 'height': 10
    , 'bombs_count': 10
    , 'settings': false
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
        'value': EMPTY
      , 'open': false
      , 'checked': false
      , x
      , y
      }))
    );

    const bombs = [...new Array(~~width * ~~height)]
      .map((e, i) => ({
        'x': i % ~~width
      , 'y': ~~(i / ~~width)
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, ~~bombs_count);

    bombs.forEach(({x, y}) => {
      items[y][x].value = BOMB;
    });

    items = items.map(line => line.map(
      item => item.value == BOMB
        ? item
        : {
          ...item
        , 'value': around2d(items, item).reduce((sum, {value}) => sum += value == BOMB, 0)
        }
    ));

    this.setState({items});
  }

  toggleSettings = () => {
    const {settings} = this.state;
    this.setState({
      'settings': !settings
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: ~~event.target.value
    });
  }

  getSpaces = p => {

    const {items} = this.state;

    const {x, y} = p;
    const item = items[y][x];
  
    let queue = [item];
    let used = [];
    let spaces = [...used];
  
    while (queue.length) {
      const node = queue.shift();
      used.push(node);
      queue.push(...around2d(items, node).filter(
        e => e.value == EMPTY
        && !used.find(o => o.x == e.x && o.y == e.y)
        && !queue.find(o => o.x == e.x && o.y == e.y)
      ));
    }
  
    used.forEach(e => {
      spaces.push(...around2d(items, e));
    });
    spaces = uniq(spaces);
  
    return spaces;
  }

  open = p => e => {
    
    const {x, y} = p;
    const {open, checked, value} = this.state.items[y][x];

    if (open || checked) {
      return;
    }

    if (value == BOMB) {
      // console.log('show explosion');1
    }
    
    if (value == EMPTY) {
      const spaces = this.getSpaces(p);
      spaces.forEach(({x, y}) => {
        this.setState(state => ({'items': update(state.items, {
          [y]: {
            [x]: {
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

    setImmediate(() => this.checkFinish());
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

    setImmediate(() => this.checkFinish());
  }

  checkFinish () {

    const {checked, open} = flatten(this.state.items).reduce(
      ({checked, open}, item) => ({'open': open + item.open, 'checked': checked + item.checked}), {'open': 0, 'checked': 0}
    );

    const {bombs_count, width, height} = this.state;

    if (
      checked == bombs_count
     && (open + checked) == (width * height)
    ) {
      console.log('Win :)');
    }
  }

  render () {

    const {width, height, bombs_count, items, settings} = this.state;

    return (
      <div className="app">
        <div className="header">Minesweeper</div>
        <div className="bar">
          <button onClick={this.toggleSettings}>⚙</button>
          <span className={classNames('settings', {'hidden': !settings})}>
            Width:  <input type="text" size="2" onChange={this.handleChange('width')}       value={width}/>&nbsp;
            Height: <input type="text" size="2" onChange={this.handleChange('height')}      value={height}/>&nbsp;
            Count:  <input type="text" size="2" onChange={this.handleChange('bombs_count')} value={bombs_count}/>&nbsp;
            <button onClick={this.generateField}>Generate</button>
          </span>
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
                    'checked': item.checked,
                    'explosion': item.open && item.value == BOMB
                  })}
                  onClick={this.open({x, y})}
                  onContextMenu={this.check({x, y})}
                >
                  {item.open ? item.value : item.checked ? '' : '\u00A0'}
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
