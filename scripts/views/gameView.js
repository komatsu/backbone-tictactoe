define(
    ['backbone', 'underscore'],
    function(Backbone) {

        var GameView = Backbone.View.extend({

            template: $("#gameTemplate").html(),
            oMarker: $("#o-marker").html(),
            xMarker: $("#x-marker").html(),

            events: {
                "click .e-game-cell": "makeMove",
            },

            render: function() {
                this.$el.html(this.template)
                return this;
            },

            resetGame: function(newGameModel) {
                this.$(".e-reset-btn").off();
                this.model.set(this.model.defaults());
                this.render().delegateEvents();
                this.trigger("turnChange", this.model.get("currentTurn"));
            },

            makeMove: function(evt) {
                var $target = $(evt.currentTarget),
                    currentPlayer = this.model.get("currentTurn"),
                    nextPlayer,
                    row,
                    col,
                    marker,
                    winCells;

                evt.preventDefault();
                row = $target.data("row");
                col = $target.data("col");

                //Ignore cells that were already selected
                if (this.model.get("cells")[row][col]) {
                    return;
                }

                this.model.markCell(currentPlayer, row, col);

                if (currentPlayer === "o") {
                    marker = this.oMarker;
                    nextPlayer = "x";
                }
                else { //x's turn
                    marker = this.xMarker;
                    nextPlayer = "o";
                }

                $target.removeClass("open").append(marker);

                //Check game state for win or tie after this move
                winCells = this.model.verifyWin(currentPlayer, row, col);

                if (!winCells) {
                    this.model.set("currentTurn", nextPlayer);
                    this.trigger("turnChange", nextPlayer); //Scoreboard will update turn icon
                }
                else if (winCells === "tie") {
                    this.endGame();
                }
                else if (winCells instanceof Array && winCells.length === 3) {
                    this.trigger("win", currentPlayer); //Scoreboard will update on "win" event
                    this.showWinners(winCells);
                }
            },

            showWinners: function(winCells) {
                var $cell;

                _.each(winCells, function(cellCoordinates) {
                    $cell = this.$(".e-cell-" + cellCoordinates[0] + "-" + cellCoordinates[1]);
                    $cell.addClass("winner");
                });

                this.endGame();
            },

            endGame: function() {
                this.undelegateEvents();
                this.$(".e-reset-btn").removeClass("invisible").on("click", this.resetGame.bind(this));
            }
        });

        return GameView;
    }
);