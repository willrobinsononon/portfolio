export class Board {
    
    render;
    squareSize;
    boardSize;
    squares = [];
    orientation = 1;

    constructor(params) {
        this.render = params.render;
        this.render.className = 'board-horizontal';
        this.squareSize = params.squareSize;
        this.boardSize = params.boardSize;
        this.updateDisplay(params);

        for (let i = 0; i < params.boardSize; i++) {
            let column = [];
            for (let i = 0; i < params.boardSize; i++) {
                column.push(new Square);
            }
            this.squares.push(column);
        }
    }

    updateDisplay() {
        this.render.style.height = this.squareSize * this.boardSize + 'px';
    }
}


class Square {
    vacant = true;
    occupant = {};
    controlledBy = {
        white: [],
        black: []
    }
}