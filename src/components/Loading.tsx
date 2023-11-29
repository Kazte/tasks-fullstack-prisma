import { Spinner } from '@nextui-org/react';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  loaded: boolean;
  message?: string;
  className?: string;
}

export default function Loading({
  children,
  loaded,
  message,
  className = ''
}: Props) {
  if (loaded) return <>{children}</>;

  return (
    <div
      className={`flex flex-col justify-center items-center gap-5 w-full h-full ${className}`}
    >
      <span className='loading loading-dots loading-lg'></span>
    </div>
  );
}
