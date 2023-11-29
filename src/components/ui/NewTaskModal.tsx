'use client';

import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';

export default function NewTaskModal() {
  const [textAreaCharacters, setTextAreaCharacters] = useState(0);

  const [modalState, setModalState] = useState({
    title: '',
    body: '',
    important: false
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
        method: 'POST',
        body: JSON.stringify({ ...modalState, username })
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
        <h3 className='font-bold text-4xl text-center'>New Task!</h3>

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
                className='textarea textarea-bordered resize-none h-[110px]'
                placeholder='Bio'
                maxLength={125}
                rows={3}
                onChange={handleTextAreaOnChange}
                value={modalState.body}
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
            </div>
          </form>
          <button
            onClick={() => {
              document.getElementById('new_task_modal')?.close();
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
