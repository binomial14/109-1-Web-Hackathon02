import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { Fireworks } from 'fireworks/lib/react'

import "./Sudoku.css"
import Header from '../components/Header';
import Grid_9x9 from '../components/Grid_9x9';
import ScreenInputKeyBoard from '../components/ScreenInputKeyBoard'
import { problemList } from "../problems"

class Sudoku extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, // Return loading effect if this is true.
            problem: null, // Stores problem data. See "../problems/" for more information.This is the origin problem and should not be modified. This is used to distinguish the fixed numbers from the editable values
            gridValues: null,  // A 2D array storing the current values on the gameboard. You should update this when updating the game board values.
            selectedGrid: { row_index: -1, col_index: -1 }, // This objecct store the current selected grid position. Update this when a new grid is selected.
            gameBoardBorderStyle: "8px solid #000", // This stores the gameBoarderStyle and is passed to the gameboard div. Update this to have a error effect (Bonus #2).
            completeFlag: false, // Set this flag to true when you wnat to set off the firework effect.
            conflicts: [{ row_index: -1, col_index: -1 }] // The array stores all the conflicts positions triggered at this moment. Update the array whenever you needed.
        }
    }

    handle_grid_1x1_click = (row_index, col_index) => {
        // TODO
        var r = row_index;
        var c = col_index;
        //console.log(this.state.gridValues[r][c]);
        if(this.state.problem.content[r][c] !== '0')
        {
            alert("Can't select");
            return;
        }
        this.setState({selectedGrid: { row_index: row_index, col_index: col_index}});
        //console.log(this.state.problem.content);
        // Useful hints:
        //console.log(row_index, col_index);
        // console.log(this.state.selectedGrid);
        // console.log(this.state.selectedGrid)
    }

    handleKeyDownEvent = (event) => {
        // TODO
        //console.log(this.state.selectedGrid);
        //console.log(this.state.gridValues)
        if (this.state.gridValues !== null && this.state.selectedGrid.row_index !== -1 && this.state.selectedGrid.col_index !== -1 && (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) 
        {
            //console.log(event.keyCode);
            var newValues = this.state.gridValues;
            var new_v = event.keyCode%48;
            if(new_v !== 0)
            {
                if(this.checkConflict(new_v.toString(),this.state.selectedGrid.row_index,this.state.selectedGrid.col_index))
                {
                    console.log("conflict!");
                }
                else
                {
                    newValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = new_v.toString();
                    this.setState({gridValues: newValues});
                }
                
            }
            else
            {
                newValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = "0";
                this.setState({gridValues: newValues});
            }
            //console.log(this.state.gridValues)
            if(!this.state.gridValues.some(row => row.includes('0')))
            {
                this.setState({ completeFlag: true });
                setTimeout(() => { this.setState({ completeFlag: false }); }, 2500);
                //console.log('complete');
            }
        }
        else
        {
            this.setState({ gameBoardBorderStyle: "8px solid #E77" });
            setTimeout(() => { this.setState({ gameBoardBorderStyle: "8px solid #333" }); }, 1000);
        }
        // Useful hints:
        //console.log(event)
        // if (this.state.gridValues !== null && this.state.selectedGrid.row_index !== -1 && this.state.selectedGrid.col_index !== -1 && (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {}
        // if (this.state.problem.content[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] === "0") {}
    }

    handleScreenKeyboardInput = (num) => {
        // TODO
        console.log(this.state.gridValues);
        var newValues = this.state.gridValues;
        if(num !== 0)
        {
            if(this.checkConflict(num.toString(),this.state.selectedGrid.row_index,this.state.selectedGrid.col_index))
            {
                console.log("conflict!");
            }
            else
            {
                newValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = num.toString();
                this.setState({gridValues: newValues});
            }
            if(!this.state.gridValues.some(row => row.includes('0')))
            {
                this.setState({ completeFlag: true });
                setTimeout(() => { this.setState({ completeFlag: false }); }, 2500);
                //console.log('complete');
            }
        }
        else
        {
            newValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = "0";
            this.setState({gridValues: newValues});
        }
    }

    checkConflict = (value, r, c) => {
        var new_c =[];
        for(var i = 0; i < 9; i++)
        {
            new_c.push(this.state.gridValues[i][c]);
        }
        var new_squ = [];
        var r_pivot = r%3;
        var c_pivot = c%3;
        for(var i = 0; i < 3; i++)
        {
            for(var j = 0; j < 3; j++)
            {
                new_squ.push(this.state.gridValues[r-r_pivot+i][c-c_pivot+j])
            }
        }
        //console.log(this.state.gridValues[r]);
        //console.log(new_c);
        //console.log(new_squ);
        if(this.state.gridValues[r].includes(value) || new_c.includes(value) || new_squ.includes(value))
        {
            // console.log(this.state.gridValues[r].indexOf(value));
            // console.log(new_c.indexOf(value));
            // console.log(new_squ.indexOf(value));
            // console.log(Math.floor(r-r_pivot+new_squ.indexOf(value)/3));
            // console.log(c-c_pivot+new_squ.indexOf(value)%3);
            this.setState({conflicts: [{ row_index: r, col_index: this.state.gridValues[r].indexOf(value)}, { row_index: new_c.indexOf(value), col_index: c}, { row_index: Math.floor(r-r_pivot+new_squ.indexOf(value)/3), col_index: c-c_pivot+new_squ.indexOf(value)%3}]})
            return true;
        }
        else
        {
            this.setState({conflicts: [{ row_index: -1, col_index: -1 }]})
            return false;
        }
    }

    componentDidMount = () => {
        window.addEventListener('keydown', this.handleKeyDownEvent);
    }

    loadProblem = async (name) => {
        this.setState({
            loading: true,
            problem: null,
            gridValues: null,
            selectedGrid: { row_index: -1, col_index: -1 }
        });

        const problem = await require(`../problems/${name}`)
        if (problem.content !== undefined) {
            let gridValues = [];
            for (let i = 0; i < problem.content.length; i++)
                gridValues[i] = problem.content[i].slice();
            this.setState({ problem: problem, gridValues: gridValues, loading: false });
        }
    }

    extractArray(array, col_index, row_index) {
        let rt = []
        for (let i = row_index; i < row_index + 3; i++) {
            for (let j = col_index; j < col_index + 3; j++) {
                rt.push(array[i][j])
            }
        }
        return rt;
    }

    render() {
        const fxProps = {
            count: 3,
            interval: 700,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            colors: ['#cc3333', '#81C784'],
            calc: (props, i) => ({
                ...props,
                x: (i + 1) * (window.innerWidth / 3) * Math.random(),
                y: window.innerHeight * Math.random()
            })
        }
        return (
            <>
                <Header problemList={problemList} loadProblem={this.loadProblem} gridValues={this.state.gridValues} problem={this.state.problem} />
                {this.state.loading ? (<ReactLoading type={"bars"} color={"#777"} height={"40vh"} width={"40vh"} />) : (
                    <div id="game-board" className="gameBoard" style={{ border: this.state.gameBoardBorderStyle }}>
                        <div className="row">
                            <Grid_9x9 row_offset={0} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={3} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={6} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                    </div>
                )}
                {this.state.completeFlag ? (<Fireworks {...fxProps} />) : null}
                {this.state.loading ? null : (<ScreenInputKeyBoard handleScreenKeyboardInput={this.handleScreenKeyboardInput} />)}
            </>
        );
    }
}

export default Sudoku;