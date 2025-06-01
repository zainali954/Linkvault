import React from "react";
import { Delete03Icon, Login02Icon, Login03Icon } from "hugeicons-react";
import { useAuth } from "../context/authContext";
import useDeleteAllSessions from "../hooks/useDeleteAllSessions";
import useLogoutAllSessions from "../hooks/useLogoutAllSessions";
import useLogout from "../hooks/useLogout";

export default function SessionButtons() {
  const { sessionId, updateSessionId, updateUser } = useAuth();
const deleteAllSessions = useDeleteAllSessions();
const logoutAllSessions = useLogoutAllSessions();
   const { mutate: logOutUser } = useLogout()


  const logoutOtherSessions = () => {
    const confirm = window.confirm("Are you sure? This will log you out from all other devices except this one.")
    if (confirm) {
      logoutAllSessions.mutate(sessionId)
    }
  }
  const deleteAllSessionsHandler = () => {
    const confirm = window.confirm("Are you sure? This will delete all your sessions, including this one. You will be logged out from everywhere. ⚠️ Don’t worry — your account and data will remain safe.")
    if (confirm) {
      deleteAllSessions.mutate(undefined,{
        onSuccess: () => {
          updateUser("")
          updateSessionId("")
          localStorage.removeItem("user")
          localStorage.removeItem("sessionId")
        }
      })
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="inline-flex items-center overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-sm">
          <button
            onClick={ logOutUser}
            className="cursor-pointer flex gap-1 items-center px-4 py-2 text-sm font-medium border-r border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 dark:text-white transition-colors"
          >
            <Login02Icon size={18} /> Logout Current
          </button>
          <button
            onClick={logoutOtherSessions}
            className="cursor-pointer flex gap-1 items-center px-4 py-2 text-sm font-medium border-r border-zinc-300 dark:border-zinc-700 hover:bg-yellow-100 dark:hover:bg-yellow-900 text-yellow-800 dark:text-yellow-100 transition-colors"
          >
            <Login03Icon size={18} /> Logout Others
          </button>
          <button
            onClick={deleteAllSessionsHandler}
            className="cursor-pointer flex gap-1 items-center px-4 py-2 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900 text-red-800 dark:text-red-100 transition-colors"
          >
            <Delete03Icon size={18} /> Remove All
          </button>
        </div>
      </div>
    </div>
  );
}
