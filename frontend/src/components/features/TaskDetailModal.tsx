import { useState, type FormEvent } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COMMENTS_BY_TASK } from '../../graphql/queries';
import { CREATE_COMMENT, UPDATE_TASK } from '../../graphql/mutations';
import type { Task, TaskComment, GetCommentsByTaskData, CreateCommentData, UpdateTaskData } from '../../types';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TaskDetailModal({
  task,
  onClose,
  onUpdate,
}: TaskDetailModalProps) {
  const [comment, setComment] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    assigneeEmail: task.assigneeEmail,
  });

  const { data, refetch } = useQuery<GetCommentsByTaskData>(GET_COMMENTS_BY_TASK, {
    variables: { taskId: task.id },
  });

  const [createComment, { loading: commentLoading }] = useMutation<CreateCommentData>(CREATE_COMMENT, {
    onCompleted: () => {
      setComment('');
      setAuthorEmail('');
      refetch();
    },
  });

  const [updateTask, { loading: updateLoading }] = useMutation<UpdateTaskData>(UPDATE_TASK, {
    onCompleted: () => {
      setIsEditing(false);
      onUpdate();
    },
  });

  const comments: TaskComment[] = data?.commentsByTask || [];

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !authorEmail.trim()) return;

    try {
      await createComment({
        variables: {
          taskId: task.id,
          content: comment,
          authorEmail,
        },
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTask({
        variables: {
          id: task.id,
          ...editData,
        },
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-start justify-between p-6 border-b border-gray-200 z-10">
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none flex-1"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Task Details */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-600">{task.description || 'No description'}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                {task.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.assigneeEmail}
                  onChange={(e) => setEditData({ ...editData, assigneeEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-600">{task.assigneeEmail || 'Unassigned'}</p>
              )}
            </div>
          </div>

          {task.dueDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <p className="text-gray-600">
                {format(new Date(task.dueDate), 'PPP p')}
              </p>
            </div>
          )}

          {/* Edit/Save Buttons */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={updateLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                  {updateLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      title: task.title,
                      description: task.description,
                      assigneeEmail: task.assigneeEmail,
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Edit Task
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="space-y-3">
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
              >
                {commentLoading ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No comments yet</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                        {c.authorEmail.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{c.authorEmail}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(c.createdAt), 'PPp')}
                    </span>
                  </div>
                  <p className="text-gray-700 ml-10">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}