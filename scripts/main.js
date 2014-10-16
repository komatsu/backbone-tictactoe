require.config({
    paths: {
        'jquery': 'lib/jquery-2.1.1.min',
        'underscore': 'lib/underscore-min',
        'backbone': 'lib/backbone-min'
    },
    shim: {
        'underscore': {
            exports: '_'
        }
    }
});

require(
    [
        'jquery',
        'underscore',
        'backbone',
        'models/game',
        'models/scoreboard',
        'views/gameView',
        'views/scoreboardView'
    ],
    function(
        $,
        _,
        Backbone,
        Game,
        Scoreboard,
        GameView,
        ScoreboardView
    ) {
        var currentGame = new Game(),
            scoreboard = new Scoreboard(),
            gameView,
            scoreboardView;

        gameView = new GameView({
            model: currentGame,
            el: ".e-gameboard"
        });

        scoreboardView = new ScoreboardView({
            model: scoreboard,
            el: ".e-scoreboard"
        });

        gameView.render();
        scoreboardView.render();

        scoreboard.listenTo(gameView, "win", scoreboard.incrementScore);
        scoreboard.listenTo(gameView, "turnChange", scoreboard.changeTurn);
    }
);