import { Task } from '@prisma/client';
import { getServerSession } from 'next-auth';
import NewTaskButton from '~/components/NewTaskButton';
import TaskCard from '~/components/TaskCard';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getURL from '~/libs/getUrl';

const getTasks = async (username: string): Promise<Task[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${getURL()}/api/task?username=${username}`,
        {
          method: 'GET',
          cache: 'no-store'
        }
      );

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
    }

    return null;
  });
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const tasks = await getTasks(session?.user?.name!);

  return (
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
          return <TaskCard key={task.id} task={task} />;
        })}
      </ul>
    </div>
  );
}
