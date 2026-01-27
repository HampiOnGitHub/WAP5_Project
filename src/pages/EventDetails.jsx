import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CardMedia,
    CardContent,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { user, accessToken } = useAuth();

    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const isOrganizer =
        user &&
        activity?.participants?.[0]?.username === user.username;

    const isParticipant =
        user &&
        activity?.participants?.some(
            (p) => p.username === user.username
        );

    const isFull =
        (activity?.participants?.length ?? 0) >= activity?.maxParticipants;

    const canSignUp = user && !isOrganizer && !isFull && !isParticipant;

    const cardImages = {
        football: "/images/football.jpg",
        tennis: "/images/tennisCard.jpg",
        volleyball: "/images/volleyballCard.jpg",
        basketball: "/images/basketballCard.jpg",
        running: "/images/running.jpg",
        fitness: "/images/fitness.jpg",
        swimming: "/images/swimming.jpg",
        skiing: "/images/skiing.jpg",
        golf: "/images/golf.jpg",
        gymnastics: "/images/gymnastics.jpg",
        bouldering: "/images/bouldering.jpg",
        other: "/images/other.jpg",
    };

    useEffect(() => {
        const loadActivity = async () => {
            try {
                const res = await fetch(
                    `/api/events/${activityId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to load event");
                }

                const data = await res.json();
                setActivity(data);
                setError(false);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            loadActivity();
        }
    }, [activityId, accessToken]);

    const handleSignUp = async () => {
        try {
            const res = await fetch(
                `/api/events/${activityId}/join`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!res.ok) throw new Error();

            const updated = await res.json();
            setActivity(updated);
            alert(t("eventDetails.signedUp"));
        } catch {
            alert(t("errors.generic"));
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const res = await fetch(
                `/api/events/${activityId}/leave`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!res.ok) throw new Error();

            const updated = await res.json();
            setActivity(updated);
            alert(t("eventDetails.unsubscribed"));
        } catch {
            alert(t("errors.generic"));
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(
                `/api/events/${activityId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!res.ok) throw new Error();

            alert(t("eventDetails.deletedEvent"));
            navigate("/");
        } catch {
            alert(t("errors.generic"));
        }
    };

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
                {t("sports." + activity.sport)}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {t("home.organizer")}:{" "}
                {activity.participants?.[0]?.username}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                {t("home.date")}
                {new Date(activity.dateAndTime).toLocaleString()}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                {t("eventCreate.meetingPoint")}: {activity.meetingPoint}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                {activity.participants.length} / {activity.maxParticipants}{" "}
                {t("home.activityParticipants")}
            </Typography>

            <CardMedia
                component="img"
                image={cardImages[activity.sport] || "/images/other.jpg"}
                alt={activity.sport}
                sx={{ borderRadius: 2, my: 2 }}
                height="350"
            />

            <CardContent>
                <Typography variant="body1">
                    {currentLanguage === "en"
                        ? activity.descriptionEn
                        : activity.descriptionGer}
                </Typography>
            </CardContent>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
                <Button variant="contained" component={Link} to="/">
                    {t("home.goBack")}
                </Button>

                {canSignUp && (
                    <Button
                        variant="contained"
                        onClick={handleSignUp}
                        sx={{
                            backgroundColor: "success.main",
                            "&:hover": {
                                backgroundColor: "success.dark",
                            },
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
                    <>
                        <Button
                            variant="outlined"
                            color="warning"
                            component={Link}
                            to={`/event/${activity._id}/edit`}
                        >
                            {t("eventDetails.editEvent")}
                        </Button>

                        <Button
                            variant="contained"
                            color="warning"
                            onClick={handleDelete}
                        >
                            {t("eventDetails.deleteEvent")}
                        </Button>
                    </>
                )}

                {isParticipant && !isOrganizer && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleUnsubscribe}
                    >
                        {t("eventDetails.unsubscribe")}
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default EventDetails;
