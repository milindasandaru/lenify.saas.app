"use client";

import React, { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/dist/client/components/navigation';
import { useRouter } from 'next/navigation';

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam !== null && topicParam !== searchQuery) {
      setSearchQuery(topicParam);
    }
  }, [searchParams]);

  return (
    <div className='relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit'>
      <img src="/icons/search.svg" alt="search" width={15} height={15} />
    <input 
      placeholder='Search companions...'
      className='outline-none border-none bg-transparent'
      value={searchQuery}
      onChange={(e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          if (value.trim() === "") {
            router.push(pathname);
          } else {
            router.push(`${pathname}?topic=${encodeURIComponent(value)}`);
          }
        }, 400);
      }}
    />
    </div>
  )
}

export default SearchInput
