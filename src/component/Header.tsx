import { useAppSelector } from '../app/hooks';
import { eatenCount } from '../features/board/boardSlice';

export default function Header(){
    const eaten = useAppSelector(eatenCount);

    return(
        <div className="app-header">
            <h2><img id="header-img" src="./imgs/header-img.png" alt=""/>nake</h2>
            <div className="header-text">Eaten: <div>{eaten}</div></div>
        </div>
    )
}