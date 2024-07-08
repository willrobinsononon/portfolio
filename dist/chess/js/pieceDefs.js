import {OnBoardElement, MoveDisplay, MoveDisplayClear, SelectDisplay} from './onBoardElements.js'

class Piece extends OnBoardElement {

    id;
    color;
    availableMoves = [];
    moveDisplays = [];
    pinned = false;
    pinDirection = {};
    isPinning = false;

    constructor(params) {
        super(params);
        //store color and id
        this.color = params.color;
        this.id = params.id;

        //create piece specific render paramaters
        this.render.classList.add('piece');
        this.render.classList.add(this.color);

        //store square and populate board
        this.gameState.board.squares[this.square.x][this.square.y].vacant = false;
        this.gameState.board.squares[this.square.x][this.square.y].occupant = this;
    }

    enable() {
        this.render.onclick = () => { this.select() };
        this.render.classList.remove('disabled');
    }

    disable() {
        this.render.onclick = false;
        this.render.classList.add('disabled');
    }

    select() {
        if (this.gameState.currentSelection) {
            this.gameState.currentSelection.deselect();
        }
        this.gameState.currentSelection = this;
        this.displayMoves(this.availableMoves);
        this.render.onclick = () => { this.deselect() };
    }

    deselect() {
        if (this.gameState.currentSelection = this) {
            this.hideMoves();
            this.gameState.currentSelection = false;
        }
        this.render.onclick = () => { this.select() };
    }

    displayMoves(availableMoves) {
        this.moveDisplays.push(new SelectDisplay({gameState: this.gameState, square: this.square}))
        availableMoves.forEach(move => this.moveDisplays.push(move.display({square: move.square, gameState: this.gameState, piece: this})));
    }

    hideMoves() {
        this.moveDisplays.forEach(moveDisplay => {
            moveDisplay.render.remove();
        })
    }

    isPawn() {
        return this instanceof Pawn;
    }

    isKing() {
        return this instanceof King;
    }

    isRook() {
        return this instanceof Rook;
    }

    move(newSquare) {

        //capture if possible
        if (this.gameState.board.squares[newSquare.x][newSquare.y].vacant === false) {
            if (this.gameState.board.squares[newSquare.x][newSquare.y].occupant.color === this.gameState.currentSelection.color) {
                return
            }
            else {
                this.capture(this.gameState.board.squares[newSquare.x][newSquare.y].occupant);
            }
        }

        //deselect
        this.deselect();

        //update board and set square
        this.gameState.board.squares[this.square.x][this.square.y].vacant = true;
        this.gameState.board.squares[this.square.x][this.square.y].occupant = {};
        this.square = newSquare;
        this.gameState.board.squares[this.square.x][this.square.y].vacant = false;
        this.gameState.board.squares[this.square.x][this.square.y].occupant = this;
        
        this.updateDisplay(newSquare);
    }

    capture(capturedPiece) {
        //remove render
        capturedPiece.render.remove();

        //remove from pieces
        delete this.gameState.pieces[capturedPiece.color][capturedPiece.id];
    }

