import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, CardMedia, CardContent, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
    const { activityId } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();

    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const activities = [
        {
            activityId: 1,
            title: "Tennis",
            organizerid: 1,
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2026-07-15T10:00:00",
        },
        {
            activityId: 2,
            title: "Basketball",
            organizerid: 2,
            organizer: "Jonas Swag",
            description: "Entspanntes Basketballspiel für alle Levels.",
            img: "/images/basketball.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K.", "Max T.", "John D.", "1", "2", "3", "10", "11"],
            maxParticipants: 10,
            dateAndTime: "2026-07-29T10:00:00",
        },
        {
            activityId: 3,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: null,
        },
        {
            activityId: 4,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2026-07-15T10:00:00",
        },
        {
            activityId: 5,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2026-07-15T10:00:00",
        },
        {
            activityId: 6,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2026-07-15T10:00:00",
        },
    ];

    const isOrganizer = user && activity?.organizerid && user.id === activity.organizerid;
    const isFull = (activity?.participants?.length ?? 0) >= activity?.maxParticipants;
    const canSignUp = user && !isOrganizer && !isFull;

    useEffect(() => {
        /* const loadActivity = async () => {
            try {
                const response = await fetch(`/event/eventDetail/${activityId}`);

                if (!response.ok) {
                    throw new Error("Failed to load event");
                }

                const data = await response.json();
                setActivity(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };*/
        const loadActivity = async () => {
            setLoading(true);

            await new Promise((res) => setTimeout(res, 1000)); // mock delay

            const foundActivity = activities.find(
                (activity) => activity.activityId.toString() === activityId
            );

            if (foundActivity) {
                setActivity(foundActivity);
                setError(false);
            } else {
                setActivity(null);
                setError(true);
            }

            setLoading(false);
        };

        loadActivity();
    }, [activityId]);

    if (loading) {
        return <Typography sx={{ p: 4 }}>{t("home.loading")}</Typography>;
    }

    if (error || !activity) {
        return (
            <Typography sx={{ p: 4 }}>
                {t("home.activityNotFound")}
            </Typography>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto" }}>
            <Typography variant="h3" gutterBottom>
                {activity.title}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {t("home.organizer")}: {activity.organizer}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                {t("home.date")}
                {activity.dateAndTime
                    ? new Date(activity.dateAndTime).toLocaleString()
                    : t("home.noDateYet")}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                {(activity.participants?.length ?? 0)} / {activity.maxParticipants}{" "}
                {t("home.activityParticipants")}
            </Typography>

            <CardMedia
                component="img"
                image={activity.img}
                alt={activity.title}
                sx={{ borderRadius: 2, my: 2 }}
                height="350"
            />

            <CardContent>
                <Typography variant="body1">
                    {activity.description}
                </Typography>
            </CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    onClick={() => window.history.back()}
                >
                    {t("home.goBack")}
                </Button>

                {canSignUp && (
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "success.main",
                            "&:hover": { backgroundColor: "success.dark" },
                        }}
                    >
                        {t("eventDetails.signUp")}
                    </Button>
                )}

                {isFull && !isOrganizer && (
                    <Button
                        variant="contained"
                        disabled
                        sx={{ backgroundColor: "error.main" }}
                    >
                        {t("eventDetails.full")}
                    </Button>
                )}

                {isOrganizer && (
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => console.log("Edit event")}
                    >
                        {t("eventDetails.editEvent")}
                    </Button>
                )}
            </Box>

        </Box>
    );
}

export default EventDetails;