import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Main } from "./pages/Pages";

export const Routers = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Main />}
                />

                <Route
                    path='*'
                    element={<Navigate to='/' />}
                />

            </Routes>
        </BrowserRouter>
    )

}