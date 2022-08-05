var ret;

export function astar(grid, startNode, finishNode)
{
    ret = false
    const visitedNodesInOrder = [];
    const nodesToSearch = [];
    startNode.gValue = 0;
    startNode.fValue = (Math.abs(startNode.row - finishNode.row) + Math.abs(startNode.col - finishNode.col));
    astarRecurse(startNode, grid, finishNode, visitedNodesInOrder, nodesToSearch);
    return visitedNodesInOrder;
}

function astarRecurse(curNode, grid, finishNode, visitedNodesInOrder, nodesToSearch)
{
    if(ret === true) return;
    const {col, row, gValue, fValue} = curNode;
    if(curNode.isVisited === true) return;
    if(curNode.isWall === true) return;

    visitedNodesInOrder.push(curNode);
    curNode.isVisited = true;

    if(curNode === finishNode){
        ret = true;
        return;
    }
    
    const neighbors = [];

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    for(const neighbor of neighbors){
        if(neighbor.isVisited === true || neighbor.isWall === true ) continue;
        neighbor.gValue = gValue + 1;
        neighbor.fValue = neighbor.gValue + (Math.abs(neighbor.row - finishNode.row ) + Math.abs(neighbor.col - finishNode.col));

        const prevNodes = [];
        if (neighbor.row > 0) prevNodes.push(grid[neighbor.row - 1][neighbor.col]);
        if (neighbor.row < grid.length - 1) prevNodes.push(grid[neighbor.row + 1][neighbor.col]);
        if (neighbor.col > 0) prevNodes.push(grid[neighbor.row][neighbor.col - 1]);
        if (neighbor.col < grid[0].length - 1) prevNodes.push(grid[neighbor.row][neighbor.col + 1]);
        prevNodes.filter(prevNode => prevNode.isVisited);
        prevNodes.sort((nodeA, nodeB) => nodeA.gValue - nodeB.gValue);
        neighbor.previousNode = prevNodes.shift();

        nodesToSearch.unshift(neighbor);
    }
    nodesToSearch.sort((nodeA, nodeB) => nodeA.fValue - nodeB.fValue);

    while(nodesToSearch.length > 0){
        const nextNode = nodesToSearch.shift();
        astarRecurse(nextNode, grid, finishNode, visitedNodesInOrder, nodesToSearch);
        if(ret === true){
            return;
        }
    }

}