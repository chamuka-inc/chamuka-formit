"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  User,
  Settings,
  Lock,
  Bell,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";
import { api as trpc } from "@/lib/trpc/react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "notifications" | "appearance"
  >("profile");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState({
    formResponses: true,
    weeklySummary: true,
    productUpdates: false,
  });
  const [pushNotifications, setPushNotifications] = useState({
    newResponses: true,
    formCompletion: false,
  });

  // tRPC mutations
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
      setLoading(false);
    },
  });

  const updatePasswordMutation = trpc.user.updatePassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update password");
    },
  });

  const updateNotificationsMutation = trpc.user.updateNotifications.useMutation(
    {
      onSuccess: () => {
        toast.success("Notification preferences updated");
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to update notification preferences",
        );
      },
    },
  );

  const updateAppearanceMutation = trpc.user.updateAppearance.useMutation({
    onSuccess: (data) => {
      toast.success(`Theme changed to ${data.theme}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update appearance preferences");
    },
  });

  // Fetch user profile data
  const { data: userData, isLoading: isLoadingUser } =
    trpc.user.getProfile.useQuery();

  // Update form when profile data is loaded
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
    } else if (session?.user) {
      // Fallback to session data if userData is not available
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [userData, session]);

  // Handle form submissions
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    updateProfileMutation.mutate({
      name,
      bio,
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  const handleSaveNotifications = () => {
    updateNotificationsMutation.mutate({
      emailNotifications,
      pushNotifications,
    });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateAppearanceMutation.mutate({ theme: newTheme });
  };

  return (
    <div className='mx-auto max-w-6xl p-4'>
      <h1 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
        Settings
      </h1>

      <div className='overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800'>
        <div className='flex flex-col md:flex-row'>
          {/* Sidebar */}
          <div className='w-full border-b border-gray-200 dark:border-gray-700 md:w-64 md:border-b-0 md:border-r'>
            <nav className='p-4'>
              <button
                onClick={() => setActiveTab("profile")}
                className={`mb-2 flex w-full items-center rounded-md px-4 py-2 text-left ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <User className='mr-2 h-5 w-5' />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`mb-2 flex w-full items-center rounded-md px-4 py-2 text-left ${
                  activeTab === "account"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Lock className='mr-2 h-5 w-5' />
                <span>Account & Security</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`mb-2 flex w-full items-center rounded-md px-4 py-2 text-left ${
                  activeTab === "notifications"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Bell className='mr-2 h-5 w-5' />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`mb-2 flex w-full items-center rounded-md px-4 py-2 text-left ${
                  activeTab === "appearance"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className='mr-2 h-5 w-5' />
                <span>Appearance</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className='flex-1 p-6'>
            {activeTab === "profile" && (
              <div>
                <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                  Profile Information
                </h2>
                {isLoadingUser && !session ? (
                  <div className='flex justify-center py-8'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile}>
                    <div className='mb-6'>
                      <label
                        className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                        htmlFor='name'
                      >
                        Full Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div className='mb-6'>
                      <label
                        className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                        htmlFor='email'
                      >
                        Email Address
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={email}
                        disabled
                        className='w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                        Email cannot be changed
                      </p>
                    </div>

                    <div className='mb-6'>
                      <label
                        className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                        htmlFor='bio'
                      >
                        Bio
                      </label>
                      <textarea
                        id='bio'
                        name='bio'
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <button
                        type='submit'
                        disabled={loading || updateProfileMutation.isPending}
                        className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {loading || updateProfileMutation.isPending ? (
                          <>
                            <svg
                              className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                            >
                              <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                              ></circle>
                              <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "account" && (
              <div>
                <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                  Account & Security
                </h2>

                <div className='mb-8'>
                  <h3 className='mb-3 text-lg font-medium text-gray-900 dark:text-white'>
                    Change Password
                  </h3>
                  <form onSubmit={handleUpdatePassword} className='space-y-4'>
                    <div>
                      <label
                        className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                        htmlFor='current-password'
                      >
                        Current Password
                      </label>
                      <input
                        type='password'
                        id='current-password'
                        name='current_password'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <label
                        className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                        htmlFor='new-password'
                      >
                        New Password
                      </label>
                      <input
                        type='password'
                        id='new-password'
                        name='new_password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <label
                        className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                        htmlFor='confirm-password'
                      >
                        Confirm New Password
                      </label>
                      <input
                        type='password'
                        id='confirm-password'
                        name='confirm_password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <button
                        type='submit'
                        disabled={updatePasswordMutation.isPending}
                        className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {updatePasswordMutation.isPending ? (
                          <>
                            <svg
                              className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                            >
                              <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                              ></circle>
                              <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              ></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <h3 className='mb-3 text-lg font-medium text-gray-900 dark:text-white'>
                    Danger Zone
                  </h3>
                  <div className='rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
                    <h4 className='text-base font-medium text-red-800 dark:text-red-400'>
                      Delete Account
                    </h4>
                    <p className='mb-3 mt-1 text-sm text-red-700 dark:text-red-300'>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button
                      type='button'
                      className='inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                  Notification Preferences
                </h2>
                <div className='space-y-6'>
                  <div>
                    <h3 className='mb-2 text-base font-medium text-gray-900 dark:text-white'>
                      Email Notifications
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <label className='text-sm text-gray-700 dark:text-gray-300'>
                          Form Responses
                        </label>
                        <div className='relative mr-2 inline-block w-10 select-none align-middle'>
                          <input
                            type='checkbox'
                            name='form_responses'
                            id='form-responses'
                            checked={emailNotifications.formResponses}
                            onChange={(e) =>
                              setEmailNotifications({
                                ...emailNotifications,
                                formResponses: e.target.checked,
                              })
                            }
                            className='absolute right-4 block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white outline-none duration-200 ease-in checked:right-0 checked:bg-blue-500 focus:outline-none'
                          />
                          <label
                            htmlFor='form-responses'
                            className='block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600'
                          ></label>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <label className='text-sm text-gray-700 dark:text-gray-300'>
                          Weekly Summary
                        </label>
                        <div className='relative mr-2 inline-block w-10 select-none align-middle'>
                          <input
                            type='checkbox'
                            name='weekly_summary'
                            id='weekly-summary'
                            checked={emailNotifications.weeklySummary}
                            onChange={(e) =>
                              setEmailNotifications({
                                ...emailNotifications,
                                weeklySummary: e.target.checked,
                              })
                            }
                            className='absolute right-4 block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white outline-none duration-200 ease-in checked:right-0 checked:bg-blue-500 focus:outline-none'
                          />
                          <label
                            htmlFor='weekly-summary'
                            className='block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600'
                          ></label>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <label className='text-sm text-gray-700 dark:text-gray-300'>
                          Product Updates
                        </label>
                        <div className='relative mr-2 inline-block w-10 select-none align-middle'>
                          <input
                            type='checkbox'
                            name='product_updates'
                            id='product-updates'
                            checked={emailNotifications.productUpdates}
                            onChange={(e) =>
                              setEmailNotifications({
                                ...emailNotifications,
                                productUpdates: e.target.checked,
                              })
                            }
                            className='absolute right-4 block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white outline-none duration-200 ease-in checked:right-0 checked:bg-blue-500 focus:outline-none'
                          />
                          <label
                            htmlFor='product-updates'
                            className='block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600'
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='mb-2 text-base font-medium text-gray-900 dark:text-white'>
                      Push Notifications
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <label className='text-sm text-gray-700 dark:text-gray-300'>
                          New Responses
                        </label>
                        <div className='relative mr-2 inline-block w-10 select-none align-middle'>
                          <input
                            type='checkbox'
                            name='new_responses'
                            id='new-responses'
                            checked={pushNotifications.newResponses}
                            onChange={(e) =>
                              setPushNotifications({
                                ...pushNotifications,
                                newResponses: e.target.checked,
                              })
                            }
                            className='absolute right-4 block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white outline-none duration-200 ease-in checked:right-0 checked:bg-blue-500 focus:outline-none'
                          />
                          <label
                            htmlFor='new-responses'
                            className='block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600'
                          ></label>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <label className='text-sm text-gray-700 dark:text-gray-300'>
                          Form Completion
                        </label>
                        <div className='relative mr-2 inline-block w-10 select-none align-middle'>
                          <input
                            type='checkbox'
                            name='form_completion'
                            id='form-completion'
                            checked={pushNotifications.formCompletion}
                            onChange={(e) =>
                              setPushNotifications({
                                ...pushNotifications,
                                formCompletion: e.target.checked,
                              })
                            }
                            className='absolute right-4 block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white outline-none duration-200 ease-in checked:right-0 checked:bg-blue-500 focus:outline-none'
                          />
                          <label
                            htmlFor='form-completion'
                            className='block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600'
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='pt-4'>
                    <button
                      type='button'
                      onClick={handleSaveNotifications}
                      disabled={updateNotificationsMutation.isPending}
                      className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {updateNotificationsMutation.isPending ? (
                        <>
                          <svg
                            className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div>
                <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                  Appearance
                </h2>
                <div className='space-y-6'>
                  <div>
                    <h3 className='mb-4 text-base font-medium text-gray-900 dark:text-white'>
                      Theme
                    </h3>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                      <button
                        type='button'
                        onClick={() => handleThemeChange("light")}
                        className={`relative flex items-center justify-center rounded-lg border p-4 ${
                          theme === "light"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className='flex flex-col items-center'>
                          <Sun className='mb-2 h-8 w-8 text-yellow-500' />
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            Light
                          </span>
                        </div>
                        {theme === "light" && (
                          <div className='absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500'>
                            <Check className='h-3 w-3 text-white' />
                          </div>
                        )}
                      </button>

                      <button
                        type='button'
                        onClick={() => handleThemeChange("dark")}
                        className={`relative flex items-center justify-center rounded-lg border p-4 ${
                          theme === "dark"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className='flex flex-col items-center'>
                          <Moon className='mb-2 h-8 w-8 text-indigo-500' />
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            Dark
                          </span>
                        </div>
                        {theme === "dark" && (
                          <div className='absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500'>
                            <Check className='h-3 w-3 text-white' />
                          </div>
                        )}
                      </button>

                      <button
                        type='button'
                        onClick={() => handleThemeChange("system")}
                        className={`relative flex items-center justify-center rounded-lg border p-4 ${
                          theme === "system"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className='flex flex-col items-center'>
                          <Monitor className='mb-2 h-8 w-8 text-gray-500' />
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            System
                          </span>
                        </div>
                        {theme === "system" && (
                          <div className='absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500'>
                            <Check className='h-3 w-3 text-white' />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
