'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately after the page is mounted
    router.push('/employee/dashboard'); // Navigate to the employee dashboard page
  }, [router]);

  return <div>Redirecting...</div>; // Optional: Display a redirecting message
}
