'use client';

import { Task } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { MdAdd, MdClose, MdSave } from 'react-icons/md';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';

interface Props {
  task: Task;
  onClose: (task: Task) => void;
}

export default function EditTaskModal({ task, onClose }: Props) {
  const [textAreaCharacters, setTextAreaCharacters] = useState(0);

  const [modalState, setModalState] = useState<any>(task);

  const handleTextAreaOnChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.currentTarget.value;

    const characters = value.length;

    setTextAreaCharacters(characters);
    setModalState({ ...modalState, body: value });
  };

  const handleTitleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalState({ ...modalState, title: e.currentTarget.value });
  };

  const handleImportantOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalState({ ...modalState, important: !modalState.important });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const session = await getSession();
      const username = session?.user?.name;

      const response = await fetch('/api/task', {
        method: 'PATCH',
        body: JSON.stringify({ ...modalState, id: task.id })
      });

      const responseData = await response.json();

      onClose(responseData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    setModalState({
      body: task?.body,
      important: task?.important,
      title: task?.title
    });
  }, [task]);

  return (
    <dialog id={`edit_task_${task.id}_modal`} className='modal shadow-md'>
      <div className='modal-box flex flex-col'>
        <h3 className='font-bold text-4xl text-center'>Update Task!</h3>

        <div className='modal-action flex-col'>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%'
            }}
          >
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Title</span>
              </label>
              <input
                type='text'
                placeholder='e.g. Watch a video.'
                className='input input-bordered w-full'
                onChange={handleTitleOnChange}
                value={modalState?.title}
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Body</span>
              </label>
              <textarea
                className='textarea textarea-bordered resize-none h-[110px]'
                placeholder='Bio'
                maxLength={125}
                rows={3}
                onChange={handleTextAreaOnChange}
                value={modalState?.body}
              ></textarea>
              <label className='label'>
                <span className='label-text-alt'></span>
                <span className='label-text-alt'>{textAreaCharacters}/125</span>
              </label>
            </div>

            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text'>Important</span>
                <input
                  type='checkbox'
                  className='toggle'
                  checked={modalState?.important}
                  onChange={handleImportantOnChange}
                />
              </label>
            </div>

            <div className='flex flex-row justify-end items-center gap-3 mt-3 w-full'>
              <button className='btn btn-success'>
                <MdSave size='24px' />
                Save Task
              </button>
            </div>
          </form>
          <button
            onClick={() => {
              onClose(task);
            }}
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
          >
            <MdClose size='24px' />
          </button>
        </div>
      </div>
    </dialog>
  );
}
