'use client';

import { useRouter } from 'next/navigation';
import { setActiveStackId } from '../../../lib/storage';

export default function SetActiveButton({ stackId }: { stackId: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        setActiveStackId(stackId);
        router.push('/');
      }}
      className="w-full rounded-xl bg-accent py-4 font-semibold text-black"
    >
      Make this my active stack
    </button>
  );
}
