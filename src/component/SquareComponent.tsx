import { Square } from "../features/board/boardSlice";

interface SquareProps {
    type: Square;
}

export default function SquareComponent(props: SquareProps) {
    let typeClass;

    switch (props.type) {
        case Square.DEAD:
            typeClass = "snake-dead";
            break;
        case Square.EMPTY:
            typeClass = "default";
            break;
        case Square.SNAKE:
            typeClass = "snake";
            break;
        case Square.HEAD:
            typeClass = "snake-head";
            break;
        case Square.ROCK:
            typeClass = "rock";
            break;
        case Square.FOOD:
            typeClass = "food";
            break;
    }

    return <div className={"square " + typeClass}></div>;
}
