import expressJwt from "express-jwt";
import jwt from "jsonwebtoken";
import Http from "http-status-codes";
const authJwt = () => {
  return expressJwt // expressJwt is a function
    .expressjwt({
      secret: process.env.JWT_SECRET, // the secret to decrypt the token
      algorithms: ["HS256"], // algorithm used to encrypt the token
      getToken: (req, res) => {
        // function to get the token from the request
        if (
          req.headers.authorization && // if the request has the authorization header
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          const token = req.headers.authorization.split(" ")[1]; // get the token
          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            // verify the token
            if (err) {
              return res.status(Http.UNAUTHORIZED).json({
                // if the token is invalid, return an error
                message: "Unauthorized",
              });
            }
              req.user = decoded.user; // if the token is valid, set the user object in the request
          });
          return token; // return the token
        }
        return null;
      },
    })
    .unless({ path: ["/api/login", "/api/register"] }); // unless the path is /api/login or /api/register
};

export default authJwt;
