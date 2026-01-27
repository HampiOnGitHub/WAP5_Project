import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
} from "@mui/material";
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

        if (!identifier.trim()) {
            newErrors.identifier = t("errors.identifierRequired");
        }

        if (!password) {
            newErrors.password = t("errors.passwordRequired");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setErrors({});

        if (!validate()) return;

        setLoading(true);

        try {
            await login(identifier, password);
            navigate("/");
        } catch {
            setServerError(t("errors.loginFailed"));
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
            <Typography variant="h5" align="center">
                {t("login.title")}
            </Typography>

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

            {serverError && (
                <Typography color="error" align="center">
                    {serverError}
                </Typography>
            )}

            <Button type="submit" variant="contained" disabled={loading}>
                {loading
                    ? t("login.processing")
                    : t("login.loginButton")}
            </Button>

            <Typography align="center" sx={{ mt: 1, fontSize: "0.875rem" }}>
                {t("login.noAccount")}{" "}
                <Button
                    variant="text"
                    onClick={() => navigate("/register")}
                    sx={{color: "primary.main", textTransform: "none", p: 0, minWidth: "auto"}}
                >
                    {t("login.registerLink")}
                </Button>
            </Typography>
        </Box>
    );
}

export default Login;