    getMoves() {
        var board = this.gameState.board;
        var directions = [...this.directions];
        this.availableMoves = [];

        //reset pinned piece
        if (this.isPinning) {
            this.isPinning.pinned = false;
            this.isPinning.pinDirection = {};
        }

        //check if pinned
        if (this.pinned) {
            //if piece can move in pin direction allow only those moves
            directions = this.directions.filter(direction => 
                (direction.x === this.pinDirection.x && direction.y === this.pinDirection.y) ||
                (direction.x === -1 * this.pinDirection.x && direction.y === -1 * this.pinDirection.y)
            )
        }

        //iterate through move directions
        for (let i in directions) {
            let iteratorSquare = {x: this.square.x + directions[i].x, y: this.square.y + directions[i].y};
            let count = 0;
            
            //add all empty squares in move direction
            while (
                (!this.maxMoves || count < this.maxMoves ) &&
                (iteratorSquare.x >= 0 && iteratorSquare.y >= 0 && iteratorSquare.x < board.squares.length && iteratorSquare.y < board.squares[0].length) &&
                (board.squares[iteratorSquare.x][iteratorSquare.y].vacant === true)
            ) {
                //add to piece available moves and board controlledby
                this.availableMoves.push({square: iteratorSquare, direction: directions[i], display: (params) => new MoveDisplay(params)});
                board.squares[iteratorSquare.x][iteratorSquare.y].controlledBy[this.color].push(this);
                iteratorSquare = {x: iteratorSquare.x + directions[i].x, y: iteratorSquare.y + directions[i].y};
                count += 1;
            }

            //if square contains opponent add a move to capture
            if (
                (!this.maxMoves || count < this.maxMoves ) &&
                (iteratorSquare.x >= 0 && iteratorSquare.y >= 0 && iteratorSquare.x < board.squares.length && iteratorSquare.y < board.squares[0].length) &&
                (board.squares[iteratorSquare.x][iteratorSquare.y].vacant === false)
            ) {
                //piece controls square containing piece
                board.squares[iteratorSquare.x][iteratorSquare.y].controlledBy[this.color].push(this);

                //if piece is opponent the move is available
                if (board.squares[iteratorSquare.x][iteratorSquare.y].occupant.color != this.color) {
                    this.availableMoves.push({square: iteratorSquare, direction: directions[i], display: (params) => new MoveDisplay(params)});
                }
                

                //store first piece met to later check for pins
                var firstPiece = board.squares[iteratorSquare.x][iteratorSquare.y].occupant;

                iteratorSquare = {x: iteratorSquare.x + directions[i].x, y: iteratorSquare.y + directions[i].y};
                count += 1;

                //fix king running away into check along same axis of attack
                if (
                    firstPiece.isKing() &&
                    (!this.maxMoves || count < this.maxMoves ) &&
                    (iteratorSquare.x >= 0 && iteratorSquare.y >= 0 && iteratorSquare.x < board.squares.length && iteratorSquare.y < board.squares[0].length) 
                ) {
                    board.squares[iteratorSquare.x][iteratorSquare.y].controlledBy[this.color].push(this);
                }
                else {
                    //check for pins

                    //remove all empty spaces behind the first piece
                    while (
                        (!this.maxMoves || count < this.maxMoves ) &&
                        (iteratorSquare.x >= 0 && iteratorSquare.y >= 0 && iteratorSquare.x < board.squares.length && iteratorSquare.y < board.squares[0].length) &&
                        (board.squares[iteratorSquare.x][iteratorSquare.y].vacant === true)
                    ) {
                        iteratorSquare = {x: iteratorSquare.x + directions[i].x, y: iteratorSquare.y + directions[i].y};
                        count += 1;
                    }

                    //check if next piece met is the king
                    if (
                        (!this.maxMoves || count < this.maxMoves ) &&
                        (iteratorSquare.x >= 0 && iteratorSquare.y >= 0 && iteratorSquare.x < board.squares.length && iteratorSquare.y < board.squares[0].length) &&
                        (board.squares[iteratorSquare.x][iteratorSquare.y].vacant === false) &&
                        (board.squares[iteratorSquare.x][iteratorSquare.y].occupant.color != this.color && board.squares[iteratorSquare.x][iteratorSquare.y].occupant.isKing())
                    ) {
                            //add pin conditions to respective pieces
                            firstPiece.pinned = true;
                            firstPiece.pinDirection = directions[i];
                            this.isPinning = firstPiece;
                    }
                }
            }
        }
    }
}

export class King extends Piece {

    hasMoved = false;
    directions = allDirections;
    maxMoves = 1;

    constructor(params) {
        super(params);
        this.render.classList.add("king");
    }

    move(newSquare) {
        if (this.hasMoved === false) {
            this.hasMoved = true;
        }

        super.move(newSquare);
    }
    
    castle(square) {
        this.move(square);
        if (square.x === 1) {
            this.gameState.pieces[this.color].rooka.move({x: 2, y: this.square.y});
        }
        else if (square.x === 5) {
            this.gameState.pieces[this.color].rookh.move({x: 4, y: this.square.y});
        }
    }

