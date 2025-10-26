import CompanionForm from '@/components/companionForm'
import SearchInput from '@/components/searchInput'
import { newCompanionPermissions } from '@/lib/actions/companion.action'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/dist/client/link'
import { redirect } from 'next/navigation'
import React from 'react'

const NewCompanion = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in?redirect_url=/companions/new');
  }

  const canCreateCompanion = await newCompanionPermissions();

  return (
    <main className='min-lg:w-1/2 min-md:w-2/3 items-center justify-center'>
      {canCreateCompanion ? (
        <article>
        <h1>Companion Builder</h1>
        <div className="p-4"><CompanionForm /></div>
      </article>
      ) : (
        <article className='companion-limit'>
          <img src="/images/limit.svg" alt="Companion limit reached" width={360} height={240} />
          <div className="cta-badge">
            Upgrade your plan
          </div>
          <h2 className='text-xl font-semibold'>You've Reached Your Limit</h2>
          <p>You need to upgrade your plan to unlock more features and create more companions.</p>
          <Link href="/subscription" className='upgrade-button btn-primary w-fit justify-center mx-auto'>
            Upgrade Now
          </Link>
        </article>
      )}
    </main>
  )
}

export default NewCompanion
