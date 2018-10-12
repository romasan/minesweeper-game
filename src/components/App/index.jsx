import React, {Component} from 'react';
import './style.scss';

const EMPTY = 0,
      BOMB  = '*';

const MAX_WIDTH = 20,
      MAX_HEIGHT = 20;

const checkAround = (items, x, y) => {

  let count = 0;

  count += (x > 0                   && y > 0 && items[y - 1][x - 1] == BOMB);
  count += (                           y > 0 && items[y - 1][x    ] == BOMB);
  count += (x < items[0].length - 1 && y > 0 && items[y - 1][x + 1] == BOMB);

  count += (x > 0                   && items[y][x - 1] == BOMB);
  count += (x < items[0].length - 1 && items[y][x + 1] == BOMB);

  count += (x > 0                   && y < items.length - 1 && items[y + 1][x - 1] == BOMB);
  count += (                           y < items.length - 1 && items[y + 1][x    ] == BOMB);
  count += (x < items[0].length - 1 && y < items.length - 1 && items[y + 1][x + 1] == BOMB);

  return count;
}

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      items: [],
      width: 7,
      height: 10,
      bombs_count: 10,
    };
  }

  componentDidMount () {
    this.generateField();
  }

  generateField () {

    const {width, height, bombs_count} = this.state;

    let items = [...new Array(~~height)].map(() => [...new Array(~~width)].map(() => EMPTY));
    const bombs = [...new Array(~~width * ~~height)]
      .map((e, i) => ({
        x: i % ~~width,
        y: ~~(i / ~~width)
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, ~~bombs_count);

    bombs.forEach(e => {
      items[e.y][e.x] = BOMB;
    });

    items = items.map((line, y) => line.map((item, x) => item == BOMB ? item : checkAround(items, x, y)))

    this.setState({items});
  }

  setWidth (e) {
    this.setState({width: ~~e.target.value});
    // setTimeout(() => {
    //   this.generateField();
    // }, 0);
  }

  setHeight (e) {
    this.setState({height: ~~e.target.value});
    // setTimeout(() => {
    //   this.generateField();
    // }, 0);
  }

  setBombsCount (e) {
    this.setState({bombs_count: ~~e.target.value});
    // setTimeout(() => {
    //   this.generateField();
    // }, 0);
  }

  render () {

    const {width, height, bombs_count, items} = this.state;

    return (
      <div className="app">
        <div className="header">Minesweeper</div>
        <div className="bar">
          Width:  <input size="2" onChange={this.setWidth.bind(this)}      value={width}/>&nbsp;
          Height: <input size="2" onChange={this.setHeight.bind(this)}     value={height}/>&nbsp;
          Count:  <input size="2" onChange={this.setBombsCount.bind(this)} value={bombs_count}/>&nbsp;
          <button onClick={this.generateField.bind(this)}>Generate</button>
        </div>
        <div className="field">
          {items.map(
            (line, y) => <div key={y}>{line.map(
              (item, x) => <div key={`${x}_${y}`} className={`item color-${item}`}>{item}</div>
            )}</div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
