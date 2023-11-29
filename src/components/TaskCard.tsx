'use client';

import { Task } from '@prisma/client';
import { useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditTaskModal from './ui/EditTaskModal';

interface Props {
  task: Task;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [important, setImportant] = useState<boolean>(task.important);
  const [editing, setEditing] = useState(false);

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/task', {
        method: 'PATCH',
        body: JSON.stringify({
          ...currentTask,
          completed: !currentTask.completed
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setCurrentTask(responseData);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    console.log('change');
  }, [important]);

  return (
    <>
      <li
        className={`card h-[252px] w-[344px] shadow-xl ${
          important === true
            ? 'bg-accent text-accent-content'
            : 'bg-neutral text-neutral-content'
        }`}
      >
        <div className='card-body'>
          <h2 className='card-title text-2xl line-clamp-1'>
            {currentTask.title}
          </h2>
          <p className='text-sm h-[80px]'>{currentTask.body}</p>
          <small className='text-sm font-semibold'>
            {new Date(currentTask.create_at).toLocaleDateString()}
          </small>
          <div className='card-actions justify-between items-center'>
            {currentTask.completed ? (
              <button
                onClick={handleComplete}
                className='btn btn-sm btn-success'
              >
                Completed
              </button>
            ) : (
              <button onClick={handleComplete} className='btn btn-sm btn-error'>
                Incompleted
              </button>
            )}
            <div className='flex flex-row gap-2'>
              <button
                onClick={() => {
                  document
                    .getElementById(`edit_task_${task.id}_modal`)
                    .showModal();
                }}
                className='btn btn-sm'
              >
                <MdEdit />
              </button>
              <button
                onClick={() => {
                  onDelete(currentTask);
                }}
                className='btn btn-sm'
              >
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
      </li>
      <EditTaskModal
        task={task}
        onClose={(t) => {
          document.getElementById(`edit_task_${task.id}_modal`).close();
          setCurrentTask(t);
          setImportant(t.important);
        }}
      />
    </>
  );
}
