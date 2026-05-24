import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Middleware started`);
  console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Request URL: ${req.method} ${req.originalUrl}`);
  
  try {
    let token;
    let tokenSource = null;

    // check authorization header
    console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Checking authorization header`);
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Bearer token found in authorization header`);
      tokenSource = "Authorization Header";
      
      // get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Token extracted (length: ${token?.length || 0} chars)`);

      // verify token
      console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Verifying JWT token`);
      
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );
        
        console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Token verified successfully`);
        console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Decoded token payload:`, {
          id: decoded.id,
          iat: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : null,
          exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
        });

        // get user without password
        console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Fetching user from database: ${decoded.id}`);
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
          console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - User not found in database: ${decoded.id}`);
          const duration = Date.now() - startTime;
          console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Middleware failed - User not found (Duration: ${duration}ms)`);
          
          return res.status(401).json({
            message: "Not authorized, user not found",
          });
        }
        
        console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - User found: ${user._id} (Email: ${user.email})`);
        req.user = user;
        
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Authentication successful for user: ${user._id} (Duration: ${duration}ms)`);
        
        next();

      } catch (jwtError) {
        console.error(`[${new Date().toISOString()}] [${requestId}] PROTECT - JWT verification failed: ${jwtError.message}`);
        
        if (jwtError.name === 'TokenExpiredError') {
          console.error(`[${new Date().toISOString()}] [${requestId}] PROTECT - Token expired at: ${new Date(jwtError.expiredAt).toISOString()}`);
          return res.status(401).json({
            message: "Not authorized, token expired",
          });
        } else if (jwtError.name === 'JsonWebTokenError') {
          console.error(`[${new Date().toISOString()}] [${requestId}] PROTECT - Invalid token: ${jwtError.message}`);
          return res.status(401).json({
            message: "Not authorized, invalid token",
          });
        } else {
          throw jwtError;
        }
      }

    } else {
      console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - No Bearer token found in authorization header`);
      
      if (req.headers.authorization) {
        console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Authorization header present but not Bearer type: ${req.headers.authorization.substring(0, 50)}...`);
      } else {
        console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - No authorization header present`);
      }
      
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Middleware failed - No token provided (Duration: ${duration}ms)`);
      
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] PROTECT - Unexpected error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] PROTECT - Stack trace:`, error.stack);
    console.error(`[${new Date().toISOString()}] [${requestId}] PROTECT - Error details:`, {
      name: error.name,
      code: error.code,
      status: error.status
    });
    
    console.log(`[${new Date().toISOString()}] [${requestId}] PROTECT - Middleware failed with error (Duration: ${duration}ms)`);
    
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export default protect;