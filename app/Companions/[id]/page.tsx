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
        <div className="flex items-center gap-2">
          <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden">
            <img src={`/icons/${companion?.subject}.svg`} alt={companion?.subject} width={35} height={35} />
          </div>

          <div className="flex felx-col gap-2">
            <div className="flex items-center gap-2">
              <p className='font-bold text-2xl'>
                {companion?.name}
              </p>
              <div className="subject-badge max-sm:hidden">
                {companion?.subject}
              </div>
            </div>
            <p className='text-lg text-gray-700'>{companion?.topic}</p>
          </div>
        </div>
      </article>
    </main>
  )
}

export default Companionsession
