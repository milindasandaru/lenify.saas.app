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
  const { name, subject, topic, duration, bookmarked } = await getComapnion(id);
  const user = await currentUser();

  if(!user) redirect ('/sign-in');
  if(!name) redirect('/companions');

  return (
    <main>
      <article className=' flex rounded-border justify-between p-6 max-md:flex-col'>
        <div className="flex items-center gap-2">
          <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden">
            <img src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
          </div>

          <div className="flex felx-col gap-2">
            <div className="flex items-center gap-2">
              <p className='font-bold text-2xl'>
                {name}
              </p>
              <div className="subject-badge max-sm:hidden">
                {subject}
              </div>
            </div>
            <p className='text-lg text-gray-700'>{topic}</p>
          </div>
        </div>
        <div className=" items-start text-2xl max-md:hidden">{duration} min</div>
      </article>
    </main>
  )
}

export default Companionsession
