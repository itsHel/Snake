import SquareComponent from "./SquareComponent";
import { Square } from "../features/board/boardSlice"
import { memo } from 'react';

interface BoardRowProps {
    data: Square[]
}

export default memo(function BoardRow(props: BoardRowProps){
    return (
        <div className="board-row">
            {props.data.map((square, index) => {
                return <SquareComponent key={index} type={square}/>
            })}
        </div>
    )
})