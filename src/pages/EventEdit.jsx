import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

function EventEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activityId } = useParams();
    const { user, accessToken } = useAuth();

    const [sport, setSport] = useState("");
    const [dateTime, setDateTime] = useState(null);
    const [maxParticipants, setMaxParticipants] = useState("");
    const [meetingPoint, setMeetingPoint] = useState("");
    const [descriptionGer, setDescriptionGer] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [currentParticipants, setCurrentParticipants] = useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const res = await fetch(
                    `api/events/${activityId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!res.ok) throw new Error();

                const activity = await res.json();

                const isOrganizer =
                    activity.participants?.[0]?.username === user.username;

                if (!isOrganizer) {
                    alert(t("eventEdit.notAuthorized"));
                    navigate("/");
                    return;
                }

                setSport(activity.sport);
                setDateTime(dayjs(activity.dateAndTime));
                setMaxParticipants(activity.maxParticipants);
                setMeetingPoint(activity.meetingPoint || "");
                setDescriptionGer(activity.descriptionGer);
                setDescriptionEn(activity.descriptionEn);
                setCurrentParticipants(activity.participants?.length || 0);
            } catch (err) {
                console.error(err);
                alert(t("home.activityNotFound"));
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (accessToken && user) {
            loadEvent();
        }
    }, [activityId, accessToken, user, navigate, t]);

    const validate = () => {
        const newErrors = {};

        if (!sport) newErrors.sport = t("errors.sportRequired");
        if (!dateTime) newErrors.dateTime = t("errors.dateTimeRequired");
        if (dateTime && new Date(dateTime) <= new Date()) {
            newErrors.dateTime = t("errors.dateTimeInPast");
        }
        if (
            !maxParticipants ||
            maxParticipants < currentParticipants ||
            maxParticipants <= 1
        ) {
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

        const updatedEvent = {
            sport,
            meetingPoint,
            descriptionGer,
            descriptionEn,
            maxParticipants: Number(maxParticipants),
            dateAndTime: dateTime.toISOString(),
        };

        try {
            const res = await fetch(
                `api/events/${activityId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(updatedEvent),
                }
            );

            if (!res.ok) throw new Error();

            navigate(`api/event/${activityId}`);
        } catch (err) {
            console.error(err);
            alert(t("errors.generic"));
        }
    };

    if (loading) {
        return <Typography sx={{ p: 4 }}>{t("home.loading")}</Typography>;
    }

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
                    {t("eventEdit.title")}
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

                <Button type="submit" variant="contained" size="large">
                    {t("eventEdit.submit")}
                </Button>
            </Box>
        </LocalizationProvider>
    );
}

export default EventEdit;
