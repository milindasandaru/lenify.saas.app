import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserSessions } from '@/lib/actions/companion.action';

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  const sessionHistory = await getUserSessions(user.id);

  return (
  <main className='lg:w-3/4'>
      <section className='flex justify-between gap-4 max-sm:flex-col items-center'>
  <img src={user?.imageUrl} alt={user?.firstName || 'User avatar'} width={110} height={110} />

  <div className="flex flex-col gap-2">
          <h1 className='font-bold text-2xl'>
            {user?.firstName} {user?.lastName}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {user?.emailAddresses[0].emailAddress}
          </p>
        </div>
      </section>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes.It adheres to the WAI-ARIA design patter.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}

export default Profile
