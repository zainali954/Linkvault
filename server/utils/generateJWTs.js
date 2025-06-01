import jwt from "jsonwebtoken";

const generateJWTs= (userId, sessionId)=>{
    const accessToken = jwt.sign(
        {id: userId},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
    )
    const refreshToken = jwt.sign(
        {id: userId, sessionId},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"}
    )
    return {accessToken, refreshToken}
}

export default generateJWTs