    getMoves() {
        super.getMoves();
        var board = this.gameState.board;

        var opponentColor = this.color === 'white' ? 'black' : 'white';

        //add castling squares
        if (this.hasMoved === false) {
            if (
                ('rooka' in this.gameState.pieces[this.color] && this.gameState.pieces[this.color].rooka.hasMoved === false) &&
                (
                    board.squares[1][this.square.y].vacant === true &&
                    board.squares[1][this.square.y].controlledBy[opponentColor].length === 0 &&
                    board.squares[2][this.square.y].vacant === true &&
                    board.squares[2][this.square.y].controlledBy[opponentColor].length === 0
                )
            ) {
                this.availableMoves.push({square: {x: 1, y: this.square.y}, gameState: this.gameState, piece: this, display: this.castleSquare});
                this.availableMoves.push({square: {x: 0, y: this.square.y}, gameState: this.gameState, piece: this, display: this.castleSquareClear});
            }
            if (
                ('rookh' in this.gameState.pieces[this.color] && this.gameState.pieces[this.color].rookh.hasMoved === false) &&
                (
                    board.squares[6][this.square.y].vacant === true &&
                    board.squares[5][this.square.y].vacant === true &&
                    board.squares[5][this.square.y].controlledBy[opponentColor].length === 0 &&
                    board.squares[4][this.square.y].vacant === true &&
                    board.squares[4][this.square.y].controlledBy[opponentColor].length === 0
                )
            ) {
                this.availableMoves.push({square: {x: 5, y: this.square.y}, gameState: this.gameState, piece: this, display: this.castleSquare});
                this.availableMoves.push({square: {x: 7, y: this.square.y}, gameState: this.gameState, piece: this, display: this.castleSquareClear});
            }
        }

        //remove moves to squares controlled by opposing pieces
        this.availableMoves.forEach(move => {
            if (
                board.squares[move.square.x][move.square.y].controlledBy[opponentColor].length > 0
            ) {
                this.availableMoves = this.availableMoves.filter(item => item != move);
            }
        });
    }

    castleSquare(params) {
        class CastleDisplay extends MoveDisplay {

            constructor(params) {
                super(params);
            }
        
            makeMove(square) {
                this.piece.castle(square);
                this.gameState.endTurn(this.gameState);
            }
        }

        return new CastleDisplay(params);
    }

    castleSquareClear(params) {
        class CastleDisplayClear extends MoveDisplayClear {

            constructor(params) {
                super(params);
            }
        
            makeMove(square) {
                this.piece.castle({x: square.x === 0 ? 1 : 5, y: square.y});
                this.gameState.endTurn(this.gameState);
            }
        }

        return new CastleDisplayClear(params);
    }
}

export class Queen extends Piece {

    directions = allDirections;
    maxMoves = false;

    constructor(params) {
        super(params);
        this.render.classList.add("queen");
    }
}

export class Rook extends Piece {
    
    hasMoved = false;
    maxMoves = false;

    directions = straightLines;

    constructor(params) {
        super(params);
        this.render.classList.add("rook");
    }

    move(newSquare) {
        if (this.hasMoved === false) {
            this.hasMoved = true;
        }

        super.move(newSquare);
    }
}

export class Knight extends Piece {

    directions = knightHop;
    maxMoves = 1;

    constructor(params) {
        super(params);
        this.render.classList.add("knight");
    }
}

export class Bishop extends Piece {

    directions = diagonals;
    maxMoves = false;

    constructor(params) {
        super(params);
        this.render.classList.add("bishop");
    }
}

export class Pawn extends Piece {

    direction;
    hasMoved = false;
    enPassant = false;

    
    constructor(params) {
        super(params);
        this.render.classList.add("pawn");

        if (this.color === 'white') {
            this.direction = 1;
        }
        else if (this.color === 'black') {
            this.direction = -1;
        }
    }

