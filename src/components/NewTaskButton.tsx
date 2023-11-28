'use client';
import { MdAdd } from 'react-icons/md';
import NewTaskModal from './ui/NewTaskModal';

export default function NewTaskButton() {
  const handleAddTask = () => {
    document.getElementById('new_task_modal').showModal();
  };

  return (
    <>
      <button
        onClick={handleAddTask}
        className='btn btn-square btn-success fixed bottom-3 right-14 z-10 shadow-lg'
      >
        <MdAdd size='24px' />
      </button>

      <NewTaskModal />
    </>
  );
}
