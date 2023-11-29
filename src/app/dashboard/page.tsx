'use client';
import { Task } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import Loading from '~/components/Loading';
import NewTaskButton from '~/components/NewTaskButton';
import TaskCard from '~/components/TaskCard';
import EditTaskModal from '~/components/ui/EditTaskModal';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTaskEdit, setCurrentTaskEdit] = useState<Task | null>(null);
  const router = useRouter();

  const getTasks = async (username: string): Promise<Task[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/task?username=${username}`, {
          method: 'GET',
          cache: 'no-store'
        });

        const responseData = await response.json();

        const tasks = responseData.data;
        tasks.sort((a: Task, b: Task) => {
          if (a.create_at < b.create_at) {
            return 1;
          } else {
            return -1;
          }
        });

        resolve(tasks);
      } catch (error) {
        reject(error.message);
      } finally {
        setLoading(false);
      }

      return null;
    });
  };

  const handleCloseModal = () => {
    document.getElementById('edit_task_modal').close();
    setCurrentTaskEdit(null);
  };

  const handleOnDelete = async (task: Task) => {
    try {
      fetch(`/api/task?id=${task.id}`, {
        method: 'DELETE'
      }).then((res) => {
        if (res.ok) {
          const newTasks = tasks.filter((x) => x.id !== task.id);

          setTasks(newTasks);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const session = getSession().then((session) => {
      const username = session?.user?.name;

      getTasks(username!).then((ts) => {
        setTasks(ts);
      });
    });
  }, []);

  return (
    <Loading loaded={!loading} className='w-full'>
      <>
        <div className='flex flex-col justify-start items-center text-4xl mx-2'>
          <h1 className='mb-4'>My Tasks</h1>
          <div>
            <NewTaskButton />
          </div>
          <ul
            className='grid place-items-center flex-wrap gap-3 w-full'
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr)'
            }}
          >
            {tasks.map((task: Task) => {
              return (
                <TaskCard onDelete={handleOnDelete} key={task.id} task={task} />
              );
            })}
          </ul>
        </div>
      </>
    </Loading>
  );
}
