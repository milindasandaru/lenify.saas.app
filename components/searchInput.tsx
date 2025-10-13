"use client";

import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/dist/client/components/navigation';
import { useRouter } from 'next/navigation';

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const searchQuery = searchParams.get('topic');
        if (searchQuery) {
            const newUrl = `${pathname}?topic=${encodeURIComponent(searchQuery)}`;
            router.push(newUrl);
        }
    }, [searchParams, searchQuery, router, pathname]);

  return (
    <div className='relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit'>
      <img src="/icons/search.svg" alt="search" width={15} height={15} />
        <input 
            placeholder='Search companions...'
            className='outline-none border-none bg-transparent'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
            className='bg-black text-white px-4 py-1 rounded-lg'
            onClick={() => {
                router.push(`${pathname}?topic=${searchQuery}`);
            }}
        >
            Search
        </button>
    </div>
  )
}

export default SearchInput
