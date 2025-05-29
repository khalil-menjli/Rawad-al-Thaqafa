// UsersPage.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader, Trash2, Eye, User } from "lucide-react";
import { useUserStore } from "../../hooks/useUsers";

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const {
    users,
    loading,
    error,
    getAllUsers,
    deleteUser
  } = useUserStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  return (
      <div className="w-full p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#2e4057] flex items-center gap-3">
            <User className="w-8 h-8 text-[#ff6b6b]" />
            User Management
          </h1>
          <p className="text-[#82a0b6] mt-2">Manage all registered users in the system</p>
        </div>

        {loading ? (
            <div className="text-center p-12">
              <Loader className="w-12 h-12 animate-spin mx-auto text-[#ff6b6b] mb-4" />
              <p className="text-[#82a0b6]">Loading users...</p>
            </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
        ) : (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2e4057] to-[#3a5068] px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-white font-semibold text-lg">All Users</h2>
                  <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">
                  Total: {users?.length || 0}
                </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Email</th>


                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#2e4057]">Actions</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                  {users?.map((user, index) => (
                      <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {user.firstName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#2e4057]">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#82a0b6]">{user.email}</td>


                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => handleViewUser(user)}
                                className="p-2 text-[#82a0b6] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-all duration-200 group-hover:scale-110"
                                title="View user details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => deleteUser(user._id)}
                                className="p-2 text-[#82a0b6] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                                title="Delete user"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {(!users || users.length === 0) && !loading && (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-[#82a0b6] text-lg font-medium">No users found</p>
                    <p className="text-gray-400 mt-2">Users will appear here once they register</p>
                  </div>
              )}
            </motion.div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={handleCloseModal}
            >
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {selectedUser.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <h3 className="text-xl font-bold text-[#2e4057]">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-[#82a0b6]">{selectedUser.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-[#2e4057]">Role</span>
                    <span className="px-3 py-1 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] text-xs font-medium">
                  {selectedUser.role}
                </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-[#2e4057]">User ID</span>
                    <span className="text-sm text-[#82a0b6] font-mono">
                  {selectedUser._id}
                </span>
                  </div>

                  {selectedUser.createdAt && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-[#2e4057]">Joined</span>
                        <span className="text-sm text-[#82a0b6]">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </span>
                      </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 text-[#82a0b6] hover:text-[#2e4057] transition-colors rounded-lg border border-gray-200 hover:border-gray-300"
                  >
                    Close
                  </button>
                  <button
                      onClick={() => {
                        deleteUser(selectedUser._id);
                        handleCloseModal();
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              </motion.div>
            </motion.div>
        )}
      </div>
  );
};

export default UsersPage;