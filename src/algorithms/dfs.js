var ret;

export function dfs(grid, startNode, finishNode) {
  ret = false;
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  sortNodesByDistance(unvisitedNodes);
  const closestNode = unvisitedNodes.shift();
  dfsRecurse(grid, closestNode, visitedNodesInOrder, finishNode);
  return visitedNodesInOrder;
}

function dfsRecurse(grid, node, visitedNodesInOrder, finishNode){
  const {col, row} = node;
  if(ret === true) return;
  if (node.isWall) return;
  node.isVisited = true;
  visitedNodesInOrder.push(node);
  if(node === finishNode){
    ret = true;
    return;
  }
  if(row < grid.length - 1){
    if(grid[row + 1][col].isVisited === false){
      dfsRecurse(grid, grid[row + 1][col], visitedNodesInOrder, finishNode);
      if(ret === true){
        grid[row + 1][col].previousNode = node;
      }
    }
  }
  if(col < grid[0].length - 1){
    if(grid[row][col + 1].isVisited === false){
      dfsRecurse(grid, grid[row][col + 1], visitedNodesInOrder, finishNode);
      if(ret === true){
        grid[row][col + 1].previousNode = node;
      }
    }
  }
  if(row > 0){
    if(grid[row-1][col].isVisited === false){
      dfsRecurse(grid, grid[row-1][col], visitedNodesInOrder, finishNode);
      if(ret === true){
        grid[row-1][col].previousNode = node;
      }
    }
  }
  if(col > 0){
    if(grid[row][col-1].isVisited === false){
      dfsRecurse(grid, grid[row][col-1], visitedNodesInOrder, finishNode);
      if(ret === true){
        grid[row][col-1].previousNode = node;
      }
    }
  }

}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}