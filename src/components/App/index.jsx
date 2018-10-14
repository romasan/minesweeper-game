import React, {Component} from 'react';
import update from 'immutability-helper';
import classNames from 'classnames';

import './style.scss';

const EMPTY = 0,
      BOMB  = '*';

const MAX_WIDTH = 20,
      MAX_HEIGHT = 20;

const around = (items, p) => {

  const {x, y} = p;

  let list = []

  if (x > 0                   && y > 0               ) { list.push(items[y - 1][x - 1]); }
  if (                           y > 0               ) { list.push(items[y - 1][x    ]); }
  if (x < items[y].length - 1 && y > 0               ) { list.push(items[y - 1][x + 1]); }
  if (x > 0                                          ) { list.push(items[y    ][x - 1]); }
  if (x < items[y].length - 1                        ) { list.push(items[y    ][x + 1]); }
  if (x > 0                   && y < items.length - 1) { list.push(items[y + 1][x - 1]); }
  if (                           y < items.length - 1) { list.push(items[y + 1][x    ]); }
  if (x < items[y].length - 1 && y < items.length - 1) { list.push(items[y + 1][x + 1]); }

  return list;
};

const sumAround = (items, p) => around(items, p).reduce((sum, item) => sum += item.value == BOMB, 0);

const getSpaces = (items, spaces, p) => {
  const {x, y} = p;
  // spaces.push(p);
  // const beside = around(items, p).filter(e.value == EMPTY);
  // return _(spaces, beside);
  console.log('@', items, spaces, p)
};

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      items: [],
      width: 10,
      height: 10,
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
      console.log('show empty fields beside');
      const spaces = getSpaces(this.state.items, [], {x, y});
      // spaces.forEach();
    }

    this.setState(state => ({'items': update(state.items, {
      [y]: {
        [x]: {
          'open': {$set: true}
        }
      }
    })}));

    // this.checkFinish();
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

    // this.checkFinish();
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
