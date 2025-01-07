import { useState, useCallback } from 'react';
import PropTypes from "prop-types";

// Square Component
function Square({ value, onSquareClick, highlight }) {
    return (
        <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

Square.propTypes = {
    value: PropTypes.string,
    onSquareClick: PropTypes.func,
    highlight: PropTypes.bool,
};

// Board Component
function Board({ xIsNext, squares, onPlay, winningSquares }) {
    const handleClick = useCallback((i) => {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares);
    }, [squares, xIsNext, onPlay]);

    const winner = calculateWinner(squares);
    const status = winner ? `Winner: ${winner.winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <>
            <div className="status">{status}</div>
            {Array(3).fill(null).map((_, rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {Array(3).fill(null).map((_, colIndex) => {
                        const index = rowIndex * 3 + colIndex;
                        const highlight = winner && winner.line.includes(index);
                        return <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} highlight={highlight} />;
                    })}
                </div>
            ))}
        </>
    );
}

Board.propTypes = {
    xIsNext: PropTypes.bool,
    squares: PropTypes.arrayOf(PropTypes.string),
    onPlay: PropTypes.func,
    winningSquares: PropTypes.arrayOf(PropTypes.number),
};

// Game Component
export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;

    const handlePlay = useCallback((nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }, [history, currentMove]);

    const jumpTo = useCallback((nextMove) => {
        setCurrentMove(nextMove);
    }, []);

    const toggleSort = () => {
        setIsAscending((prev) => !prev);
    };

    const moves = history.map((squares, move) => {
        const description = move > 0 ? `Go to move #${move} (${Math.floor((move - 1) / 3)}, ${(move - 1) % 3})` : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const winner = calculateWinner(currentSquares);
    const status = winner ? `Winner: ${winner.winner}` : (currentMove === 9 ? "It's a draw!" : `Next player: ${xIsNext ? 'X' : 'O'}`);
    const winningSquares = winner ? winner.line : [];

    // Sort moves based on the state
    const sortedMoves = isAscending ? moves : moves.reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={toggleSort}>
                    {isAscending ? "Sort Descending" : "Sort Ascending"}
                </button>
                <ol>{sortedMoves}</ol>
                <div>{currentMove > 0 ? `You are at move #${currentMove}` : 'You are at the start of the game'}</div>
            </div>
        </div>
    );
}

// calculateWinner Function
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: [a, b, c] };
        }
    }
    return null;
}
