import { useEffect, useRef } from 'react';
import BoardRow from '../../component/BoardRow';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    resetBoard,
    moveSnake,
    boardState,
    unpaused,
    lost,
    clearSnake,
    getSpeed
} from './boardSlice';
import './board.css';

const clearSnakeSpeedMs = 80;

type FPSType = 60 | 144;

export default function Board() {
    const clearSnakeInterval = useRef<number | null>(null);
    const RAF = useRef<number | null>(null);
    const FPS = useRef<FPSType>(60);

    const state = useAppSelector(boardState);
    const playerLost = useAppSelector(lost);
    const gameOn = useAppSelector(unpaused);
    const speed = useAppSelector(getSpeed) * (FPS.current / 1000);
    const dispatch = useAppDispatch();
    
    

    useEffect(() => {
        // Clear on lose
        if(playerLost){
            clearSnakeInterval.current = window.setInterval(() => {
                dispatch(clearSnake());
            }, clearSnakeSpeedMs);
        } else {
            if(clearSnakeInterval.current){
                window.clearInterval(clearSnakeInterval.current!);
                clearSnakeInterval.current = null;
            }
        }

        RAF.current && cancelAnimationFrame(RAF.current);
        
        if(!gameOn)
            return;

        let stepTemp: number = 0;

        RAF.current = requestAnimationFrame(move);

        function move(){
            RAF.current = requestAnimationFrame(move);

            stepTemp += 1;

            if(stepTemp >= speed){
                stepTemp = stepTemp % speed;
                dispatch(moveSnake());
            }
        }

        return () => {
            if(RAF.current){
                cancelAnimationFrame(RAF.current);
            }
        }
    }, [speed, gameOn, playerLost, FPS]);

    useEffect(() => {
        dispatch(resetBoard(0));

        setFPS();

        function setFPS(){
            let start: number;
            let framesCount = 0;
            requestAnimationFrame(test);

            function test(timestamp: number){
                if(!start){
                    start = timestamp;
                }

                framesCount++;

                if(timestamp < start + 1000){
                    requestAnimationFrame(test);
                } else {
                    if(Math.abs(60 - framesCount) > Math.abs(144 - framesCount)){
                        FPS.current = 144;
                    } else {
                        FPS.current = 60;
                    }
                }
            }
        }
    }, []);

    return (
        <div id="board" className={(playerLost) ? "board-lost" : ""}>
            {state.map((row, index) => {
                return (<BoardRow key={index} data={row}/>)
            })}
        </div>
  );
}
