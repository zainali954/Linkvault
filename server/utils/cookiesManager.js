const manageCookie = (res, name, value = '', options = {}) => {
    const defaultOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None': 'strict',// for cross origin
        path: '/',
        maxAge: value ? undefined : 0, // Clear cookie if no value is provided
    };

    const cookieOptions = { ...defaultOptions, ...options };

    res.cookie(name, value, cookieOptions);
};

const setCookies = (res, refreshToken, accessToken) => {
    manageCookie(res, 'refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    manageCookie(res, 'accessToken', accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  };
  

const clearCookies = (res) => {
    manageCookie(res, 'refreshToken'); // Clear refreshToken
    manageCookie(res, 'accessToken'); // Clear refreshToken
};

export { setCookies, clearCookies };