import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

function MainLayout() {
    return (
        <>
            <Header />
            <Box sx={{ padding: 3 }}>
                <Outlet />
            </Box>
        </>
    );
}

export default MainLayout;
