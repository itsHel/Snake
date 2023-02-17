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
            case "A": 
            case "ArrowLeft":
                dispatch(changeDirection("west"));
                break;
            case "d": 
            case "D": 
            case "ArrowRight":
                dispatch(changeDirection("east"));
                break;
            case "s": 
            case "S": 
            case "ArrowDown":
                dispatch(changeDirection("south"));
                break;
            case "w": 
            case "W": 
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
