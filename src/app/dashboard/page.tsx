'use client';
import { Task } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import NewTaskButton from '~/components/NewTaskButton';
import TaskCard from '~/components/TaskCard';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async (username: string): Promise<Task[]> => {
    return new Promise(async (resolve, reject) => {
      try {
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
      }

      return null;
    });
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
    <div className='flex flex-col justify-start items-center text-4xl'>
      <h1>My Tasks</h1>
      <div>
        <NewTaskButton />
      </div>
      <ul
        className='grid gap-3 w-3/4'
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr)'
        }}
      >
        {tasks.map((task: Task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </ul>
    </div>
  );
}
