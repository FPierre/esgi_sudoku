var bestScore = getBestScore();

if (bestScore != undefined && bestScore.score != undefined) {	
	var h = Math.floor(bestScore.score / (60 * 60 * 1000));
	var m = Math.floor(bestScore.score % (60 * 60 * 1000) / (60 * 1000));
	var s = Math.floor(bestScore.score % (60 * 60 * 1000) % (60 * 1000) / 1000);
	
	$.bestScore.text = 'Meilleur score : ' + h + ' heure, ' + m + ' minutes, ' + s + ' secondes';
}

function replay(e) {  
    var gridView = Alloy.createController('grid', {'method': 'replay'});

    gridView.getView().open();
}

// Lancement d'une partie
function start(e) {
    var gridView = Alloy.createController('grid');
    
    gridView.getView().open({animation: true});
}

$.index.open();

function getBestScore() {
	var bestScore = Ti.App.Properties.getObject('bestScore');
	
	return (bestScore != undefined) ? bestScore : 0;
}