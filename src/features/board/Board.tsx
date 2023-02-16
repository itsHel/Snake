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
const fps = 60;
const interval = 1000/fps;

export default function Board() {
    const state = useAppSelector(boardState);
    const playerLost = useAppSelector(lost);
    const gameOn = useAppSelector(unpaused);
    const speed = useAppSelector(getSpeed) * fps/1000;
    const dispatch = useAppDispatch();
    
    const clearSnakeInterval = useRef<number | null>(null);
    const RAF = useRef<number | null>(null);

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

        let start: number;
        let stepTemp: number = 0;

        RAF.current = requestAnimationFrame(move);

        function move(timestamp: number){
            RAF.current = requestAnimationFrame(move);

            if(start === undefined){
                start = timestamp;
            }

            const delta = timestamp - start;

            if(delta > interval){
                start = timestamp - (delta % interval);

                stepTemp += 1;

                if(stepTemp >= speed){
                    stepTemp = stepTemp % speed;
                    dispatch(moveSnake());
                }
            }
        }

        

        return () => {
            if(RAF.current){
                cancelAnimationFrame(RAF.current);
            }
        }
    }, [speed, gameOn, playerLost]);

    useEffect(() => {
        dispatch(resetBoard(0));
    }, []);

    return (
        <div id="board" className={(playerLost) ? "board-lost" : ""}>
            {state.map((row, index) => {
                return (<BoardRow key={index} data={row}/>)
            })}
        </div>
  );
}
