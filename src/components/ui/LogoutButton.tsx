'use client';

import { signOut } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

export default function LogoutButton({ children }: Props) {
  return <a onClick={() => signOut()}>{children}</a>;
}
