import React from 'react'
import { getAllCompanions } from '@/lib/actions/companion.action'
import CompanionCard from '@/components/companionCard';
import SearchInput from '@/components/searchInput';
import SubjectFilter from '@/components/subjectFilter';

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : '';
  const topic = filters.topic ? filters.topic : '';

  const companions = await getAllCompanions({ subject, topic });

  console.log(companions)

  return (
    <main>
      <section className='flex flex-col gap-4'>
        <div className="flex justify-between items-center gap-4 max-sm:flex-col">
          <h1>Companion Library</h1>
          <div className="flex gap-2 relative z-50">
            <SearchInput />
            <SubjectFilter />
          </div>
        </div>
        <div className="flex gap-4">Filters</div>
      </section>
      <section className='companions-grid'>
        {companions.map((companion) => (
          <CompanionCard key={companion.id} {...companion} />
        ))}
      </section>
    </main>
  )
}

export default CompanionsLibrary
