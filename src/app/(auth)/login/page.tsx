'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsFetching(true);
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (!res.ok) {
        setError(res.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsFetching(false);
    }
  });

  return (
    <div className='flex flex-col justify-center items-center h-full gap-2'>
      <h1 className='text-4xl'>Login</h1>

      <form
        className='w-2/5 mx-auto flex flex-col justify-center items-center gap-1'
        onSubmit={onSubmit}
      >
        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Email</span>
          </label>
          <input
            disabled={isFetching}
            type='email'
            placeholder='user@email.com'
            className='input input-bordered w-full max-w-xs'
            {...register('email', {
              required: { value: true, message: 'This field is required!' }
            })}
          />
          {errors.email && (
            <label className='label'>
              <span className='label-text-alt text-red-500'>
                {errors.email.message?.toString()}
              </span>
            </label>
          )}
        </div>

        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Password</span>
          </label>
          <input
            disabled={isFetching}
            type='password'
            placeholder='**********'
            className='input input-bordered w-full max-w-xs'
            {...register('password', {
              required: { value: true, message: 'This field is required!' }
            })}
          />
          {errors.password && (
            <label className='label'>
              <span className='label-text-alt text-red-500'>
                {errors.password.message?.toString()}
              </span>
            </label>
          )}
        </div>

        {error !== '' && <span className='text-sm text-red-500'>{error}</span>}

        <button disabled={isFetching} className='btn btn-wide mt-4'>
          Login
        </button>
      </form>
    </div>
  );
}
