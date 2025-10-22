import { getComapnion } from '@/lib/actions/companion.action';
import { currentUser } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import CompanionComponent from '@/components/CompanionComponent';


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

const Companionsession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = params;
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  let companion: (Companion & { voice?: string; style?: string }) | null = null;
  try {
    companion = await getComapnion(id);
  } catch {
    // If companion cannot be fetched (e.g., empty DB or network), show 404 page
    return notFound();
  }

  if (!companion?.name) return notFound();

  const { name, subject, topic, duration } = companion;

  return (
    <main>
      <article className=' flex rounded-border justify-between p-6 max-md:flex-col'>
        <div className="flex items-center gap-2">
          <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden">
            <img src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
          </div>

          <div className="flex flex-col gap-2">
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
      <CompanionComponent
        companionId={id}
        name={name}
        subject={subject}
        topic={topic}
        userName={user.firstName || 'You'}
        userImage={user.imageUrl || '/images/default-avatar.png'}
        voice={companion.voice || 'female'}
        style={companion.style || 'casual'}
      />
    </main>
  )
}

export default Companionsession
