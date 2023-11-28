import { getServerSession } from 'next-auth';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { Case, Default, Switch } from '../common/switch';

export default async function NavBar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className='navbar bg-base-300'>
      <div className='flex-1'>
        <Link href='/' className='btn btn-ghost text-xl'>
          tasks.
        </Link>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1 gap-2'>
          <Switch>
            <Case condition={session !== null}>
              <li>
                <Link href='/dashboard'>Dashboard</Link>
              </li>
              <li className='text-error'>
                <LogoutButton>Log Out</LogoutButton>
              </li>
            </Case>
            <Default>
              <li>
                <Link href='/login'>Login</Link>
              </li>
              <li>
                <Link href='/register'>Register</Link>
              </li>
            </Default>
          </Switch>
        </ul>
      </div>
    </nav>
  );
}
