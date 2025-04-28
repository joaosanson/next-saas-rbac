import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <Button asChild>
      <Link href="/auth/sign-in">Sign in</Link>
    </Button>
  );
}
