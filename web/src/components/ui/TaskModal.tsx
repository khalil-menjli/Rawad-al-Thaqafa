// src/components/ui/TaskModal.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Book, Building2, Library, Film } from 'lucide-react';
import { Button } from './Button';
import { Task } from '../../types/types';

type Category = Task['category'];

// Zod schema for task validation
const taskSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).trim(),
    category: z.enum(['Books', 'Museums', 'Library', 'Cinema'], {
        required_error: "Category is required"
    }),
    requiredReservations: z.number().min(1, { message: "Must require at least 1 reservation" }),
    pointToWin: z.number().min(1, { message: "Points must be at least 1" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().min(1, { message: "End date is required" })
}).refine((data) => {
    return new Date(data.startDate) < new Date(data.endDate);
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});

type TaskFormData = z.infer<typeof taskSchema>;
type TaskSubmitData = Omit<Task, '_id' | 'completedBy'>;

interface TaskModalProps {
    initialData?: Partial<Task>;
    onClose: () => void;
    onSubmit: (data: TaskSubmitData) => void;
}

export const TaskModal = ({ initialData, onClose, onSubmit }: TaskModalProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid }
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            category: 'Books',
            requiredReservations: 1,
            pointToWin: 100,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        },
        mode: 'onChange'
    });

    const watchedValues = watch();

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || '',
                category: initialData.category || 'Books',
                requiredReservations: initialData.requiredReservations || 1,
                pointToWin: initialData.pointToWin || 100,
                startDate: initialData.startDate
                    ? new Date(initialData.startDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                endDate: initialData.endDate
                    ? new Date(initialData.endDate).toISOString().split('T')[0]
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            });
        }
    }, [initialData, reset]);

    const categories: Category[] = ['Books', 'Museums', 'Library', 'Cinema'];

    const getCategoryIcon = (category: Category) => {
        switch (category) {
            case 'Books':
                return <Book className="h-4 w-4" />;
            case 'Museums':
                return <Building2 className="h-4 w-4" />;
            case 'Library':
                return <Library className="h-4 w-4" />;
            case 'Cinema':
                return <Film className="h-4 w-4" />;
        }
    };

    const onFormSubmit = (data: TaskFormData) => {
        const submitData: TaskSubmitData = {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
        };
        onSubmit(submitData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            {...register('title')}
                            placeholder="e.g., Complete Cinema Reservations"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setValue('category', category, { shouldValidate: true })}
                                    className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm transition-colors ${
                                        watchedValues.category === category
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    {getCategoryIcon(category)}
                                    {category}
                                </button>
                            ))}
                        </div>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Required Reservations */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Required Reservations *
                        </label>
                        <input
                            type="number"
                            min="1"
                            {...register('requiredReservations', {
                                valueAsNumber: true,
                                setValueAs: (value) => value === '' ? 0 : Number(value)
                            })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.requiredReservations ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errors.requiredReservations && (
                            <p className="mt-1 text-sm text-red-600">{errors.requiredReservations.message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Number of reservations users need to make in the {watchedValues.category} category
                        </p>
                    </div>

                    {/* Points to Win */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Reward *
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="10"
                            {...register('pointToWin', {
                                valueAsNumber: true,
                                setValueAs: (value) => value === '' ? 0 : Number(value)
                            })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.pointToWin ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errors.pointToWin && (
                            <p className="mt-1 text-sm text-red-600">{errors.pointToWin.message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Points users will earn upon completing this task
                        </p>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                {...register('startDate')}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date *
                            </label>
                            <input
                                type="date"
                                {...register('endDate')}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Task Preview:</h4>
                        <div className="text-sm text-gray-600">
                            <p>
                                <strong>Task:</strong> {watchedValues.title || 'Untitled Task'}
                            </p>
                            <p>
                                <strong>Requirement:</strong> Make {watchedValues.requiredReservations} reservation(s) in {watchedValues.category} category
                            </p>
                            <p>
                                <strong>Reward:</strong> {watchedValues.pointToWin} points
                            </p>
                            <p>
                                <strong>Active:</strong> {watchedValues.startDate} to {watchedValues.endDate}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={!isValid}
                        >
                            {initialData ? 'Update Task' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Export schema and type for reuse
export { taskSchema };
export type { TaskFormData };