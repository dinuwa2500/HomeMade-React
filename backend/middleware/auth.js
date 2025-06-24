import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    let authHeader = req.cookies.accesstoken || req.headers.authorization;

    if (!authHeader) {
      authHeader = req.query.token;
    }

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication token missing",
        error: true,
        success: false,
      });
    }

    let token;

    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Invalid token payload",
        error: true,
        success: false,
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
        error: true,
        success: false,
      });
    }

    return res.status(401).json({
      message: "Invalid or malformed token",
      error: true,
      success: false,
    });
  }
};

export default auth;
