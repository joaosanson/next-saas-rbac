import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <Button type="submit" className="w-full cursor-pointer">
        Recover password
      </Button>

      <Button
        variant="link"
        className="w-full cursor-pointer"
        size="sm"
        asChild
      >
        <Link href={'/auth/sign-in'}>Sign in instead</Link>
      </Button>
    </form>
  );
}
