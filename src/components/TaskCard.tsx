'use client';

import { Task } from '@prisma/client';
import { useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditTaskModal from './ui/EditTaskModal';

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const [currentTask, setCurrentTask] = useState<Task>(task);

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

  return (
    <div
      className={`card w-full shadow-xl ${
        task.important === true
          ? 'bg-accent text-accent-content'
          : 'bg-neutral text-neutral-content'
      }`}
    >
      <div className='card-body'>
        <h2 className='card-title text-3xl '>{currentTask.title}</h2>
        <p className='text-lg'>{currentTask.body}</p>
        <small className='text-sm font-semibold'>
          {new Date(currentTask.create_at).toLocaleDateString()}
        </small>
        <div className='card-actions justify-between items-center'>
          {currentTask.completed ? (
            <button onClick={handleComplete} className='btn btn-sm btn-success'>
              Completed
            </button>
          ) : (
            <button onClick={handleComplete} className='btn btn-sm btn-error'>
              Incompleted
            </button>
          )}
          <div className='flex flex-row gap-2'>
            <button className='btn btn-sm'>
              <MdEdit />
            </button>
            <button className='btn btn-sm'>
              <MdDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
