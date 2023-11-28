'use client';

import { Task } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';

interface Props {
  task: Task;
}

export default function EditTaskModal({ task }: Props) {
  const [textAreaCharacters, setTextAreaCharacters] = useState(0);

  const [modalState, setModalState] = useState({
    title: task.title,
    body: task.body,
    important: task.important
  });

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
        body: JSON.stringify({ ...modalState })
      });

      const responseData = await response.json();

      document.getElementById('new_task_modal')?.close();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <dialog id='new_task_modal' className='modal'>
      <div className='modal-box flex flex-col'>
        <h3 className='font-bold text-4xl text-center'>Update Task!</h3>

        <div className='modal-action'>
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
                value={modalState.title}
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Body</span>
              </label>
              <textarea
                className='textarea textarea-bordered resize-none'
                placeholder='Bio'
                maxLength={255}
                rows={5}
                onChange={handleTextAreaOnChange}
                value={modalState.body}
              ></textarea>
              <label className='label'>
                <span className='label-text-alt'></span>
                <span className='label-text-alt'>{textAreaCharacters}/255</span>
              </label>
            </div>

            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text'>Important</span>
                <input
                  type='checkbox'
                  className='toggle'
                  checked={modalState.important}
                  onChange={handleImportantOnChange}
                />
              </label>
            </div>

            <div className='flex flex-row justify-end items-center gap-3 mt-3 w-full'>
              <button className='btn btn-success'>
                <MdAdd size='24px' />
                Create Task
              </button>
              <button
                className='btn btn-error'
                onClick={() => {
                  document.getElementById('new_task_modal')?.close();
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}