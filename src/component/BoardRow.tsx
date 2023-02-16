import Square from "./Square";
import { SquareType } from "../features/board/boardSlice"
import { memo } from 'react';

interface BoardRowProps {
    data: SquareType[]
}

export default memo(function BoardRow(props: BoardRowProps){
    return (
        <div className="board-row">
            {props.data.map((square, index) => {
                return <Square key={index} type={square}/>
            })}
        </div>
    )
})