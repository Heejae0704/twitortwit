import Link from 'next/link';
import { FieldErrors, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { cls } from '../lib/utils';
import { useEffect, useState } from 'react';

interface CreateAccountForm {
  email: string;
  fullName: string;
  handle: string;
  password: string;
  passwordCheck: string;
}

export default () => {
  const [existingFields, setExistingFields] = useState({
    email: '',
    handle: '',
  });
  const router = useRouter();
  const {
    register: createAccountRegister,
    formState: { errors: createAccountErrors },
    handleSubmit: handleCreateAccountSubmit,
    watch: watchCreateAccount,
  } = useForm<CreateAccountForm>();

  useEffect(() => {
    console.log(existingFields);
  });

  const onValid = async (data: CreateAccountForm) => {
    const createAccountRes = await (
      await fetch('/api/users/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    ).json();

    if (createAccountRes.ok === false) {
      setExistingFields((prev) => ({
        ...prev,
        email: createAccountRes.existingFields.email,
        handle: createAccountRes.existingFields.handle,
      }));
    }

    if (createAccountRes.ok) {
      router.push('/log-in');
    }
  };

  const onInvalid = async (errors: FieldErrors) => {
    console.log(errors);
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
        <div className="text-2xl font-extrabold mb-8">
          Sign up to TwitOrTwit
        </div>
        <form
          onSubmit={handleCreateAccountSubmit(onValid, onInvalid)}
          className="flex flex-col mb-6"
        >
          <input
            {...createAccountRegister('email', {
              required: 'Enter your email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'invalid email address',
              },
              onChange: () => {
                if (existingFields.email) {
                  setExistingFields((prev) => ({
                    ...prev,
                    email: '',
                  }));
                }
              },
            })}
            id="email"
            type="email"
            placeholder="Email"
            className="py-3 px-2 border-gray-500 placeholder:text-gray-500 rounded-md mb-3 min-w-[300px]"
          />
          <div
            className={cls(
              createAccountErrors?.email || existingFields.email
                ? ''
                : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>
              {createAccountErrors?.email?.message || 'Email already exists'}
            </span>
          </div>
          <input
            {...createAccountRegister('fullName', {
              required: 'Enter your full name',
            })}
            id="fullName"
            type="text"
            placeholder="Full Name"
            className="py-3 px-2 border-gray-500 placeholder:text-gray-500 rounded-md mb-3 min-w-[300px]"
          />
          <div
            className={cls(
              createAccountErrors?.fullName ? '' : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>{createAccountErrors?.fullName?.message}</span>
          </div>
          <input
            {...createAccountRegister('handle', {
              required: 'Enter your twit handle',
              onChange: () => {
                if (existingFields.handle) {
                  setExistingFields((prev) => ({
                    ...prev,
                    handle: '',
                  }));
                }
              },
            })}
            id="handle"
            type="text"
            placeholder="Twit Handle Name"
            className="py-3 px-2 border-gray-500 placeholder:text-gray-500 rounded-md mb-3 min-w-[300px]"
          />
          <div
            className={cls(
              createAccountErrors?.handle || existingFields.handle
                ? ''
                : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>
              {createAccountErrors?.handle?.message || 'Handle already exists'}
            </span>
          </div>
          <input
            {...createAccountRegister('password', {
              required: 'Enter your password',
              minLength: {
                value: 8,
                message: 'Password should be at least 8 characters',
              },
            })}
            id="password"
            type="password"
            placeholder="Password"
            className="py-3 px-2 border-gray-500 placeholder:text-gray-500 rounded-md mb-3"
          />
          <div
            className={cls(
              createAccountErrors?.password ? '' : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>{createAccountErrors?.password?.message}</span>
          </div>
          <input
            {...createAccountRegister('passwordCheck', {
              validate: {
                passwordCheck: (value) =>
                  watchCreateAccount('password') === value ||
                  'Password is not matching',
              },
            })}
            id="passwordCheck"
            type="password"
            placeholder="Verify your password"
            className="py-3 px-2 border-gray-500 placeholder:text-gray-500 rounded-md mb-3"
          />
          <div
            className={cls(
              createAccountErrors?.passwordCheck ? '' : 'hidden',
              'text-red-500 -mt-3 mb-2'
            )}
          >
            <span>{createAccountErrors?.passwordCheck?.message}</span>
          </div>
          <input
            type="submit"
            value="Create account"
            className="bg-blue-500 text-white hover:bg-blue-700 rounded-l-full rounded-r-full py-2 mt-2"
          />
        </form>
        <div>
          Already have an account?{' '}
          <Link href="/log-in">
            <span className="text-blue-500 hover:text-blue-700 cursor-pointer">
              Log in
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
