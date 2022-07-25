import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      animating: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    if (this.state.animating) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (this.state.animating) return;
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    if (this.state.animating) return;
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
          if(i === nodesInShortestPathOrder.length - 1){
            this.enableButtons();
            this.setState({animating: false});
          }
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    this.disableButtons();
    this.setState({animating: true});
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  disableButtons(){
    var clearBtn = document.getElementById('clear');
    var dijkstraBtn = document.getElementById('dijkstra');

    clearBtn.disabled = true;
    dijkstraBtn.disabled = true;
  }

  enableButtons(){
    var clearBtn = document.getElementById('clear');
    var dijkstraBtn = document.getElementById('dijkstra');

    clearBtn.disabled = false;
    dijkstraBtn.disabled = false;
  }

  clearBoard(){
    const grid = getInitialGrid();
    this.setState({grid});
    
    for(let i = 0; i < this.state.grid.length; i++){
      for(let j = 0; j < this.state.grid[i].length; j++){
        document.getElementById(`node-${i}-${j}`).className = 'node ';
        if(this.state.grid[i][j].isWall === true){
          document.getElementById(`node-${i}-${j}`).className = 'node node-wall';
        }
        if(i === START_NODE_ROW && j === START_NODE_COL){
          document.getElementById(`node-${i}-${j}`).className = 'node node-start';
        }
        if(i === FINISH_NODE_ROW && j === FINISH_NODE_COL){
          document.getElementById(`node-${i}-${j}`).className = 'node node-finish';
        }
      }
    }
    
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
      <div className="button">
        
      </div>
      <div className="grid">
      <button id = "dijkstra" onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
        </button>
      <button id = "clear" onClick={() => this.clearBoard()}>
            Clear Board
        </button>
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart, isWall} = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) =>
                      this.handleMouseEnter(row, col)
                    }
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}></Node>
                );
              })}
            </div>
          );
        })}
      </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];

  const newNode = {
    ...node,
    isWall: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};