import React from 'react';
import { useAppSelector, useAppDispatch } from "./app/hooks";
import Body from './component/Body';
import Header from './component/Header';
import './App.css';

import {
    changeDirection,
    resetBoard,
    currentBoard
} from './features/board/boardSlice';

function App() {
    const dispatch = useAppDispatch();
    const boardLevel = useAppSelector(currentBoard);

    return (
        <div className="App" onKeyDown={handleKeyDown} tabIndex={0}>
            <Header/>
            <Body/>
        </div>
    );

    function handleKeyDown(e: React.KeyboardEvent){
        switch(e.key){
            case "a": 
            case "ArrowLeft":
                dispatch(changeDirection("west"));
                break;
            case "d": 
            case "ArrowRight":
                dispatch(changeDirection("east"));
                break;
            case "s": 
            case "ArrowDown":
                dispatch(changeDirection("south"));
                break;
            case "w": 
            case "ArrowUp":
                dispatch(changeDirection("north"));
                break;
            case "Enter":
                dispatch(resetBoard(boardLevel));
                return;
        }
    }
}

export default App;
