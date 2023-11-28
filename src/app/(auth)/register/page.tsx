'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [error, setError] = useState();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert('Passwords do not match');
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const jsonData = await response.json();

    if (response.ok) {
      router.push('/login');
    } else {
      setError(jsonData.message);
    }
  });

  return (
    <div className='flex flex-col justify-center items-center h-full gap-2'>
      <h1 className='text-4xl'>Register</h1>

      <form
        className='w-2/5 mx-auto flex flex-col justify-center items-center gap-1'
        onSubmit={onSubmit}
      >
        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Username</span>
          </label>
          <input
            type='text'
            placeholder='Your username'
            className='input input-bordered w-full max-w-xs'
            {...register('username', {
              required: { value: true, message: 'This field is required!' }
            })}
          />
          {errors.username && (
            <label className='label'>
              <span className='label-text-alt text-red-500'>
                {errors.username.message?.toString()}
              </span>
            </label>
          )}
        </div>

        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Email</span>
          </label>
          <input
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

        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Confirm Password</span>
          </label>
          <input
            type='password'
            placeholder='**********'
            className='input input-bordered w-full max-w-xs'
            {...register('confirmPassword', {
              required: { value: true, message: 'This field is required!' }
            })}
          />
          {errors.confirmPassword && (
            <label className='label'>
              <span className='label-text-alt text-red-500'>
                {errors.confirmPassword.message?.toString()}
              </span>
            </label>
          )}
        </div>

        {error !== '' && <span className='text-sm text-red-500'>{error}</span>}

        <button className='btn btn-wide mt-4'>Register</button>
      </form>
    </div>
  );
}
