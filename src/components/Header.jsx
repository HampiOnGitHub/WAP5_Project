import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

function Header() {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [lang, setLang] = useState(i18n.language);

    const handleChangeLanguage = (event) => {
        const newLang = event.target.value;
        setLang(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <SportsSoccerIcon/>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                    component={Link}
                    to="/"
                    color="inherit"
                    style={{ textDecoration: "none" }}
                >
                    &nbsp;HAC
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {!user ? (
                        <>
                            <Button color="inherit" component={Link} to="/register">
                                {t("register.registerButton")}
                            </Button>
                            <Button color="inherit" component={Link} to="/login">
                                {t("login.loginButton")}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/profile">
                                {t("header.profile")}
                            </Button>
                            <Button color="inherit" onClick={logout}>
                                {t("header.logout")}
                            </Button>
                        </>
                    )}

                    <Select
                        value={lang}
                        onChange={handleChangeLanguage}
                        variant="outlined"
                        size="small"
                        sx={{ color: "white", borderColor: "white", ".MuiSvgIcon-root": { color: "white" } }}
                    >
                        <MenuItem value="en">EN</MenuItem>
                        <MenuItem value="de">DE</MenuItem>
                    </Select>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
