
import { getSessions } from "../utils/auth.js";
import { format } from "date-fns";
import { getDeviceInfo } from "../utils/parseUserAgent";
import { Link } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import SessionButtons from "../components/SessionButtons";
import { useAuth } from "../context/authContext.jsx";
import { useQuery } from "@tanstack/react-query";

const Settings = () => {
    const { user, sessionId, updateSessionId, updateUser } = useAuth()

    const { data: sessionsData } = useQuery({
        queryKey: ["sessions"],
        queryFn: getSessions,
        staleTime: 5000
    })

    return (
        <div className="flex flex-col md:flex-row gap-4  text-neutral-900 dark:text-neutral-100 transition-colors ">
            <ProfileCard user={user} />

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Recent Sessions</h2>
                    <Link
                        to={"/sessions"}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                        See All
                    </Link>
                </div>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    These are the devices and browsers where your account was recently accessed. If you see any suspicious
                    activity, please log out from other sessions or reset your password.
                </p>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                    Note: Each session is automatically removed after 30 days.
                </p>

                <ul>
                    {sessionsData?.data.slice(0, 5).map((session) => {
                        const { browserName, browserVersion, osName } = getDeviceInfo(session.userAgent);

                        return (
                            <li
                                key={session._id}
                                className="py-4 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-700 last:border-none"
                            >
                                <div>
                                    <p className="text-sm">
                                        <span className="font-medium">IP:</span>{" "}
                                        {session.ipAddress === "::1" ? "Localhost" : session.ipAddress}
                                    </p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {browserName} {browserVersion} on {osName}
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-1">
                                        Created: {format(new Date(session.createdAt), "PPpp")}
                                    </p>
                                </div>
                                <div>
                                    <span
                                        className={`font-medium px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${session.isValid ? " bg-green-600 text-white" : "bg-neutral-500 text-white"
                                            }`}
                                    >
                                        {session.isValid ? "Active" : "Revoked"}
                                        {session._id === sessionId && " • This Device"}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <SessionButtons />
            </div>
        </div>
    );
};

export default Settings;
