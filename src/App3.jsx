import { useState, useCallback } from 'react';
import PropTypes from "prop-types";


function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

Square.propTypes = {
    value: PropTypes.string,
    onSquareClick: PropTypes.func,
};


function Board({ xIsNext, squares, onPlay }) {
    const handleClick = useCallback((i) => {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares);
    }, [squares, xIsNext, onPlay]);

    const winner = calculateWinner(squares);
    const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <>
            <div className="status">{status}</div>
            {Array(3).fill(null).map((_, rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {Array(3).fill(null).map((_, colIndex) => {
                        const index = rowIndex * 3 + colIndex;
                        return <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />;
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
};


export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
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

    const moves = history.map((squares, move) => {
        const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}


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
            return squares[a];
        }
    }
    return null;
}
