import { useLocation, useNavigate } from "react-router-dom"

export function useSearchSaveNavigate() {
    const navigate = useNavigate();
    const location = useLocation();

    return path => {
        navigate(path + location.search);
    };
}