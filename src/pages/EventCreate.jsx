import { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function EventCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, accessToken } = useAuth();

    const [sport, setSport] = useState("");
    const [dateTime, setDateTime] = useState(null);
    const [maxParticipants, setMaxParticipants] = useState("");
    const [descriptionGer, setDescriptionGer] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [meetingPoint, setMeetingPoint] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const sportOptions = [
        { value: "football", labelKey: "sports.football" },
        { value: "tennis", labelKey: "sports.tennis" },
        { value: "volleyball", labelKey: "sports.volleyball" },
        { value: "basketball", labelKey: "sports.basketball" },
        { value: "running", labelKey: "sports.running" },
        { value: "fitness", labelKey: "sports.fitness" },
        { value: "swimming", labelKey: "sports.swimming" },
        { value: "skiing", labelKey: "sports.skiing" },
        { value: "golf", labelKey: "sports.golf" },
        { value: "gymnastics", labelKey: "sports.gymnastics" },
        { value: "bouldering", labelKey: "sports.bouldering" },
        { value: "other", labelKey: "sports.other" },
    ];

    const validate = () => {
        const newErrors = {};

        if (!sport) newErrors.sport = t("errors.sportRequired");
        if (!dateTime) newErrors.dateTime = t("errors.dateTimeRequired");
        if (dateTime && new Date(dateTime) <= new Date()) {
            newErrors.dateTime = t("errors.dateTimeInPast");
        }
        if (!maxParticipants || maxParticipants <= 1) {
            newErrors.maxParticipants = t("errors.maxParticipantsInvalid");
        }
        if (!meetingPoint.trim()) {
            newErrors.meetingPoint = t("errors.meetingPointRequired");
        }
        if (!descriptionGer.trim()) {
            newErrors.descriptionGer = t("errors.descriptionRequired");
        }
        if (!descriptionEn.trim()) {
            newErrors.descriptionEn = t("errors.descriptionRequired");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);

        const newEvent = {
            sport,
            meetingPoint,
            descriptionGer,
            descriptionEn,
            maxParticipants: Number(maxParticipants),
            dateAndTime: dateTime.toISOString(),
        };

        try {
            const response = await fetch("http://localhost:3000/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(newEvent),
            });

            if (!response.ok) {
                throw new Error("Event creation failed");
            }

            navigate("/");
        } catch (err) {
            console.error(err);
            alert(t("errors.generic"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 400,
                    margin: "40px auto",
                    padding: 4,
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    boxShadow: 3,
                }}
            >
                <Typography variant="h5" align="center">
                    {t("eventCreate.title")}
                </Typography>

                <TextField
                    select
                    label={t("eventCreate.sport")}
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    error={!!errors.sport}
                    helperText={errors.sport}
                    required
                >
                    {sportOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {t(option.labelKey)}
                        </MenuItem>
                    ))}
                </TextField>

                <DateTimePicker
                    label={t("eventCreate.dateTime")}
                    value={dateTime}
                    onChange={(newValue) => setDateTime(newValue)}
                    slotProps={{
                        textField: {
                            required: true,
                            error: !!errors.dateTime,
                            helperText: errors.dateTime,
                        },
                    }}
                />

                <TextField
                    label={t("eventCreate.meetingPoint")}
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    error={!!errors.meetingPoint}
                    helperText={errors.meetingPoint}
                    required
                />

                <TextField
                    label={t("eventCreate.maxParticipants")}
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    error={!!errors.maxParticipants}
                    helperText={errors.maxParticipants}
                    required
                />

                <TextField
                    label={t("eventCreate.descriptionGER")}
                    multiline
                    rows={4}
                    value={descriptionGer}
                    onChange={(e) => setDescriptionGer(e.target.value)}
                    error={!!errors.descriptionGer}
                    helperText={errors.descriptionGer}
                    required
                />

                <TextField
                    label={t("eventCreate.descriptionEN")}
                    multiline
                    rows={4}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    error={!!errors.descriptionEn}
                    helperText={errors.descriptionEn}
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                >
                    {t("eventCreate.submit")}
                </Button>
            </Box>
        </LocalizationProvider>
    );
}

export default EventCreate;
