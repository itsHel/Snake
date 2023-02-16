import { ReactElement } from "react";
import { levelCount } from "../features/board/boardSlice";

interface PickLevelProps {
    changeLevel: Function;
}

export default function PickLevel(props: PickLevelProps){
    let levels: ReactElement[] = [];

    for(let i = 0; i < levelCount; i++){
        levels.push(
            <div key={i} onClick={() => props.changeLevel(i)} className="level-thumbnail">
                <img src={"imgs/level" + i + ".png"} alt=""/>
            </div>
        )
    }

    return (
        <div id="pick-level">
            {levels}
        </div>
    );
}