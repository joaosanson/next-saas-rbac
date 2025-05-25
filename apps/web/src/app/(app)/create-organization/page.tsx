import { Header } from '@/components/header';
import CreateOrganizationForm from './create-organization-form';

export default function createOrganization() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Create organization</h1>

        <CreateOrganizationForm />
      </main>
    </div>
  );
}
