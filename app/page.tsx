import CompanionCard from '@/components/companionCard'
import CTA from '@/components/CTA'
import CompanionList from '@/components/companionList'
import React from 'react'
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.action'

const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main className="p-4">
      <h1 className='text-2xl'>Dashboard</h1>

      <section className="home-section">
        {companions?.map((companion) => (
          <CompanionCard 
          key={companion.id}
          { ...companion }
          />
        ))}
      </section>

      <section className='home-section'>
        <CompanionList 
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          className="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>

    </main>
  )
}

export default Page