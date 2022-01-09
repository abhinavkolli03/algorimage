import React, {Component, useState, useEffect} from 'react';
import Node from "./Node";
import Astar from "../algorithms/astar.js";
import "./Pathfinder.css";
import "./Node.css";

let cols = 50;
let rows = 20;

var timeTaken = 0;
var lengthOfPath = 0;

var mousePressed = false;
var buttonBools = [false, false, false];

var NODE_START_ROW = 9;
var NODE_START_COL = 12;
var NODE_END_ROW = 9;
var NODE_END_COL = 37;

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
        performAlgorithm(grid);
        return(grid);
    }

    function performAlgorithm(grid) {
        setResultsText("Time: 0 ms Length: 0")
        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_END_ROW][NODE_END_COL];
        timeTaken = performance.now();
        let path = Astar(startNode, endNode);
        timeTaken = Math.trunc((performance.now() - timeTaken) * 1000) / 1000;
        lengthOfPath = path.path.length;
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
                grid[i][j].neighbors = []
                grid[i][j].addSpotNeighbors(grid);
            }
        }
    }

    const addWalls = (grid) => {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(Math.random(1) < 0.2)
                    grid[i][j].addSpotWall(grid);
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
        this.previous = undefined;
        this.addSpotWall = function(grid) {
            if(!this.isEnd) {
                this.isWall = true;
            }
        }
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

    function handleMouseDown(row, col) {
        clearVisualVisitedNodes()
        var newGrid = addMousePressedObject(Grid, row.row, col.col);
        mousePressed = true;
        if(buttonBools[1] || buttonBools[2]) {
            newGrid = Grid
            createSpot(newGrid)
        }
        addNeighbors(newGrid);
        setGrid(newGrid);
        performAlgorithm(newGrid);
    }

    function handleMouseEnter(row, col) {
        //clearVisualVisitedNodes()
        if(buttonBools[0] && mousePressed) {
            const newGrid = addMousePressedObject(Grid, row.row, col.col);
            addNeighbors(newGrid);
            setGrid(newGrid);
            performAlgorithm(newGrid);
        }
    }

    function handleMouseUp() {
        mousePressed = false
    }

    const addMousePressedObject = (grid, row, col) => {
        const tempNode = grid[row][col];
        if(buttonBools[0] && !tempNode.isEnd) {
            tempNode.isWall = !tempNode.isWall
            grid[row][col] = tempNode;
        }
        else if(buttonBools[1] || buttonBools[2])
            grid = changeStartOrEndNode(grid, row, col)
        return grid;
    }

    function changeStartOrEndNode(grid, row, col) {
        if(buttonBools[1]) {
            NODE_START_ROW = row
            NODE_START_COL = col
        } else {
            NODE_END_ROW = row
            NODE_END_COL = col
        }
        clearVisualVisitedNodes()
        return grid;
    }

    //Grid with node
    const gridWithNode = () => {
        return (
            <div>
                {Grid.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="rowWrapper">
                            {row.map((node, nodeIndex) => {
                                const {isStart, isEnd, isWall} = node;
                                return (
                                    <Node key={nodeIndex} 
                                        isStart={isStart} 
                                        isEnd={isEnd} 
                                        isWall = {isWall}
                                        row = {rowIndex}
                                        col = {nodeIndex}
                                        mousePressed = {mousePressed}
                                        onMouseDown={(row, col) => handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                        onMouseUp={() => handleMouseUp()}
                                    />
                                    //<p>hi</p>
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
        setResultsText("Time: " + timeTaken + " ms Length: " + lengthOfPath)
        return (
            <div>
                <p>{ResultsText}</p>
            </div>
        )
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

    const randomizeWalls = () => {
        let wallGrid = initializeGrid()
        addWalls(wallGrid)
        addNeighbors(wallGrid);
        setGrid(wallGrid)
        performAlgorithm(wallGrid)
        clearVisualVisitedNodes()
    }

    const reset = () => {
        initializeGrid()
        clearVisualVisitedNodes()
    }

    function clearVisualVisitedNodes() {
        for(let i = 0; i < VisitedNodes.length; i++) {
            const node = VisitedNodes[i];
            document.getElementById(`node-${node.x}-${node.y}`).className = "node";
        }
    }

    const alterWallsBool = () => {
        buttonBools = [!buttonBools[0], false, false];
    }

    const alterStartBool = () => {
        buttonBools = [false, !buttonBools[1], false];
    }

    const alterEndBool = () => {
        buttonBools = [false, false, !buttonBools[2]];
    }

    return (
        <div className="Wrapper">
            <h1>Pathfinding Visualizer</h1>
            <button onClick={visualizePath}>Visualize Path</button>
            <button onClick={randomizeWalls}>Randomize Walls</button>
            <button onClick={reset}>Reset Board</button>
            <p>{ResultsText}</p>
            {gridWithNode()}
            <button onClick={alterWallsBool}>Change Walls</button>
            <button onClick={alterStartBool}>Change Start</button>
            <button onClick={alterEndBool}>Change End</button>
        </div>
    );
}

export default Pathfinder;