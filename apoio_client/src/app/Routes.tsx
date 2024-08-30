import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Main } from "./pages/Main";
import { Login } from "./pages/Login";
import { useTypedSelector } from "./hooks";
import { Unauthorized } from "./components/Unauthorized/Unauthorized";

interface PrivateRouteProps {
    element: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component }) => {

    const userState = useTypedSelector(state => state.userReducer);
    return userState.isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export const Routers = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<PrivateRoute element={Main} />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/unauthorized" />}
                />
            </Routes>
        </BrowserRouter>
    );
};
