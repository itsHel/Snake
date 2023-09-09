import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { changeTheme, currentTheme } from "./themeSlice";
import "./theme.scss";

export default function Theme() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(currentTheme);

    function handleThemeClick() {
        dispatch(changeTheme());
    }

    return (
        <div className="toggle-btn" id="theme-toggle">
            <input
                type="checkbox"
                onChange={handleThemeClick}
                checked={theme == "dark"}
            />
            <span></span>
        </div>
    );
}
