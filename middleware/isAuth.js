import jwt from "jsonwebtoken";

async function isAuth(req, res, next) {
    try {
        const { Token } = req.cookies;
        if (!Token) {
            return res.status(400).json({
                message: "please login",
                success: false,
            });
        }

        // VerifyToken
        const VerifyToken = await jwt.verify(Token, process.env.SIGN_TOKEN);
        if (!VerifyToken) {
            return res.status(400).json({
                message: "not access",
                success: false,
            });
        }

        req.userId = VerifyToken.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
export default isAuth;
