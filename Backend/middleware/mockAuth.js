export default function mockAuth(req, res, next) {
    const userId = req.headers["x-user-id"];
    const username = req.headers["x-username"];

    if (!userId) {
        return res.status(401).json({ message: "Not authenticated (mock)" });
    }

    req.user = {
        id: userId,
        username: username || "mockUser",
    };

    next();
}
