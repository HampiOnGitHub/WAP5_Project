import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [token, setToken] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateStep2 = () => {
        const newErrors = {};

        if (!token.trim()) newErrors.token = t("errors.tokenRequired");
        if (!firstName.trim()) newErrors.firstName = t("errors.firstNameRequired");
        if (!lastName.trim()) newErrors.lastName = t("errors.lastNameRequired");
        if (!userName.trim()) newErrors.userName = t("errors.userNameRequired")
        if (!password) newErrors.password = t("errors.passwordRequired");
        if (!confirmPassword)
            newErrors.confirmPassword = t("errors.confirmPasswordRequired");

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = t("errors.passwordsDoNotMatch");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleRequestRegister = async (e) => {
        e.preventDefault();
        setServerError("");
        setErrors({});
        setLoading(true);

        try {
            const res = await fetch(`api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error();
            }

            setStep(2);
        } catch {
            setServerError(t("errors.registrationFailed"));
        } finally {
            setLoading(false);
        }
    };

    const handleActivateAccount = async (e) => {
        e.preventDefault();
        setServerError("");
        setErrors({});

        if (!validateStep2()) return;

        setLoading(true);

        try {
            const res = await fetch(`api/register/${token}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_name: userName,
                    first_name: firstName,
                    last_name: lastName,
                    password,
                }),
            });

            if (!res.ok) {
                throw new Error();
            }

            navigate("/login");
        } catch {
            setServerError(t("errors.activationFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={step === 1 ? handleRequestRegister : handleActivateAccount}
            noValidate
            sx={{
                width: 360,
                margin: "40px auto",
                padding: 4,
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h5" align="center">
                {step === 1
                    ? t("register.title")
                    : t("register.completeRegistration")}
            </Typography>

            {step === 1 && (
                <TextField
                    label={t("register.email")}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && (
                <>
                    <TextField
                        label={t("register.activationToken")}
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        error={!!errors.token}
                        helperText={errors.token}
                    />

                    <TextField
                        label={t("register.userName")}
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        error={!!errors.userName}
                        helperText={errors.userName}
                    />

                    <TextField
                        label={t("register.firstName")}
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />

                    <TextField
                        label={t("register.lastName")}
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />

                    <TextField
                        label={t("register.password")}
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />

                    <TextField
                        label={t("register.confirmPassword")}
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                </>
            )}

            {serverError && (
                <Typography color="error" align="center">
                    {serverError}
                </Typography>
            )}

            <Button type="submit" variant="contained" disabled={loading}>
                {loading
                    ? t("register.processing")
                    : step === 1
                        ? t("register.registerButton")
                        : t("register.activateButton")}
            </Button>
        </Box>
    );
}

export default Register;
