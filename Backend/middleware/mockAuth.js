export default function mockAuth(req, res, next) {
    const userId = req.headers["x-user-id"];

    if (!userId) {
        return res.status(401).json({ message: "Not authenticated (mock)" });
    }

    req.user = {
        id: Number(userId),
        username: "mockUser",
    };

    next();
}
