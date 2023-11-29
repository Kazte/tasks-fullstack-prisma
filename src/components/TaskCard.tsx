'use client';

import { Task } from '@prisma/client';
import { useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditTaskModal from './ui/EditTaskModal';
import { useRouter } from 'next/navigation';

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [important, setImportant] = useState<boolean>(task.important);
  const router = useRouter();

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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/task?id=${task.id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          ...currentTask,
          completed: !currentTask.completed
        })
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <li
        className={`card h-[252px] w-[344px] shadow-xl bg-neutral text-neutral-content border-2 border-transparent ${
          important === true ? 'border-accent' : ''
        }`}
      >
        <div className='card-body'>
          <div
            className='tooltip tooltip-primary tooltip-bottom'
            data-tip={currentTask.title}
          >
            <h2 className='card-title text-left text-2xl line-clamp-1'>
              {currentTask.title}
            </h2>
          </div>
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
              <button onClick={handleDelete} className='btn btn-sm'>
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
