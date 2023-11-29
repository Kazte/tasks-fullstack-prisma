import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default function Home() {
  const session = getServerSession();

  if (session !== null) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  return <h1>Home page</h1>;
}
