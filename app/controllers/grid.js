// Chargement de la librairie de gestion du Sudoku
var Sudoku = require('com.sudoku');
var args   = arguments[0] || {};

// Grille du Sudoku
var thePuzzle;

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

            // if the value is 0, create a blank cell
            if (thePuzzle.getVal(i, j) == 0) {
                textfield.value = '';
            
            textfield.addEventListener('click', selectCell);

			// Pour chaque modification de valeur de la case, vérifie si la grille est finie
            textfield.addEventListener('change', function(e) {
            	if ((val = thePuzzle.gameFinished()) != 0) {
			        unselectCell();
			        var h = Math.floor(val / (60 * 60 * 1000));
			        var m = Math.floor(val % (60 * 60 * 1000) / (60 * 1000));
			        var s = Math.floor(val % (60 * 60 * 1000) % (60 * 1000) / 1000);
			
					var solvedMatrix = thePuzzle.getSolvedMatrix();
					var emptySquares = getEmptySquares();

					setBestScore(val, solvedMatrix, emptySquares);
			
			        alert('Jeu terminé : ' + h + ' heure, ' + m + ' minutes, ' + s + ' secondes');
			
			        backHome();
			    }
            });
            }
            else {
                // if the value is not 0, set the value and mark the cell as a hint.
                textfield.value = thePuzzle.getVal(i, j);
                $.addClass(textfield, 'hint');

                textfield.setFocusable(false);
                textfield.setEditable(false);
                textfield.setTouchEnabled(false);
            }
        }
    }

    newGame();
}

function newGame() {
    unselectCell();

    thePuzzle.done = function() {
    	var emptySquares = new Array();

        // update the board with the new puzzle data.
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var textfield = $['txt_' + i + '_' + j];
                
                $.removeClass(textfield, 'error');

                if (thePuzzle.getVal(i, j) == 0) {
                    $.removeClass(textfield, 'hint');
                    $.addClass(textfield, 'empty');
                    textfield.value = '';
                    emptySquares.push(0);
                }
                else {
                    textfield.value = thePuzzle.getVal(i, j);
                    $.addClass(textfield, 'hint');
                    textfield.setFocusable(false);
                    textfield.setEditable(false);
                    textfield.setTouchEnabled(false);
                    emptySquares.push(1);              
                }
            }
        }
        
        setEmptySquares(emptySquares);
    };

    // generate the new puzzle.
    thePuzzle.newGame();
}

function setEmptySquares(array) {
	Ti.App.Properties.setObject('empty', array);
}

function getEmptySquares() {
	return Ti.App.Properties.getObject('empty');
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

    // check to see if the game is done.
    if ((val = thePuzzle.gameFinished()) != 0) {
        unselectCell();

        var h = Math.floor(val / (60 * 60 * 1000));
        var m = Math.floor(val % (60 * 60 * 1000) / (60 * 1000));
        var s = Math.floor(val % (60 * 60 * 1000) % (60 * 1000) / 1000);
        
		var solvedMatrix = thePuzzle.getSolvedMatrix();
		var emptySquares = getEmptySquares();

		setBestScore(val, solvedMatrix, emptySquares);
        
        alert('Jeu terminé : ' + h + ' heure, ' + m + ' minutes, ' + s + ' secondes');

        backHome();
    }
}

// unselects the selected cell. values entered are ignored until a cell is selected again.
function unselectCell() {
    if (selectedCell) {
        $.removeClass(selectedCell, 'selected');
    }
    
    selectedCell = null;
}

// determines whether or not an html element has the given class.
function containsClass(el, name) {
    var classes = el.className;
    var arr;
    
    if (classes) {
        arr = classes.split(' ');
    }
    else {
        arr = new Array();
	}

    return contains(arr, name);
}

// Retour à la page d'accueil
function backHome(e) {
    $.grid.close();
}
    
getVal2 = function(array, row, col) {
  return array[row * 9 + col];
};

function solve() {	
	var array = thePuzzle.save;

	for(var i = 0; i < 9; i++) {
		for(var j = 0; j < 9; j++) {
			var textfield = $['txt_' + i + '_' + j];

			if (textfield.value == '') {
				textfield.value = getVal2(array, i, j);    
				thePuzzle.setVal(i, j, getVal2(array, i, j));
				textfield.fireEvent('change');

				return;
			}
		}
	}
}

// Sauvegarde le meilleur score et la grille associée à la partie
function setBestScore(val, solvedMatrix, emptySquares) {
	var bestScore = getBestScore();
	var score     = bestScore.score;

	if (score == 0 || val < score) {
		score = val;
	}

	Ti.App.Properties.setObject('bestScore', {
		'score': score,
		'solvedMatrix': solvedMatrix,
		'emptySquares': emptySquares
	});
}

// Récupère le meilleur score et la grille associée à la partie
function getBestScore() {
	var bestScore = Ti.App.Properties.getObject('bestScore');

	return bestScore;
}

// Rejoue la meilleure partie
function replay() {
	var bestScore = getBestScore();

	if (bestScore == undefined || bestScore.solvedMatrix == undefined || bestScore.emptySquares == undefined) {
		return false;
	}

	$.buttonSolve.hide();

	thePuzzle = new Sudoku();

	thePuzzle.setMatrix(bestScore.solvedMatrix);

	var number = 0;

    // Initialise les cases
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
        	// Récupération du textfield correspondant à une case
        	var textfield = $['txt_' + i + '_' + j];

            if (bestScore.emptySquares[number] == 0) {
            	$.removeClass(textfield, 'hint');
                $.addClass(textfield, 'empty');
                textfield.value = '';
            }
            else {
                textfield.value = thePuzzle.getVal(i, j);
                $.addClass(textfield, 'hint');
            }
            
            number++;
        }
        
        number++;
    }

	for (var i = 0; i < 9; i++) {
    	for (var j = 0; j < 9; j++) {
    		// Récupération du textfield correspondant à une case
    		var textfield = $['txt_' + i + '_' + j];

        	if (textfield.value == '') {
				textfield.value = thePuzzle.getVal(i, j);
			}
        }
    }
}