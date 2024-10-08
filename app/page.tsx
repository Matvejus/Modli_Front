'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the desired page
    router.push('/gowns');
  }, [router]);

  return null; // Or you can render a loading state until the redirect happens
}