    getMoves() {
        var board = this.gameState.board;
        this.availableMoves = [];

        //add pawn forward squares
        if (board.squares[this.square.x][this.square.y + this.direction].vacant === true) {
            this.availableMoves.push({square: {x: this.square.x, y: this.square.y + this.direction}, direction: {x: 0, y: this.direction}, display: (params) => new MoveDisplay(params)})
            //add double move if first move
            if (
                this.hasMoved === false &&
                board.squares[this.square.x][this.square.y + 2 * this.direction].vacant === true
            ) {
                this.availableMoves.push({square: {x: this.square.x, y: this.square.y + 2 * this.direction}, direction: {x: 0, y: this.direction}, display: (params) => new MoveDisplay(params)});               
            }
        }

        //add pawn attack squares
        if (
            (this.square.y + (1 * this.direction) >= 0) &&
            (this.square.y + (1 * this.direction) < board.squares[0].length)
        ) {
            if (this.square.x + 1 < board.squares.length) {
                board.squares[this.square.x + 1][this.square.y + (1 * this.direction)].controlledBy[this.color].push(this);
                if (
                    board.squares[this.square.x + 1][this.square.y + (1 * this.direction)].vacant === false &&
                    board.squares[this.square.x + 1][this.square.y + (1 * this.direction)].occupant.color != this.color
                ) {
                    this.availableMoves.push({square: {x: this.square.x + 1, y: this.square.y + (1 * this.direction)}, direction: {x: 1, y: 1}, display: (params) => new MoveDisplay(params)});
                }
            }
            if (this.square.x - 1 >= 0) {
                board.squares[this.square.x - 1][this.square.y + (1 * this.direction)].controlledBy[this.color].push(this);
                if (
                    board.squares[this.square.x - 1][this.square.y + (1 * this.direction)].vacant === false &&
                    board.squares[this.square.x - 1][this.square.y + (1 * this.direction)].occupant.color != this.color
                ) {
                    this.availableMoves.push({square: {x: this.square.x - 1, y: this.square.y + (1 * this.direction)}, direction: {x: -1, y: 1}, display: (params) => new MoveDisplay(params)});
                }
            }
        }
        
        //add en passant attack
        if (this.enPassant) {
            this.availableMoves.push({square: {x: this.enPassant.square.x, y: this.square.y + this.direction}, direction: {x: this.square.x - this.enPassant.x, y: this.direction}, display: this.enPassantDisplay});
        }

        //restrict movement if pinned
        if (this.pinned) {
            this.availableMoves = this.availableMoves.filter(move => 
                (this.pinDirection.x === move.direction.x && this.pinDirection.y === move.direction.y) || 
                (this.pinDirection.x === -1 * move.direction.x && this.pinDirection.y === -1 * move.direction.y)
            )
        }
    }

    move(newSquare) {

        var board = this.gameState.board;
        
        //trigger en passant if moving two squares
        if (this.direction * (newSquare.y - this.square.y) === 2) {
            if (
                this.square.x + 1 < board.squares.length &&
                board.squares[this.square.x + 1][this.square.y + 2 * this.direction].vacant === false &&
                board.squares[this.square.x + 1][this.square.y + 2 * this.direction].occupant.isPawn() &&
                board.squares[this.square.x + 1][this.square.y + 2 * this.direction].occupant.color != this.color
            ) {
                board.squares[this.square.x + 1][this.square.y + 2 * this.direction].occupant.enPassant = this;
            }
            if (
                this.square.x - 1 >= 0 &&
                board.squares[this.square.x - 1][this.square.y + 2 * this.direction].vacant === false &&
                board.squares[this.square.x - 1][this.square.y + 2 * this.direction].occupant.isPawn() &&
                board.squares[this.square.x - 1][this.square.y + 2 * this.direction].occupant.color != this.color
            ) {
                board.squares[this.square.x - 1][this.square.y + 2 * this.direction].occupant.enPassant = this;
            }
        }

        super.move(newSquare);

        //promote if reaches last rank
        if (this.square.y === 3.5 + this.direction * 3.5) {
            this.promotionDisplay();
        }

        if (this.hasMoved === false) {
            this.hasMoved = true;
        }

        if (this.enPassant === true) {
            this.enPassant = false;
        }
    }

