import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function OrganizerRoute() {
    const { user } = useAuth();
    const { activityId } = useParams();
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        if (!user) {
            setAllowed(false);
            return;
        }

        const mockActivities = [
            { activityId: "1", organizerid: 1 },
            { activityId: "2", organizerid: 2 },
        ];

        const activity = mockActivities.find(a => a.activityId === activityId);

        setAllowed(activity && user.id === activity.organizerid);
    }, [user, activityId]);

    if (allowed === null) return null;

    if (!allowed) {
        return <Navigate to={`/event/${activityId}`} replace />;
    }

    return <Outlet />;
}

export default OrganizerRoute;
