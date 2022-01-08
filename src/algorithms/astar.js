function Astar(startNode, endNode) {
    let openSet = [];
    openSet.push(startNode);
    let closedSet = [];
    let path = [];
    let visitedNodes = [];
    let current = undefined
    while(openSet.length > 0) {
        let leastIndex = 0;
        for(let i = 0; i < openSet.length; i++) {
            if(openSet[i].f < openSet[leastIndex].f) {
                leastIndex = i;
            }
        }
        current = openSet[leastIndex];
        visitedNodes.push(current);
        if(current.x === endNode.x && current.y === endNode.y) {
            let temp = current;
            path.push(temp)
            while(temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            console.log("found")
            path = path.slice(1, -1)
            visitedNodes = visitedNodes.slice(1, -1)
            return {path, visitedNodes};
        }

        openSet = openSet.filter(element => element !== current);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for(let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if(!closedSet.includes(neighbor) && !neighbor.isWall) {
                let tempG = current.g + 1;
                let newPath = false;
                if(!openSet.includes(neighbor)) {
                    newPath = true;
                    neighbor.h = heuristic(neighbor, endNode);
                    openSet.push(neighbor)
                } else if (tempG < neighbor.g) {
                    newPath = true;
                }

                if(newPath) {
                    neighbor.previous = current;
                    neighbor.g = tempG;
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }
    }
    console.log("No path found")
    path = path.slice(1, -1)
    visitedNodes = visitedNodes.slice(1, -1)
    return {path, visitedNodes, error: "No Path Found!"};
}

function heuristic(a, b) {
    let d = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    return d;
}

export default Astar;