import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, CardMedia, CardContent, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


function EventDetails() {
    const { activityId } = useParams();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { user } = useAuth();

    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const isOrganizer = user && activity?.creatorId && user.id === activity.creatorId;
    const isParticipant = user && activity?.participants?.some((p) => p.userId === user.id);

    const isFull = (activity?.participants?.length ?? 0) >= activity?.maxParticipants;
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

            const activities = JSON.parse(localStorage.getItem("events")) || [];

            const foundActivity = activities.find(
                (activity) => activity.localId.toString() === activityId
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

    const handleSignUp = () => {
        if (!user || !activity) return;
        if (
            activity.participants.some((p) => p.userId === user.id)
        ) {
            return;
        }

        const updatedActivity = {
            ...activity,
            participants: [
                ...activity.participants,
                {
                    userId: user.id,
                    username: user.username,
                },
            ],
        };

        const activities = JSON.parse(localStorage.getItem("events")) || [];

        const updatedActivities = activities.map((a) =>
            a.localId === activity.localId ? updatedActivity : a
        );

        localStorage.setItem("events", JSON.stringify(updatedActivities));
        alert(t("eventDetails.signedUp"));
        setActivity(updatedActivity);
    };

    const handleUnsubscribe = () => {
        if (!user || !activity) return;

        const updatedActivity = {
            ...activity,
            participants: activity.participants.filter(
                (p) => p.userId !== user.id
            ),
        };

        const activities = JSON.parse(localStorage.getItem("events")) || [];

        const updatedActivities = activities.map((a) =>
            a.localId === activity.localId ? updatedActivity : a
        );

        localStorage.setItem("events", JSON.stringify(updatedActivities));
        alert(t("eventDetails.unsubscribed"));
        setActivity(updatedActivity);
    };

    const handleDelete = () => {
        if (!user || !activity) return;

        const activities = JSON.parse(localStorage.getItem("events")) || [];
        const updatedActivities = activities.filter((a) => a.localId !== activity.localId);

        localStorage.setItem("events", JSON.stringify(updatedActivities));
        alert(t("eventDetails.deletedEvent"));
        window.history.back();
    }

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
                {t("home.organizer")}: {activity?.participants[0]?.username}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                {t("home.date")}
                {activity.dateAndTime
                    ? new Date(activity.dateAndTime).toLocaleString()
                    : t("home.noDateYet")}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                {t("eventCreate.meetingPoint")}: {activity.meetingPoint}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                {(activity.participants?.length ?? 0)} / {activity.maxParticipants}{" "}
                {t("home.activityParticipants")}
            </Typography>

            <CardMedia
                component="img"
                image={cardImages[activity.sport] || "/images/other.jpg"}
                alt={activity.title}
                sx={{ borderRadius: 2, my: 2 }}
                height="350"
            />

            <CardContent>
                <Typography variant="body1">
                    {currentLanguage === "en" ? activity.descriptionEn : activity.descriptionGer}
                </Typography>
            </CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    component={Link} to="/"
                >
                    {t("home.goBack")}
                </Button>

                {canSignUp && (
                    <Button
                        variant="contained"
                        onClick={handleSignUp}
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
                    <>
                        <Button
                            variant="outlined"
                            color="warning"
                            component={Link} to={`/event/${activity.localId}/edit`}
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