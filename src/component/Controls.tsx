import {
    currentBoard,
    resetBoard,
    unpaused,
} from "../features/board/boardSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Info from "./Info";

interface ControlProps {
    showBoard: Function;
    mainClass: MainClassType;
}

export type MainClassType = "show-board" | "hide-board";

export default function Controls(props: ControlProps) {
    const boardLevel = useAppSelector(currentBoard);
    const gameOn = useAppSelector(unpaused);
    const dispatch = useAppDispatch();

    function restart() {
        dispatch(resetBoard(boardLevel));
    }

    return (
        <div id="controls">
            <div className="control-buttons">
                <button
                    className={
                        "button-green" +
                        (props.mainClass === "hide-board" ? " disabled" : "")
                    }
                    onClick={restart}
                >
                    Restart
                </button>
                {props.mainClass === "show-board" && (
                    <button
                        className={"button-green" + (gameOn ? " disabled" : "")}
                        onClick={() => props.showBoard(false)}
                    >
                        Levels
                    </button>
                )}
                {props.mainClass === "hide-board" && (
                    <button
                        className="button-green"
                        onClick={() => {
                            props.showBoard(true);
                            restart();
                        }}
                    >
                        Back
                    </button>
                )}
            </div>
            <Info />
        </div>
    );
}
