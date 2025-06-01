const getClientInfo = (req) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return { ipAddress, userAgent };
  };
export default getClientInfo;  