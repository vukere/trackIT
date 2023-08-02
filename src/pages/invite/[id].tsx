import { useRouter } from 'next/router';
import { api } from '~/utils/api';

type ProcessComponentProps = {
  inviteId: string;
};

function ProcessComponent(props: ProcessComponentProps) {
  const router = useRouter();
  const { data: invite, isLoading } = api.inviteLink.join.useQuery({ inviteId: props.inviteId });

  if (!invite && isLoading) {
    return <div>Processing invite</div>;
  }

  if (!invite) {
    return <div>Error</div>;
  }

  void router.push('/projects');

  return <div>Redirecting</div>;
}

export default function Invite() {
  const router = useRouter();
  const inviteId = router.query.id as string;

  if (inviteId === undefined) {
    return null;
  }

  return <ProcessComponent inviteId={inviteId} />;
}
