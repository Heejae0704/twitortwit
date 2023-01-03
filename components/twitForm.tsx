import { FieldErrors, useForm } from 'react-hook-form';
import { cls } from '../lib/utils';

interface TwitForm {
  content: string;
  imageUrl: string;
}

interface TwitFormProps {
  [key: string]: any;
}

export default ({ user, mutate }: TwitFormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TwitForm>();

  const onValid = async (data: TwitForm) => {
    await fetch('/api/twits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    mutate();
  };

  const onInvalid = async (errors: FieldErrors) => {
    console.log(errors);
  };
  return (
    <div className="flex space-x-4 py-3 pt-16">
      <div
        className={cls(
          user ? `bg-${user.avatarColor}-400` : '',
          'flex-none w-12 h-12 rounded-full'
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <div className="flex flex-grow">
        <form onSubmit={handleSubmit(onValid, onInvalid)} className="w-full">
          <textarea
            {...register('content', {
              required: 'Please write something',
            })}
            id="content"
            placeholder="What's happening?"
            className="block p-2.5 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors?.content ? (
            <div className="text-red-500">{errors.content.message}</div>
          ) : (
            ''
          )}
          <div className="flex justify-between items-center mt-3 space-x-20">
            <div className="flex items-center space-x-1 flex-grow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-blue-500 flex-none"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                {...register('imageUrl')}
                id="imageUrl"
                type="text"
                placeholder="Image link (optional) - https://..."
                className="border border-gray-300 rounded-md focus:ring-blue-500 focus-border-blue-500 w-full"
              />
            </div>
            <input
              type="submit"
              value="Twit"
              className="py-2 px-5 bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold rounded-l-full rounded-r-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
