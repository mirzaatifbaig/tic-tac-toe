import { useState } from 'react';
import PropTypes from "prop-types";

function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
}
Square.propTypes = {
    value: PropTypes.number.isRequired,
    onSquareClick: PropTypes.func.isRequired,
}
export default function Board() {
    const [squares, setSquares] = useState(Array(9).fill(null));

    function handleClick(i) {
        const nextSquare = squares.slice();
        if(i % 2 === 0) nextSquare[i - 1] = 'O';
        else nextSquare[i - 1] = 'X';
        setSquares(nextSquare);
    }

    return (
        <>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(2)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(3)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(5)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(6)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(8)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(9)}  />
            </div>
        </>
    );
}
