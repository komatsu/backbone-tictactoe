define(
    [
        'jquery',
        'underscore',
        'backbone'
    ],
    function($, _, Backbone) {
        //Class to represent a TicTacToe game. Pass in "o" to designate circle's turn; else "x" starts
        var Game = Backbone.Model.extend({

            defaults: function() {
                return {
                    currentTurn: "o", //o or x
                    numCellsFilled: 0,
                    cells: [[null, null, null], [null, null, null], [null, null, null]]
                };
            },

            initialize: function() {
                var currentTurn = this.get("currentTurn");

                //Safety check to make sure only o or x are used for turns
                if (currentTurn !== "o" && currentTurn !== "x") {
                    this.set("currentTurn", "o");
                }
            },

            markCell: function(player, row, col) {
                var cells,
                    numCellsFilled;

                if (player !== "o" && player !== "x") {
                    throw "Unknown player";
                }

                cells = _.clone(this.get("cells"));
                numCellsFilled = this.get("numCellsFilled");
                cells[row][col] = player;

                this.set({
                    numCellsFilled: numCellsFilled + 1, //keep track of total game cells played
                    cells: cells
                });
            },

            verifyWin: function(player, lastMoveRow, lastMoveCol) {
                var winningCells,
                    cells;

                if (player !== "o" && player !== "x") {
                    throw "Unknown player";
                }

                if (winningCells = this.getHorizontalWinCells(player, lastMoveRow, lastMoveCol)) {
                    return winningCells;
                }

                if (winningCells = this.getVerticalWinCells(player, lastMoveRow, lastMoveCol)) {
                    return winningCells;
                }

                if (winningCells = this.getDiagonalWinCells(player, lastMoveRow, lastMoveCol)) {
                    return winningCells;
                }
                
                //No win. Check for tie
                if (this.get("numCellsFilled") === 9) {
                    return "tie";
                }

                return false; //false to indicate no win
            },

            getHorizontalWinCells: function(player, lastMoveRow, lastMoveCol) {
                var winningCells = [],
                    cells = this.get("cells");

                for (var i = 0; i < 3; i++) {
                    if (cells[lastMoveRow][i] !== player) {
                        return false;
                    }

                    winningCells.push([lastMoveRow, i]);
                }

                return winningCells;
            },

            getVerticalWinCells: function(player, lastMoveRow, lastMoveCol) {
                var winningCells = [],
                    cells = this.get("cells");

                for (var i = 0; i < 3; i++) {
                    if (cells[i][lastMoveCol] !== player) {
                        return false;
                    }

                    winningCells.push([i, lastMoveCol]);
                }

                return winningCells;
            },

            getDiagonalWinCells: function(player, lastMoveRow, lastMoveCol) {
                var winningCells = [],
                    cells = this.get("cells"),
                    difference = Math.abs(lastMoveRow - lastMoveCol);

                //Last move was not in a diagonal-possible cell.
                if (difference === 1) {
                    return false;
                }

                //Row equals Col --> [0,0], [1,1], [2,2] are a diagonal win possibility
                if (lastMoveRow === lastMoveCol) {
                    for (var i = 0; i < 3; i++) {
                        if (cells[i][i] !== player) {
                            winningCells = [];
                            break;
                        }

                        winningCells.push([i, i]);
                    }
                }
                if (winningCells.length) {
                    return winningCells;
                }

                //Row and Col are 2 off or last move was [1,1]--> [0,2], [1,1], and [2,0] can win
                if (difference === 2 || (lastMoveRow === 1 && lastMoveCol === 1)) {
                    for (var i = 0; i < 3; i++) {
                        if (cells[i][2-i] !== player) {
                            return false;
                        }
                        winningCells.push([i, 2-i]);
                    }
                }
                if (winningCells && winningCells.length === 3) {
                    return winningCells;
                }

                return false; //No diagonal win
            }

        });

        return Game;
    }
);