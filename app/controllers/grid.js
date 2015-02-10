// Chargement de la librairie de gestion du Sudoku
var Sudoku = require('com.sudoku');
var args   = arguments[0] || {};

// Grille du Sudoku
var thePuzzle;

// TODO: à virer ?
// stores the last cell clicked on by the user.
var selectedCell;

// Si le replay de la meilleure partie est demandé
if (args.method == 'replay') {
	replay();	
}
else {
	// Démarre une partie
	init();
}

function init() {
    thePuzzle = new Sudoku();

    // Initialise les cases
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
        	// Récupération du textfield correspondant à une case
        	var textfield = $['txt_' + i + '_' + j];

			// TODO: à virer ?
            textfield.addEventListener('click', selectCell);

			// Pour chaque modification de valeur de la case, vérifie si la grille est finie
            textfield.addEventListener('change', function(e) {
            	if ((val = thePuzzle.gameFinished()) != 0) {
			        unselectCell();
			        var h = Math.floor(val / (60 * 60 * 1000));
			        var m = Math.floor(val % (60 * 60 * 1000) / (60 * 1000));
			        var s = Math.floor(val % (60 * 60 * 1000) % (60 * 1000) / 1000);
			
					var matrix = thePuzzle.getMatrix();
			
					setBestScore(val, matrix);
			
			        alert('Jeu terminé : ' + h + ' heure, ' + m + ' minutes, ' + s + ' secondes');
			
			        backHome();
			    }
            });

            // if the value is 0, create a blank cell
            if (thePuzzle.getVal(i, j) == 0) {
                textfield.value = '';
            }
            else {
                // if the value is not 0, set the value and mark the cell as a hint.
                textfield.value = thePuzzle.getVal(i, j);
                $.addClass(textfield, 'hint');
            }
        }
    }

    newGame();
}

function newGame() {
    unselectCell();

    thePuzzle.done = function() {
        // console.log("done");
        // update the board with the new puzzle data.
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var textfield = $['txt_' + i + '_' + j];
                
                $.removeClass(textfield, 'error');
                
                if (thePuzzle.getVal(i, j) == 0) {
                    $.removeClass(textfield, 'hint');
                    $.addClass(textfield, 'empty');
                    textfield.value = '';
                }
                else {
                    textfield.value = thePuzzle.getVal(i, j);
                    $.addClass(textfield, 'hint');
                    textfield.setFocusable(false);
                    textfield.setEditable(false);
                    textfield.setTouchEnabled(false);
                }
            }
        }
    };

    // generate the new puzzle.
    thePuzzle.newGame();
}

// selects the cell clicked on by the user.
function selectCell() {
    unselectCell();

    // if the cell is one that was automatically populated just return and
    // not allow the cell to be selected.
    if (containsClass(this, 'hint')) {
        return;
    }

    // save the selected cell and highlight the square on the board.
    selectedCell = this;
    $.addClass(selectedCell, 'selected');
 
 	var id;
 	var arr;
 	
 	if(selectedCell) {
        id  = selectedCell.id.substr(1);
        arr = id.split('_');
    }
 
 	row = arr[0];
 	col = arr[1];
 	val = 0;
 
    // set the puzzle value and draw the value in the cell.
    thePuzzle.setVal(1 * row, 1 * col, val);
    selectedCell.value = (val > 0) ? val : '';

    // check for conflicting values according to the sudoku rules and mark them.
    // showErrors(1 * row, 1 * col);

    // check to see if the game is done.
    if ((val = thePuzzle.gameFinished()) != 0) {
        unselectCell();

        var h = Math.floor(val / (60 * 60 * 1000));
        var m = Math.floor(val % (60 * 60 * 1000) / (60 * 1000));
        var s = Math.floor(val % (60 * 60 * 1000) % (60 * 1000) / 1000);
        
		var matrix = thePuzzle.getMatrix();

		setBestScore(val, matrix);
        
        alert('Jeu terminé : ' + h + ' heure, ' + m + ' minutes, ' + s + ' secondes');

        backHome();
    }
}

// unselects the selected cell. values entered are ignored until a cell is selected again.
function unselectCell() {
    if(selectedCell) {
        $.removeClass(selectedCell, 'selected');
    }
    
    selectedCell = null;
}

// determines whether or not an html element has the given class.
function containsClass(el, name) {
    var classes = el.className;
    var arr;
    
    if(classes)
        arr = classes.split(' ');
    else
        arr = new Array();

    return contains(arr, name);
}

// Retour à la page d'accueil
function backHome(e) {
    $.grid.close();
}
    
getVal2 = function(test, row, col) {
  return test[row * 9 + col];
};

function solve() {	
	var test = thePuzzle.save;

	for(var i = 0; i < 9; i++) {
		for(var j = 0; j < 9; j++) {
			var textfield = $['txt_' + i + '_' + j];

			if (textfield.value == '') {
				textfield.value = getVal2(test, i, j);    
				thePuzzle.setVal(i, j, getVal2(test, i, j));
				textfield.fireEvent('change');

				return;
			}

			// showErrors(i, j);
		}
	}
}

// Sauvegarde le meilleur score et la grille associée à la partie
function setBestScore(val, matrix) {
	var bestScore = getBestScore();
	var score     = bestScore.score;
	
	if (bestScore.score != 0 && val < score) {
		score = val;
	}
	
	Ti.App.Properties.setObject('bestScore', {
		'score': score,
		'matrix': matrix
	});
}

// Récupère le meilleur score et la grille associée à la partie
function getBestScore() {
	var bestScore = Ti.App.Properties.getObject('bestScore');
	
	return (bestScore != undefined) ? bestScore : 0;
}

// Rejoue la meilleure partie
function replay() {
	var bestScore = getBestScore();

	console.log(bestScore.matrix);

	if (bestScore == undefined || bestScore.matrix == undefined) {
		return false;
	}

	thePuzzle = new Sudoku();

	thePuzzle.setMatrix(bestScore.matrix);

    // Initialise les cases
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
        	// Récupération du textfield correspondant à une case
        	var textfield = $['txt_' + i + '_' + j];

            // if the value is 0, create a blank cell
            if (thePuzzle.getVal(i, j) == 0) {
                textfield.value = '';
            }
            else {
                // if the value is not 0, set the value and mark the cell as a hint.
                textfield.value = thePuzzle.getVal(i, j);
                $.addClass(textfield, 'hint');
            }
        }
    }

    // Suite est : newGame();

    // update the board with the new puzzle data.
    for (var i = 0; i < 9; i++) {
    	for (var j = 0; j < 9; j++) {
        	var textfield = $['txt_' + i + '_' + j];
                
            if (thePuzzle.getVal(i, j) == 0) {
            	$.removeClass(textfield, 'hint');
                $.addClass(textfield, 'empty');
                textfield.value = '';
            }
            else {
            	textfield.value = thePuzzle.getVal(i, j);
                $.addClass(textfield, 'hint');
            }
        }
    }

    // generate the new puzzle.
    // thePuzzle.newGame();
}