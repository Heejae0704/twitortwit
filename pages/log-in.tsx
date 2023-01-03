import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { cls } from '../lib/utils';
import { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
}

export default () => {
  const router = useRouter();
  const [loginResponseError, setLoginResponseError] = useState(false);
  const {
    register: loginRegister,
    formState: { errors: loginErrors },
    handleSubmit: handleLoginSubmit,
  } = useForm<LoginForm>();
  const onValid = async (data: LoginForm) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.status === 404) {
      setLoginResponseError(true);
    }

    if (res.status === 200) {
      router.push('/');
    }
  };
  return (
    <div className="w-full min-h-screen bg-slate-400 flex justify-center items-center">
      <div className="bg-white flex flex-col justify-center items-center rounded-2xl p-5 px-32">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10 h-10 mb-8"
        >
          <path d="M16.881 4.346A23.112 23.112 0 018.25 6H7.5a5.25 5.25 0 00-.88 10.427 21.593 21.593 0 001.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.592.772-2.468a17.116 17.116 0 01-.628-1.607c1.918.258 3.76.75 5.5 1.446A21.727 21.727 0 0018 11.25c0-2.413-.393-4.735-1.119-6.904zM18.26 3.74a23.22 23.22 0 011.24 7.51 23.22 23.22 0 01-1.24 7.51c-.055.161-.111.322-.17.482a.75.75 0 101.409.516 24.555 24.555 0 001.415-6.43 2.992 2.992 0 00.836-2.078c0-.806-.319-1.54-.836-2.078a24.65 24.65 0 00-1.415-6.43.75.75 0 10-1.409.516c.059.16.116.321.17.483z" />
        </svg>
        <div className="text-2xl font-extrabold mb-8">Log in to TwitOrTwit</div>
        <form
          onSubmit={handleLoginSubmit(onValid)}
          className="flex flex-col mb-6"
        >
          <input
            {...loginRegister('email', {
              required: 'Enter your email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'invalid email address',
              },
              onChange: () => {
                if (loginResponseError) {
                  setLoginResponseError(false);
                }
              },
            })}
            id="email"
            type="text"
            placeholder="Email"
            className="py-3 px-2 border-gray-500 placeholder:text-gray-500 rounded-md mb-3 min-w-[300px]"
          />
          <div
            className={cls(
              loginErrors?.email ? '' : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>{loginErrors?.email?.message}</span>
          </div>
          <input
            {...loginRegister('password', {
              required: 'Enter your password',
              onChange: () => {
                if (loginResponseError) {
                  setLoginResponseError(false);
                }
              },
            })}
            id="password"
            type="password"
            placeholder="Password"
            className="py-3 px-2 border-gray-500 placeholder:text-gray-500 rounded-md mb-3"
          />
          <div
            className={cls(
              loginErrors?.password ? '' : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>{loginErrors?.password?.message}</span>
          </div>
          <div
            className={cls(
              loginResponseError ? '' : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>Wrong email or password</span>
          </div>
          <input
            type="submit"
            value="Log In"
            className="bg-blue-500 text-white hover:bg-blue-700 rounded-l-full rounded-r-full py-2 mt-2"
          />
        </form>
        <div>
          Don't have an account?{' '}
          <Link href="/create-account">
            <span className="text-blue-500 hover:text-blue-700 cursor-pointer">
              Create account
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