    promotionDisplay() {

        //select so game layer can access moveDisplays
        this.select();

        //set game to promotion mode
        this.gameState.promotion = true;

        //disable all pieces
        Object.keys(this.gameState.pieces[this.color]).forEach(key => this.gameState.pieces[this.color][key].disable());

        //hide this render
        this.render.remove();

        //create promotedisplays
        this.moveDisplays.push(this.promoteDisplay({piece: this, promoteTo: Queen, promoteClass: "queen", square: this.square, gameState: this.gameState}));
        this.moveDisplays.push(this.promoteDisplay({piece: this, promoteTo: Rook, promoteClass: "rook", square: {x: this.square.x, y: this.square.y - this.direction}, gameState: this.gameState}));
        this.moveDisplays.push(this.promoteDisplay({piece: this, promoteTo: Bishop, promoteClass: "bishop", square: {x: this.square.x, y: this.square.y - 2 * this.direction}, gameState: this.gameState}));
        this.moveDisplays.push(this.promoteDisplay({piece: this, promoteTo: Knight, promoteClass: "knight", square: {x: this.square.x, y: this.square.y - 3 * this.direction}, gameState: this.gameState}));

        //create board overlay
        this.moveDisplays.push(this.promoteOverlay(this.gameState));
    }

    promote(Piece) {
        this.moveDisplays.forEach(moveDisplay => moveDisplay.render.remove());
        this.moveDisplays = [];
        this.gameState.pieces[this.color][this.id] = new Piece({color: this.color, gameState: this.gameState, square: this.square, id: this.id});
        this.gameState.promotion = false;
        this.gameState.endTurn(this.gameState);
    }

    enPassantDisplay(params)  {
        class EnPassantDisplay extends MoveDisplay {

            constructor(params) {
                super(params);
                this.enPassant = this.piece.enPassant;
            }

            makeMove(square) {
                this.piece.capture(this.enPassant);
                this.piece.move(square);
                this.gameState.endTurn(this.gameState);
            }
        }

        return new EnPassantDisplay(params);
    }

    promoteDisplay(params) {
        class PromoteDisplay extends OnBoardElement {
            piece;
            promoteTo;
        
            constructor(params) {
                super(params);
                this.piece = params.piece;
                this.promoteTo = params.promoteTo;
        
                this.render.classList.add("promote-display");
                this.render.classList.add(this.piece.color);
                this.render.classList.add(params.promoteClass);
                
                this.render.onclick = () => { this.piece.promote(this.promoteTo); };
            }
        }

        return new PromoteDisplay(params);
    }

    promoteOverlay(params) {
        class PromoteOverlay extends OnBoardElement {

            constructor(params) {
                super({...params, square: {x: 0, y: 7}})
        
                //create render paramaters
                this.render.style.width = this.gameState.board.squareSize * this.gameState.board.boardSize;
                this.render.style.height = this.gameState.board.squareSize * this.gameState.board.boardSize;
                this.render.classList.add("promotion-overlay");
            }

            updateDisplay(newSquare) {
                this.render.style.width = this.gameState.board.squareSize * this.gameState.board.boardSize;
                this.render.style.height = this.gameState.board.squareSize * this.gameState.board.boardSize;
            }  
        }

        return new PromoteOverlay(params);
    }
}


//move definitions

function moveConstructor(moves) {
    let x = 0;
    let y = 0;
    moves.forEach(move => {
        x += move.x;
        y += move.y
    });

    return {x: x, y: y};
}

const forward = {x: 0, y: 1};
const backward = {x: 0, y: -1};
const left = {x: -1, y: 0};
const right = {x: 1, y: 0};

var straightLines = [
    forward,
    backward,
    left,
    right
];

var diagonals =  [
    moveConstructor([forward, left]),
    moveConstructor([forward, right]),
    moveConstructor([backward, left]),
    moveConstructor([backward, right])
];

var allDirections = [...straightLines, ...diagonals];

var knightHop = [
    moveConstructor([forward, forward, left]),
    moveConstructor([forward, forward, right]),
    moveConstructor([forward, left, left]),
    moveConstructor([forward, right, right]),
    moveConstructor([backward, backward, left]),
    moveConstructor([backward, backward, right]),
    moveConstructor([backward, left, left]),
    moveConstructor([backward, right, right])
];