contains = function(ar, obj) {
    var i = ar.length;
    while (i--) {
        if (ar[i] === obj) {
            return true;
        }
    }
    return false;
};

clear = function(ar) {
	var i = ar.length;
	while (i--) {
    	ar[i] = 0;
	}
};

var timeDiff  =  {
    // this method marks the beginning of an event.
    start:function (){
        d = new Date();
        time  = d.getTime();
    },

    // this method returns the time elapsed in milliseconds since the
    // beginning of an event.
    end:function (){
        d = new Date();
        return (d.getTime()-time);
    }
};

function Sudoku() {
    this.matrix = new Array(81);

    // initial puzzle is all zeros.
    clear(this.matrix);

    // stores the difficulty level of the puzzle 0 is easiest.
    this.level = 0;

    this.shuffle = function(matrix) {
        for (var i = 0; i < 9; i++)
            for (var j = 0; j < 9; j++)
                matrix[i * 9 + j] = (i*3 + Math.floor(i/3) + j) % 9 + 1;

        for(var i = 0; i < 42; i++) {
            var n1 = Math.ceil(Math.random() * 9);
            var n2;
            do {
                n2 = Math.ceil(Math.random() * 9);
            }
            while(n1 == n2);

            for(var row = 0; row < 9; row++) {
                for(var col = 0; col < col; k++) {
                    if(matrix[row * 9 + col] == n1)
                        matrix[row * 9 + col] = n2;
                    else if(matrix[row * 9 + col] == n2)
                        matrix[row * 9 + col] = n1;
                }
            }
        }

        for (var c = 0; c < 42; c++) {
            var s1 = Math.floor(Math.random() * 3);
            var s2 = Math.floor(Math.random() * 3);

            for(var row = 0; row < 9; row++) {
                var tmp = this.matrix[row * 9 + (s1 * 3 + c % 3)];
                this.matrix[row * 9 + (s1 * 3 + c % 3)] = this.matrix[row * 9 + (s2 * 3 + c % 3)];
                this.matrix[row * 9 + (s2 * 3 + c % 3)] = tmp;
            }
        }

        for (var s = 0; s < 42; s++) {
            var c1 = Math.floor(Math.random() * 3);
            var c2 = Math.floor(Math.random() * 3);

            for(var row = 0; row < 9; row++) {
                var tmp = this.matrix[row * 9 + (s % 3 * 3 + c1)];
                this.matrix[row * 9 + (s % 3 * 3 + c1)] = this.matrix[row * 9 + (s % 3 * 3 + c2)];
                this.matrix[row * 9 + (s % 3 * 3 + c2)] = tmp;
            }
        }

        for (var s = 0; s < 42; s++) {
            var r1 = Math.floor(Math.random() * 3);
            var r2 = Math.floor(Math.random() * 3);

            for(var col = 0; col < 9; col++)
            {
                var tmp = this.matrix[(s % 3 * 3 + r1) * 9 + col];
                this.matrix[(s % 3 * 3 + r1) * 9 + col] = this.matrix[(s % 3 * 3 + r2) * 9 + col];
                this.matrix[(s % 3 * 3 + r2) * 9 + col] = tmp;
            }
        }
    };

    this.maskBoardEasy = function(matrix, mask) {
        var i, j, k;
        for(i = 0; i < 81; i++)
            mask[i] = matrix[i];

        /*for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 5; k++) {
                    var c;
                    do {
                        c = Math.floor(Math.random() * 9);
                    }
                    while(mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] == 0);

                    mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] = 0;
                }
            }
        }*/
       
       for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 1; k++) {
                    var c;
                    do {
                        c = Math.floor(Math.random() * 9);
                    }
                    while(mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] == 0);

                    mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] = 0;
                }
            }
        }
    };

    this.getAvailable = function(matrix, cell, avail)
    {
        var i, j, row, col, r, c;
        var arr = new Array(9);
        clear(arr);

        row = Math.floor(cell / 9);
        col = cell % 9;

        // row
        for(i = 0; i < 9; i++)
        {
            j = row * 9 + i;
            if(matrix[j] > 0)
                arr[matrix[j] - 1] = 1;
        }

        // col
        for(i = 0; i < 9; i++)
        {
            j = i * 9 + col;
            if(matrix[j] > 0)
            {
                arr[matrix[j] - 1] = 1;
            }
        }

        // square
        r = row - row % 3;
        c = col - col % 3;
        for(i = r; i < r + 3; i++)
            for(j = c; j < c + 3; j++)
                if(matrix[i * 9 + j] > 0)
                    arr[matrix[i * 9 + j] - 1] = 1;

        j = 0;
        if(avail != null)
        {
            for(i = 0; i < 9; i++)
                if(arr[i] == 0)
                    avail[j++] = i + 1;
        }
        else
        {
            for(i = 0; i < 9; i++)
                if(arr[i] == 0)
                    j++;
            return j;
        }

        if(j == 0)
            return 0;

        for(i = 0; i < 18; i++)
        {
            r = Math.floor(Math.random() * j);
            c = Math.floor(Math.random() * j);
            row = avail[r];
            avail[r] = avail[c];
            avail[c] = row;
        }

        return j;
    };

    this.getCell = function(matrix)
    {
        var cell = -1, n = 10, i, j;
        var avail = new Array(9);
        clear(avail);

        for(i = 0; i < 81; i++)
        {
            if(matrix[i] == 0)
            {
                j = this.getAvailable(matrix, i, null);

                if(j < n)
                {
                    n = j;
                    cell = i;
                }

                if (n == 1)
                    break;
            }
        }

        return cell;
    };

    this.solve = function(matrix)
    {
        var i, j, ret = 0;
        var cell = this.getCell(matrix);

        if(cell == -1)
            return 1;

        var avail = new Array(9);
        clear(avail);

        j = this.getAvailable(matrix, cell, avail);
        for(i = 0; i < j; i++)
        {
            matrix[cell] = avail[i];

            // if we found a solution, return 1 to the caller.
            if(this.solve(matrix) == 1)
                return 1;
        }

        matrix[cell] = 0;
        return 0;
    };

    this.enumSolutions = function(matrix)
    {
        var i, j, ret = 0;
        var cell = this.getCell(matrix);

        // if getCell returns -1 the board is completely filled which
        // means we found a solution. return 1 for this solution.
        if(cell == -1)
            return 1;

        var avail = new Array(9);
        clear(avail);

        j = this.getAvailable(matrix, cell, avail);
        for(i = 0; i < j; i++)
        {
            // we try each available value in the array and count
            // how many solutions are produced.
            matrix[cell] = avail[i];

            ret += this.enumSolutions(matrix);

            // for the purposes of the mask function, if we found
            // more than one solution, we can quit searching now
            // so the mask algorithm can try a different value.
            if(ret > 1)
                break;
        }

        matrix[cell] = 0;
        return ret;
    };

    this.maskBoard = function(matrix, mask)
    {
        var i, j, k, r, c, n = 0, a, hints = 0, cell, val;
        var avail = new Array(9);
        clear(avail);

        var tried = new Array(81);
        clear(tried);

        // start with a cleared out board
        clear(mask);

        do
        {
            // choose a cell at random.
            do
            {
                cell = Math.floor(Math.random() * 81);
            }
            while((mask[cell] != 0) || (tried[cell] != 0));
            val = matrix[cell];

            // see how many values can go in the cell.
            i = this.getAvailable(mask, cell, null);

            if(i > 1)
            {
                // two or more values can go in the cell based
                // on values used in each zone.
                //
                // check each zone and make sure the selected
                // value can also be used in at least one other
                // cell in the zone.
                var cnt, row = Math.floor(cell / 9), col = cell % 9;

                cnt = 0; // count the cells in which the value
                     // may be used.

                // look at each cell in the same row as the
                // selected cell.
                for(i = 0; i < 9; i++)
                {   
                    // don't bother looking at the selected
                    // cell. we already know the value will
                    // work.
                    if(i == col)
                        continue;

                    j = row * 9 + i; // j stores the cell index

                    // if the value is already filled, skip
                    // to the next.
                    if(mask[j] > 0)
                        continue;

                    // get the values that can be used in
                    // the cell.
                    a = this.getAvailable(mask, j, avail);

                    // see if our value is in the available
                    // value list.
                    for(j = 0; j < a; j++)
                    {
                        if(avail[j] == val)
                        {
                            cnt++;
                            break;
                        }
                        avail[j] = 0;
                    }
                }

                // if the count is greater than zero, the
                // selected value could also be used in another
                // cell in that zone. we repeat the process with
                // the other two zones.
                if(cnt > 0)
                {
                    // col
                    cnt = 0;
                    for(i = 0; i < 9; i++)
                    {
                        if(i == row)
                            continue;

                        j = i * 9 + col;
                        if(mask[j] > 0)
                            continue;
                        a = this.getAvailable(mask, j, avail);
                        for(j = 0; j < a; j++)
                        {
                            if(avail[j] == val)
                            {
                                cnt++;
                                break;
                            }
                            avail[j] = 0;
                        }
                    }

                    // if the count is greater than zero,
                    // the selected value could also be used
                    // in another cell in that zone. we
                    // repeat the process with the last
                    // zone.
                    if(cnt > 0)
                    {
                        // square
                        cnt = 0;
                        r = row - row % 3;
                        c = col - col % 3;
                        for(i = r; i < r + 3; i++)
                        {
                            for(j = c; j < c + 3; j++)
                            {
                                if((i == row) && (j == col))
                                    continue;
    
                                k = i * 9 + j;
                                if(mask[k] > 0)
                                    continue;
                                a = this.getAvailable(mask, k, avail);
                                for(k = 0; k < a; k++)
                                {
                                    if(avail[k] == val)
                                    {
                                        cnt++;
                                        break;
                                    }
                                    avail[k] = 0;
                                }
                            }
                        }

                        if(cnt > 0)
                        {
                            mask[cell] = val;
                            hints++;
                        }
                    }
                }
            }

            tried[cell] = 1;
            n++;
        }
        while(n < 81);

        // at this point we should have a masked board with about 40 to
        // 50 hints. randomly select hints and remove them. for each
        // removed hint, see if there is still a single solution. if so,
        // select another hint and repeat. if not, replace the hint and
        // try another.
        do
        {
            do
            {
                cell = Math.floor(Math.random() * 81);
            }
            while((mask[cell] == 0) || (tried[cell] == 0));

            val = mask[cell];

            var t = this;
            var solutions = 0;

            mask[cell] = 0;
            solutions = this.enumSolutions(mask);

            if(solutions > 1)
                mask[cell] = val;

            tried[cell] = 0;
            hints--;
        }
        while(hints > 0);

        // at this point we have a board with about 20 to 25 hints and a
        // single solution.
    };

    this._checkVal = function(matrix, row, col, val) {
        var i, j, r, c;
        // check each cell in the row to see if the value already
        // exists in the row. do not look at the value of the cell in
        // the column we are trying. repeat for each zone.
        for(i = 0; i < 9; i++)
        {
            if((i != col) && (matrix[row * 9 + i] == val))
                return false;
        }

        // check col
        for(i = 0; i < 9; i++)
        {
            if((i != row) && (matrix[i * 9 + col] == val))
                return false;
        }

        // check square
        r = row - row % 3;
        c = col - col % 3;
        for(i = r; i < r + 3; i++)
            for(j = c; j < c + 3; j++)
                if(((i != row) || (j != col)) && (matrix[i * 9 + j] == val))
                    return false;

        return true;
    };

    this.checkVal = function(row, col, val)
    {
        return this._checkVal(this.matrix, row, col, val);
    };

    this.setVal = function(row, col, val)
    {
        this.matrix[row * 9 + col] = val;
    };

    this.getVal = function(row, col)
    {
        return this.matrix[row * 9 + col];
    };

    this._newGame = function() {
        var i, hints = 0;
        var mask = new Array(81);

        // clear out the game matrix.
        clear(this.matrix);

        // call the solver on a completely empty matrix. this will
        // generate random values for cells resulting in a solved board.
        this.solve(this.matrix);

        // generate hints for the solved board. if the level is easy,
        // use the easy mask function.
        if(this.level == 0)
        {
            this.maskBoardEasy(this.matrix, mask);
        }
        else
        {
            // the level is medium or greater. use the advanced mask
            // function to generate a minimal sudoku puzzle with a
            // single solution.
            this.maskBoard(this.matrix, mask);

            // if the level is medium, randomly add 4 extra hints.
            if(this.level == 1)
            {
                for(i = 0; i < 4; i++)
                {
                    do
                    {
                        var cell = Math.floor(Math.random() * 81);
                    }
                    while(mask[cell] != 0);

                    mask[cell] = this.matrix[cell];
                }
            }
        }

        // save the solved matrix.
        this.save = this.matrix;

        // set the masked matrix as the puzzle.
        this.matrix = mask;

        timeDiff.start();
    };

    this.done;

    this._doHints = function(matrix, mask, tried, hints)
    {
        // at this point we should have a masked board with about 40 to
        // 50 hints. randomly select hints and remove them. for each
        // removed hint, see if there is still a single solution. if so,
        // select another hint and repeat. if not, replace the hint and
        // try another.
        if(hints > 0)
        {
            do
            {
                cell = Math.floor(Math.random() * 81);
            }
            while((mask[cell] == 0) || (tried[cell] == 0));

            val = mask[cell];

            var t = this;
            var solutions = 0;

            mask[cell] = 0;
            solutions = this.enumSolutions(mask);
            //console.log("timeout");

            if(solutions > 1)
                mask[cell] = val;

            tried[cell] = 0;
            hints--;
            var t = this;
            setTimeout(function(){t._doHints(matrix, mask, tried, hints);}, 50);
        }
        else
        {
            this.save = this.matrix;
            this.matrix = mask;
            this.done();
        }

        //console.log(hints);

        // at this point we have a board with about 20 to 25 hints and a
        // single solution.
    };

    this._doMask = function(matrix, mask)
    {
        var i, j, k, r, c, n = 0, a, hints = 0, cell, val;
        var avail = new Array(9);
        clear(avail);

        var tried = new Array(81);
        clear(tried);

        // start with a cleared out board
        clear(mask);

        // randomly add values from the solved board to the masked
        // board, picking only cells that cannot be deduced by existing
        // values in the masked board.
        //
        // the following rules are used to determine the cells to
        // populate:
        // 1. based on the three zones to which the cell belongs, if
        // more than one value can go in the cell (i.e. the selected
        // cell value and at least one other value), check rule two.
        // 2. for each zone, if the selected value could go in another
        // free cell in the zone then the cell may be selected as a
        // hint. this rule must be satisfied by all three zones.
        //
        // both rules must pass for a cell to be selected. once all 81
        // cells have been checked, the masked board will represent a
        // puzzle with a single solution.
        do
        {
            // choose a cell at random.
            do
            {
                cell = Math.floor(Math.random() * 81);
            }
            while((mask[cell] != 0) || (tried[cell] != 0));
            val = matrix[cell];

            // see how many values can go in the cell.
            i = this.getAvailable(mask, cell, null);

            if(i > 1)
            {
                // two or more values can go in the cell based
                // on values used in each zone.
                //
                // check each zone and make sure the selected
                // value can also be used in at least one other
                // cell in the zone.
                var cnt, row = Math.floor(cell / 9), col = cell % 9;

                cnt = 0; // count the cells in which the value
                     // may be used.

                // look at each cell in the same row as the
                // selected cell.
                for(i = 0; i < 9; i++)
                {   
                    // don't bother looking at the selected
                    // cell. we already know the value will
                    // work.
                    if(i == col)
                        continue;

                    j = row * 9 + i; // j stores the cell index

                    // if the value is already filled, skip
                    // to the next.
                    if(mask[j] > 0)
                        continue;

                    // get the values that can be used in
                    // the cell.
                    a = this.getAvailable(mask, j, avail);

                    // see if our value is in the available
                    // value list.
                    for(j = 0; j < a; j++)
                    {
                        if(avail[j] == val)
                        {
                            cnt++;
                            break;
                        }
                        avail[j] = 0;
                    }
                }

                // if the count is greater than zero, the
                // selected value could also be used in another
                // cell in that zone. we repeat the process with
                // the other two zones.
                if(cnt > 0)
                {
                    // col
                    cnt = 0;
                    for(i = 0; i < 9; i++)
                    {
                        if(i == row)
                            continue;

                        j = i * 9 + col;
                        if(mask[j] > 0)
                            continue;
                        a = this.getAvailable(mask, j, avail);
                        for(j = 0; j < a; j++)
                        {
                            if(avail[j] == val)
                            {
                                cnt++;
                                break;
                            }
                            avail[j] = 0;
                        }
                    }

                    // if the count is greater than zero,
                    // the selected value could also be used
                    // in another cell in that zone. we
                    // repeat the process with the last
                    // zone.
                    if(cnt > 0)
                    {
                        // square
                        cnt = 0;
                        r = row - row % 3;
                        c = col - col % 3;
                        for(i = r; i < r + 3; i++)
                        {
                            for(j = c; j < c + 3; j++)
                            {
                                if((i == row) && (j == col))
                                    continue;
    
                                k = i * 9 + j;
                                if(mask[k] > 0)
                                    continue;
                                a = this.getAvailable(mask, k, avail);
                                for(k = 0; k < a; k++)
                                {
                                    if(avail[k] == val)
                                    {
                                        cnt++;
                                        break;
                                    }
                                    avail[k] = 0;
                                }
                            }
                        }

                        if(cnt > 0)
                        {
                            mask[cell] = val;
                            hints++;
                        }
                    }
                }
            }

            tried[cell] = 1;
            n++;
        }
        while(n < 81);

        var t = this;
        setTimeout(function(){t._doHints(matrix, mask, tried, hints);}, 50);
    };

    this.newGame = function() {
        var i, hints = 0;
        var mask = new Array(81);

        // clear out the game matrix.
        clear(this.matrix);

        // call the solver on a completely empty matrix. this will
        // generate random values for cells resulting in a solved board.
        this.solve(this.matrix);

        // generate hints for the solved board. if the level is easy,
        // use the easy mask function.
        if(this.level == 0)
        {
            this.maskBoardEasy(this.matrix, mask);

            // save the solved matrix.
            this.save = this.matrix;

            // set the masked matrix as the puzzle.
            this.matrix = mask;

            timeDiff.start();
            this.done();
        }
        else
        {
            // the level is medium or greater. use the advanced mask
            // function to generate a minimal sudoku puzzle with a
            // single solution.
            this._doMask(this.matrix, mask);

            // if the level is medium, randomly add 4 extra hints.
            if(this.level == 1)
            {
                for(i = 0; i < 4; i++)
                {
                    do
                    {
                        var cell = Math.floor(Math.random() * 81);
                    }
                    while(mask[cell] != 0);

                    mask[cell] = this.matrix[cell];
                }
            }
        }
    };

    this.solveGame = function() {
        this.matrix = this.save;
    };

    this.gameFinished = function() {
    	for (var i = 0; i < 9; i++) {
        	for (var j = 0; j < 9; j++) {
            	var val = this.matrix[i * 9 + j];

                if ((val == 0) || (this._checkVal(this.matrix, i, j, val) == false)) {
                	return 0;
                }
            }
        }

        return timeDiff.end();
    };
    
    // TEST pour replay
    this.getMatrix = function() {
    	return this.matrix;
    };
    
    this.setMatrix = function(matrix) {
    	this.matrix = matrix;
    };
}

module.exports = Sudoku;
