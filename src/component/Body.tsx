import { useState } from "react";
import Board from "../features/board/Board";
import PickLevel from "./PickLevel";
import Controls, { MainClassType } from "./Controls";
import { LevelType, resetBoard } from "../features/board/boardSlice";
import { useAppDispatch } from "../app/hooks";

export default function Body(){
    const dispatch = useAppDispatch();
    const [mainClass, setMainClass] = useState<MainClassType>("show-board");
    
    function showBoard(show: boolean){
        if(show){
            setMainClass("show-board");
        } else {
            setMainClass("hide-board");
        }
    }

    function changeLevel(level: LevelType){
        setMainClass("show-board");

        dispatch(resetBoard(level));
    }

    return (
        <div id="body">
            <div id="main" className={mainClass}>
                <Board/>
                <PickLevel changeLevel={changeLevel}/>
            </div>
            <Controls showBoard={showBoard} mainClass={mainClass}/>
        </div>
    )
}