import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserCompanions, getUserSessions } from '@/lib/actions/companion.action';
import CompanionList from '@/components/companionList';

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  const sessionHistory = await getUserSessions(user.id);
  const companions = await getUserCompanions(user.id);

  return (
    <main className='lg:w-3/4'>
      <section className='flex justify-between gap-4 max-sm:flex-col items-center'>
        <div className="flex gap-4 items-center">
          <img src={user?.imageUrl} alt={user?.firstName || 'User avatar'} width={110} height={110} />

          <div className="flex flex-col gap-2">
            <h1 className='font-bold text-2xl'>
              {user?.firstName} {user?.lastName}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>

          <div className=" border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <img src="/icons/check.svg" alt="check" width={21} height={21} />
              <p className='text-xl font-semibold'>
                {sessionHistory.length}
              </p>
            </div>
            <div className="">Lesson completed</div>
          </div>
          <div className=" border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <img src="/icons/cap.svg" alt="cap" width={21} height={21} />
              <p className='text-xl font-semibold'>
                {companions.length}
              </p>
            </div>
            <div className="">Companions created</div>
          </div>
        </div>
      </section>
      <Accordion type='multiple'>
        <AccordionItem value='item-recent'>
          <AccordionTrigger className='text-xl font-semibold'>Recent Sessions</AccordionTrigger>
          <AccordionContent>
            <CompanionList title="Recent Sessions" companions={sessionHistory} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='companions'>
          <AccordionTrigger className='text-xl font-semibold'>My Companions {`(${companions.length})`}</AccordionTrigger>
          <AccordionContent>
            <CompanionList title="My Companions" companions={companions} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}

export default Profile
