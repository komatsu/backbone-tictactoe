define(
    ['backbone'],
    function(Backbone) {

        var Scoreboard = Backbone.Model.extend({
            defaults: {
                oScore: 0,
                xScore: 0,
                currentTurn: "o"
            },

            incrementScore: function(player) {
                var key = player + "Score"; //oScore or xScore

                this.set(key, this.get(key) + 1);
            },

            changeTurn: function(player) {
                this.set("currentTurn", player);
            }
        });

        return Scoreboard;
    }
);