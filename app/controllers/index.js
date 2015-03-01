
// Reset le score si besoin
/*Ti.App.Properties.setObject('bestScore', {
	'score': 0,
	'solvedMatrix': null,
	'emptySquares': null
});*/

var bestScore = getBestScore();

if (bestScore != undefined && bestScore.score != undefined) {
	var message = 'Pas de meilleur score';

	if (bestScore.score > 0) {
		$.buttonReplay.enabled = "true";
		$.buttonReplay.touchEnabled = "true";
		
		var h = Math.floor(bestScore.score / (60 * 60 * 1000));
		var m = Math.floor(bestScore.score % (60 * 60 * 1000) / (60 * 1000));
		var s = Math.floor(bestScore.score % (60 * 60 * 1000) % (60 * 1000) / 1000);

		message = 'Meilleur score : ' + h + ' heure, ' + m + ' minutes, ' + s + ' secondes';
	}

	$.bestScore.text = message;
}

$.index.open();

function replay() {
	if (bestScore.solvedMatrix != null && bestScore.emptySquares != null) {
		var gridView = Alloy.createController('grid', {'method': 'replay'});
	
		gridView.getView().open();
	}
}

// Lancement d'une partie
function start(e) {
    var gridView = Alloy.createController('grid');
    
    gridView.getView().open({animation: true});
}

// Retrouver le meilleur score
function getBestScore() {
	var bestScore = Ti.App.Properties.getObject('bestScore');

	return bestScore;
}