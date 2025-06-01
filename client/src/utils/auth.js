import api from "./api"

export const login = async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data;
}

export const logout = async () => {
    const response = await api.post('/auth/logout')
    return response.data;
}
export const signup = async (data) => {
    const response = await api.post('/auth/signup', data)
    return response.data
}
export const verifyEmail = async (data) => {
    const response = await api.post('/auth/verify', data)
    return response.data
}

export const resendVerificationEmail = async (data) => {
    const response = await api.post('/auth/resend-verification-email', data)
    return response.data

}

export const googleLogin = async (data) => {
    const response = await api.post('/auth/google', data)
    return response.data

}

export const forgotPassword = async (data) => {
    const response = await api.post('/auth/forgot-password', data)
    return response.data

}

export const resetPassword = async (data) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data

}

export const getSessions = async (data) => {
    const response = await api.get('/auth/sessions', data)
    return response.data

}

export const deleteAllSessions = async () => {
    const response = await api.delete("/auth/sessions")
    return response.data
}

export const logoutOtherSessions = async (id) => {
    const response = await api.post("/auth/logout-others", { currentSessionId: id })
    return response.data
}

export const updateName = async (name) => {
    const response = await api.patch("/user/update-name", {name})
    return response.data
}

export const updatePassword = async (data) => {
    const response = await api.patch("user/update-password", data)
    return response.data
}
