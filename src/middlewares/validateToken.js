import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    try {

        
        const authHeader = req.headers.authorization;


        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided",
                code: "NO_TOKEN"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid token format",
                code: "INVALID_TOKEN_FORMAT"
            });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token extraído:", token ? "Token presente" : "Token ausente");

        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log("Error en verificación de token:", err.name);
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        message: "Token expired",
                        code: "TOKEN_EXPIRED"
                    });
                }
                return res.status(401).json({
                    message: "Invalid token",
                    code: "INVALID_TOKEN"
                });
            }

            console.log("Token verificado exitosamente. Usuario:", decoded.id);
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error("Error en middleware:", error);
        return res.status(500).json({
            message: "Server error while validating token",
            code: "SERVER_ERROR"
        });
    }
};

