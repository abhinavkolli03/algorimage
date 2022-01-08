import React, {useState, useEffect} from 'react';
import Node from "./Node";
import Astar from "../algorithms/astar.js";
import "./Pathfinder.css";
import "./Node.css";

let cols = 20;
let rows = 20;

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows-1;
const NODE_END_COL = cols-1;

const Pathfinder = () => {
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);
    const [VisitedNodes, setVisitedNodes] = useState([]);
    const [ResultsText, setResultsText] = useState("");
    useEffect(() => {
        initializeGrid()
    }, [])

    //Creates grid
    const initializeGrid = () => {
        const grid = new Array(rows);
        for(let i = 0; i < rows; i++) {
            grid[i] = new Array(cols)
        }
        createSpot(grid);
        addNeighbors(grid);
        setGrid(grid);
        setResultsText("");
        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_END_ROW][NODE_END_COL];
        var timeTaken = performance.now();
        let path = Astar(startNode, endNode);
        timeTaken = performance.now() - timeTaken
        startNode.isWall = false;
        endNode.isWall = false;
        setResultsText("Time: " + (timeTaken).toString() + " ms\nLength: " + (path.path.length));
        setPath(path.path);
        setVisitedNodes(path.visitedNodes);
    }

    //creates spot
    const createSpot = (grid) => {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                grid[i][j] = new Spot(i, j);
            }
        }
    }

    const addNeighbors = (grid) => {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                grid[i][j].addSpotNeighbors(grid);
            }
        }
    }

    //spot constructor
    function Spot(i, j) {
        this.x = i;
        this.y = j;
        this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
        this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.neighbors = [];
        this.isWall = false;
        if(Math.random(1) < 0.2 && !this.isEnd) {
            this.isWall = true;
        }
        this.previous = undefined;
        this.addSpotNeighbors = function(grid) {
            let x = this.x;
            let y = this.y;
            if(grid[x-1] && grid[x-1][y]) {
                this.neighbors.push(grid[x-1][y]);
            }
            if(grid[x+1] && grid[x+1][y]) {
                this.neighbors.push(grid[x+1][y]);
            }
            if(grid[x][y-1] && grid[x][y-1]) {
                this.neighbors.push(grid[x][y-1]);
            }
            if(grid[x][y+1] && grid[x][y+1]) {
                this.neighbors.push(grid[x][y+1]);
            }
        };
    }  

    //Grid with node
    const gridWithNode = () => {
        return (
            <div>
                {Grid.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="rowWrapper">
                            {row.map((col, colIndex) => {
                                const {isStart, isEnd, isWall} = col;
                                return (
                                    <Node 
                                        key={colIndex} 
                                        isStart={isStart} 
                                        isEnd={isEnd} 
                                        row={rowIndex} 
                                        col={colIndex}
                                        isWall = {isWall}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        )
    }

    const visualizeShortestPath = (shortestPathNodes) => {
        for(let i = 0; i < shortestPathNodes.length; i++) {
            setTimeout(() => {
                const node = shortestPathNodes[i];
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path";
            }, 2 * i); //frame rate
        }
    };

    const visualizePath = () => {
        for(let i = 0; i <= VisitedNodes.length; i++) {
            if(i === VisitedNodes.length) {
                setTimeout(() => {
                    visualizeShortestPath(Path);
                }, 5 * i); //delayed frame rate
            } else {
                setTimeout(() => {
                    const node = VisitedNodes[i];
                    document.getElementById(`node-${node.x}-${node.y}`).className = "node node-visited";
                }, 5 * i)
            }
        }
    };

    const resetGrid = () => {
        initializeGrid()
        for(let i = 0; i < VisitedNodes.length; i++) {
            const node = VisitedNodes[i];
            document.getElementById(`node-${node.x}-${node.y}`).className = "node";
        }
        gridWithNode()
    }

    return (
        <div className="Wrapper">
            <button onClick={visualizePath}>Visualize Path</button>
            <button onClick={resetGrid}>Reset Grid</button>
            <h1>Pathfinding Visualizer</h1>
            {gridWithNode()}
        </div>
    );
}

export default Pathfinder;