import type { Task } from '../../types';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

export default function TaskBoard({ tasks, onTaskUpdate }: TaskBoardProps) {
  const columns = [
    { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'DONE', title: 'Done', color: 'bg-green-100' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);

        return (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className={`${column.color} rounded-t-lg px-4 py-3 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-white px-2.5 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="flex-1 bg-gray-50 rounded-b-lg p-4 space-y-3 min-h-[400px] border-x border-b border-gray-200">
              {columnTasks.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-8">
                  No tasks
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={onTaskUpdate}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}