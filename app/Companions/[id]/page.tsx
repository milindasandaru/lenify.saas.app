import { getComapnion } from '@/lib/actions/companion.action';
import { currentUser } from '@clerk/nextjs/server';
import { get } from 'http';
import { redirect } from 'next/dist/client/components/navigation';
import React from 'react'


type Companion = {
  id: string;
  name: string;
  subject: string;
  topic: string;
  duration: number;
  bookmarked: boolean;
};

interface CompanionSessionPageProps {
  params: { id: string }
}

// params /url/{id} -> id
// searchParams /url?key=value&key1=value1

const Companionsession = async ({ params } : CompanionSessionPageProps) => {
  const { id } = params;
  let companion: Companion | null = null;
  try {
    companion = await getComapnion(id);
  } catch (e) {
    redirect('/companions');
  }
  const user = await currentUser();

  if(!user) redirect ('/sign-in');
  if(!companion) redirect('/companions');

  return (
    <main>
      <article className=' flex rounded-border justify-between p-6 max-md:flex-col'>
        <div className="flex flex-col gap-4 max-w-lg">
          <h1 className='text-4xl font-bold'>{companion.name}</h1>
          <p className='text-lg text-gray-700'>{companion.topic}</p>
        </div>
        <div className="flex flex-col gap-4 max-md:w-full">
          <button className='btn-primary w-fit max-md:w-full justify-center'>
            Launch Lesson
          </button>
        </div>
      </article>
    </main>
  )
}

export default Companionsession
