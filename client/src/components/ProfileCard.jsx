import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit02Icon, LockKeyIcon, ClipboardIcon } from "hugeicons-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { logout, updateName, updatePassword } from "../utils/auth";
import { useAuth } from "../context/authContext";
import useLogout from "../hooks/useLogout";
// import { showConfirmModal } from "../redux/Slices/confirmModalSlice";


const ProfileDetail = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{label}</p>
        <p className="text-sm text-neutral-900 dark:text-neutral-100">{value}</p>
    </div>
);

const ProfileCard = ({ user }) => {

    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(user.name);

    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const {updateUser} = useAuth()
   const { mutate: logOutUser,  isPending } = useLogout()


    const {mutate:updateUserName}=useMutation({
    mutationFn: updateName,
    onMutate: () => {
      const toastId = toast.loading('Updating Name...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Name updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      updateUser(data?.data)
    },
    onError: (error, _, context) => {
      toast.update(context.toastId, {
        render: error?.response?.data?.message || 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  });

  const {mutate:updateUserPassword}=useMutation({
    mutationFn: updatePassword,
    onMutate: () => {
      const toastId = toast.loading('Updating Password...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Password updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      logOutUser()
    },
    onError: (error, _, context) => {
      toast.update(context.toastId, {
        render: error?.response?.data?.message || 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  });

    const handleUpdateName = async () => {
        if (name.trim().length < 3) return toast.error("Name must be at least 3 characters");
        const confirm = window.confirm(`Are you sure you want to change your name to ${name}?`)
        if(confirm){
            updateUserName(name)
            setEditingName(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
        const confirm = window.confirm(`Are you sure you want to change your password? This will log you out on all devices.`)
        if(confirm){
            updateUserPassword({ currentPassword, newPassword })
            setEditingName(false);
            setCurrentPassword("");
            setNewPassword("");
            setShowPasswordFields(false);
        }
        
    };

    return (
        <div
            className="w-full h-full max-w-md mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    Profile Overview
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your personal details</p>
            </div>

            <div className="space-y-4">
                {/* Name Section */}
                <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Name</label>
                    {editingName ? (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700"
                            />
                            <button
                                onClick={handleUpdateName}
                                className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-md"
                                aria-label="Save Name"
                            >
                                <ClipboardIcon size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-neutral-900 dark:text-neutral-100">{user.name}</p>
                            <button
                                onClick={() => setEditingName(true)}
                                className="cursor-pointer text-sm text-indigo-600 hover:underline flex items-center gap-1"
                            >
                                <Edit02Icon size={16} /> Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Email */}
                <ProfileDetail label="Email" value={user.email} />
                <ProfileDetail label="Account Created" value={format(new Date(user.createdAt), "PPP")} />

                {/* Password Section */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <button  onClick={() => setShowPasswordFields(!showPasswordFields)} className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 cursor-pointer hover:border-neutral-400 hover:dark:border-neutral-600" >
                        <LockKeyIcon size={18} className="me-2" />
                        Change Password
                    </button>

                    {showPasswordFields && (
                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    placeholder="******"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    placeholder="******"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700"
                                />
                            </div>

                            <button onClick={handleUpdatePassword} className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 cursor-pointer hover:border-neutral-400 hover:dark:border-neutral-600">
                                Save Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
