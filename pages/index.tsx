import React from 'react';
import Nav from '../components/nav';
import Link from 'next/link';
import TwitForm from '../components/twitForm';
import useUser from '../lib/useUser';
import useSWR from 'swr';
import { Twit, User } from '@prisma/client';
import { cls } from '../lib/utils';

interface TwitWithUserAndLikes extends Twit {
  user: User;
  _count: {
    likes: number;
  };
}

interface TwitsResponse {
  ok: boolean;
  twits: TwitWithUserAndLikes[];
}

export default () => {
  const { user } = useUser();
  const { data, mutate } = useSWR<TwitsResponse>('/api/twits');
  return (
    <div className="w-full min-h-screen bg-slate-400">
      <Nav user={user} />
      <div className="max-w-4xl mx-auto px-3">
        <div className="w-full bg-white min-h-screen p-5 pr-8 pb-20">
          <TwitForm user={user} mutate={mutate} />
          <hr className="border-slate-400 border-1 -mx-10 mt-2 mb-10"></hr>
          {data?.twits?.map((twit) => (
            <div key={twit.id}>
              <Link href={`/twit/${twit.id}`}>
                <div className="flex space-x-4 py-5 cursor-pointer">
                  <div
                    className={cls(
                      twit.user.avatarColor
                        ? `bg-${twit.user.avatarColor}-400`
                        : '',
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
                  <div className="flex flex-col flex-grow">
                    <div className="space-x-1">
                      <span className="font-bold -mb-1">
                        {twit.user.fullName}
                      </span>
                      <span className="text-gray-500">{`@${twit.user.handle}`}</span>
                      <span className=" text-gray-500">{`· ${new Date(
                        twit.createdAt
                      ).toLocaleString('ko-KR')}`}</span>
                    </div>
                    <div className="mt-1">
                      <p className="whitespace-pre-wrap">{twit.content}</p>
                      {twit.imageUrl ? (
                        <div className="flex">
                          <div className="max-w-[500px] rounded-2xl bg-slate-200 overflow-hidden mt-3">
                            <img
                              src={twit.imageUrl}
                              alt="image"
                              className="w-full"
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="mt-2 flex space-x-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                      </svg>

                      <span>{twit._count.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <hr className="border-slate-400 border-1 -mx-10 my-3"></hr>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="bg-orange-400"></div>
        <div className="bg-amber-400"></div>
        <div className="bg-yellow-400"></div>
        <div className="bg-lime-400"></div>
        <div className="bg-green-400"></div>
        <div className="bg-emerald-400"></div>
        <div className="bg-teal-400"></div>
        <div className="bg-cyan-400"></div>
        <div className="bg-sky-400"></div>
        <div className="bg-blue-400"></div>
        <div className="bg-indigo-400"></div>
        <div className="bg-violet-400"></div>
        <div className="bg-fuchsia-400"></div>
        <div className="bg-pink-400"></div>
      </div>
    </div>
  );
};
