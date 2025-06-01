
import { useEffect } from "react";
import { format } from "date-fns";
import { getDeviceInfo } from "../utils/parseUserAgent";
import SessionButtons from "../components/SessionButtons";
import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../utils/auth";
import { useAuth } from "../context/authContext";

const SessionsPage = () => {
    const { user, updateSessionId, sessionId, updateUser } = useAuth()

    const {data:sessionsData} = useQuery({
        queryKey: ["sessions"],
        queryFn: getSessions,
        staleTime: 5000
    })

  return (
    <div className="min-h-screen px-0 py-4 md:py-8 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div
        className="w-full md:max-w-4xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Sessions</h1>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 ">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            This is a full list of your active and past sessions across all devices. If anything seems off, you can log out from other sessions or remove all.
          </p>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            Note: Each session is automatically removed after 30 days. Don’t worry — your account and data will remain safe.
          </p>

          <ul>
            {sessionsData?.data.map((session) => {
              const { browserName, browserVersion, osName } = getDeviceInfo(session.userAgent);

              return (
                <li
                  key={session._id}
                  className="py-4 flex justify-between items-start border-b border-zinc-200 dark:border-zinc-700 last:border-none"
                >
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">IP:</span>{" "}
                      {session.ipAddress === "::1" ? "Localhost" : session.ipAddress}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {browserName} {browserVersion} on {osName}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Created: {format(new Date(session.createdAt), "PPpp")}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs md:text-sm font-medium px-2 md:px-3 py-1 rounded-full ${
                        session.isValid ? " bg-green-600 text-white" : "bg-zinc-500 text-white"
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
          <SessionButtons/>

        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
