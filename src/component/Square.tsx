import { SquareType } from "../features/board/boardSlice";

interface SquareProps {
    type: SquareType;
}

export default function Square(props: SquareProps) {
    let typeClass;

    switch (props.type) {
        case -1:
            typeClass = "snake-dead";
            break;
        case 0:
            typeClass = "default";
            break;
        case 1:
            typeClass = "snake";
            break;
        case 2:
            typeClass = "rock";
            break;
        case 3:
            typeClass = "food";
            break;
        case 4:
            typeClass = "snake-head";
            break;
    }

    return <div className={"square " + typeClass}></div>;
}
