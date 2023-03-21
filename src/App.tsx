import React from 'react';
import { useAppSelector, useAppDispatch } from "./app/hooks";
import Body from './component/Body';
import Header from './component/Header';
import Theme from './features/theme/Theme';
import './App.css';

import {
    changeDirection,
    resetBoard,
    currentBoard
} from './features/board/boardSlice';
import {
    currentTheme
} from './features/theme/themeSlice';

function App() {
    const dispatch = useAppDispatch();
    const boardLevel = useAppSelector(currentBoard);
    const theme = useAppSelector(currentTheme);

    function handleKeyDown(e: React.KeyboardEvent){
        switch(e.key){
            case "a": case "A": case "ArrowLeft":
                dispatch(changeDirection("west"));
                break;
            case "d": case "D": case "ArrowRight":
                dispatch(changeDirection("east"));
                break;
            case "s": case "S": case "ArrowDown":
                dispatch(changeDirection("south"));
                break;
            case "w": case "W": case "ArrowUp":
                dispatch(changeDirection("north"));
                break;
            case "Enter":
                dispatch(resetBoard(boardLevel));
                return;
        }
    }

    return (
        <div className={"App " + theme} onKeyDown={handleKeyDown} tabIndex={0}>
            <Theme/>
            <Header/>
            <Body/>
        </div>
    );
}

export default App;
