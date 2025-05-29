// src/pages/TasksPage.tsx
import { useEffect, useState } from "react";
import {
  Loader,
  Trash2,
  Edit3,
  Plus,
  Book,
  Building2,
  Library,
  Film,
  Target,
  Users,
  Trophy,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { StatsCard } from "../../components/Cards/StatsCard";
import { useTasksStore } from "../../hooks/useTasks";
import { Task } from "../../types/types";
import {TaskModal} from "../../components/ui/TaskModal.tsx";

type Category = Task["category"];

export const TasksPage = () => {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: "",
  });

  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } =
      useTasksStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const icon = (c: Category) => {
    switch (c) {
      case "Books":
        return <Book className="h-4 w-4" />;
      case "Museums":
        return <Building2 className="h-4 w-4" />;
      case "Library":
        return <Library className="h-4 w-4" />;
      case "Cinema":
        return <Film className="h-4 w-4" />;
    }
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const totalPoints = tasks.reduce((sum, t) => sum + t.pointToWin, 0);
  // Assuming you have completedBy field in Task type for tracking completions
  const totalCompletions = tasks.reduce((sum, t) => sum + (t.completedBy || 0), 0);

  return (
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tasks Management</h1>
            <p className="text-gray-600 mt-1">Create and manage user achievements</p>
          </div>
          <Button
              onClick={() => {
                setEditTask(null);
                setModalOpen(true);
              }}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
              icon={<Target className="h-6 w-6" />}
              title="Total Tasks"
              value={totalTasks}
          />
          <StatsCard
              icon={<Trophy className="h-6 w-6" />}
              title="Total Points Available"
              value={totalPoints}
              color="purple"
          />
          <StatsCard
              icon={<Users className="h-6 w-6" />}
              title="Total Completions"
              value={totalCompletions}
              color="green"
          />
        </div>

        {/* Table */}
        {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600 text-center">{error}</div>
            </div>
        ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Task", "Category", "Requirements", "Points", "Completions", "Actions"].map(
                        (header) => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                        )
                    )}
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {icon(task.category)}
                            <span className="text-sm text-gray-700">{task.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {task.requiredReservations} reservations
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {task.pointToWin} pts
                      </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {task.completedBy || 0} users
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                  setEditTask(task);
                                  setModalOpen(true);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150"
                                title="Edit task"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() =>
                                    setConfirm({ isOpen: true, id: task._id })
                                }
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-150"
                                title="Delete task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              {tasks.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No tasks created yet</h3>
                    <p className="text-sm text-gray-500">
                      Create your first achievement task for users to complete.
                    </p>
                  </div>
              )}
            </div>
        )}

        {/* Task Modal */}
        {modalOpen && (
            <TaskModal
                initialData={editTask ?? undefined}
                onClose={() => setModalOpen(false)}
                onSubmit={(data) => {
                  if (editTask) updateTask(editTask._id, data);
                  else createTask(data);
                  setModalOpen(false);
                }}
            />
        )}

        {/* Delete Confirm */}
        <ConfirmDialog
            isOpen={confirm.isOpen}
            title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone."
            onClose={() => setConfirm((c) => ({ ...c, isOpen: false }))}
            onConfirm={() => {
              deleteTask(confirm.id);
              setConfirm((c) => ({ ...c, isOpen: false }));
            }}
        />
      </div>
  );
};

export default TasksPage;