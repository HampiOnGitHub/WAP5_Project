import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!identifier.trim()) newErrors.identifier = t("errors.identifierRequired");
        if (!password) newErrors.password = t("errors.passwordRequired");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const mockUserId = () => {
        const currentId = Number(localStorage.getItem("userIdMock")) || 0;
        const nextId = currentId + 1;
        localStorage.setItem("userIdMock", nextId.toString());
        return nextId;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        setLoading(true);

        try {
            let userData;

            // mock
            if (!import.meta.env.VITE_API_URL) {
                await new Promise((res) => setTimeout(res, 1000));
                userData = { id: mockUserId(), username: identifier, email: "mock@email.com", token: "mock-token" };
            } else {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier, password }),
                });
                const data = await response.json();
                if (!response.ok) {
                    setServerError(data.message || t("errors.loginFailed"));
                    return;
                }
                userData = data.user;
            }

            login(userData);
            navigate("/");
        } catch {
            setServerError(t("errors.serverNotReachable"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: 360,
                margin: "40px auto",
                padding: 4,
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: 3,
            }}
        >
            <Typography variant="h5" align="center">{t("login.title")}</Typography>

            <TextField
                label={t("login.identifier")}
                required
                variant="outlined"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={!!errors.identifier}
                helperText={errors.identifier}
            />

            <TextField
                label={t("login.password")}
                type="password"
                required
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
            />

            {serverError && <Typography color="error" align="center">{serverError}</Typography>}

            <Button type="submit" variant="contained" disabled={loading}>
                {loading ? t("login.processing") : t("login.loginButton")}
            </Button>

            <Typography align="center" sx={{ mt: 1, fontSize: "0.875rem" }}>
                {t("login.noAccount")}{" "}
                <Button
                    variant="text"
                    onClick={() => navigate("/register")}
                    sx={{ color: "primary.main", textTransform: "none", p: 0, minWidth: "auto" }}
                >
                    {t("login.registerLink")}
                </Button>
            </Typography>
        </Box>
    );
}

export default Login;
