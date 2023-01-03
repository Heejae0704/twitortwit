import { Twit, User } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import { cls } from '../../lib/utils';

interface TwitWithUser extends Twit {
  user: User;
  _count: {
    likes: number;
  };
}

interface TwitDetailResponse {
  ok: boolean;
  twit: TwitWithUser;
  isLiked: boolean;
}

export default () => {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };

  const { data, mutate } = useSWR<TwitDetailResponse>(
    router.query.id ? `/api/twits/${router.query.id}` : null
  );

  const onLikeClick = () => {
    if (!data) return;
    mutate(
      (prev) =>
        prev && {
          ...prev,
          twit: {
            ...prev.twit,
            _count: {
              likes: prev.isLiked
                ? prev.twit._count.likes - 1
                : prev.twit._count.likes + 1,
            },
          },
          isLiked: !prev.isLiked,
        },
      false
    );
    fetch(`/api/twits/${router.query.id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-400">
      <div className="max-w-4xl mx-auto px-3">
        <div className="w-full bg-white min-h-screen p-5 pr-8">
          <div className="flex items-center space-x-6 mb-3">
            <button
              onClick={onClick}
              className="p-2 rounded-full aspect-square hover:bg-slate-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-xl font-bold">Twit</span>
          </div>
          <div className="flex space-x-4 py-3 first:pt-12 last:pb-10">
            <div
              className={cls(
                data ? `bg-${data?.twit.user.avatarColor}-400` : '',
                'flex-none w-12 h-12 rounded-full bg-blue-400'
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
            <div className="flex flex-col flex-grow">
              <div className="flex flex-col">
                <span className="font-bold -mb-1">
                  {data?.twit.user.fullName}
                </span>
                <span className="text-gray-500 mb-2">
                  {`@${data?.twit.user.handle}`}
                </span>
              </div>
              <div className="text-2xl">
                <p className="whitespace-pre-wrap">{data?.twit.content}</p>
                {data?.twit.imageUrl ? (
                  <div className="flex">
                    <div className="rounded-2xl bg-slate-200 overflow-hidden mt-3">
                      <img
                        src={data?.twit.imageUrl}
                        alt="image"
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="mt-5 text-gray-500">
                {new Date(String(data?.twit.createdAt)).toLocaleString('ko-KR')}
              </div>
              <div className="flex space-x-2 mt-5 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-red-500"
                >
                  <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                </svg>
                <div>
                  <span className="font-bold">{data?.twit._count.likes}</span>{' '}
                  likes
                </div>

                <button
                  onClick={onLikeClick}
                  className="border-2 border-blue-500 py-1 px-2 rounded-md text-sm"
                >
                  {data?.isLiked ? 'Unlike' : 'Like'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
