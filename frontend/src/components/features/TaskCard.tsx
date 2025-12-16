import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_TASK } from '../../graphql/mutations';
import type { Task, UpdateTaskData } from '../../types';
import { format } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const [updateTask] = useMutation<UpdateTaskData>(UPDATE_TASK, {
    onCompleted: () => {
      onUpdate();
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask({
        variables: {
          id: task.id,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 border border-gray-200"
      >
        {/* Title */}
        <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          {/* Assignee */}
          {task.assigneeEmail && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-xs">
                {task.assigneeEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700">{task.assigneeEmail.split('@')[0]}</span>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <span className="text-gray-500">
              {format(new Date(task.dueDate), 'MMM dd')}
            </span>
          )}
        </div>

        {/* Status Change Dropdown */}
        <div className="pt-3 border-t border-gray-100">
          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              handleStatusChange(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      {/* Task Detail Modal */}
      {showDetail && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowDetail(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}