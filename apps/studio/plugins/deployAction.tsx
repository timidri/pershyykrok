import type { DocumentActionComponent, DocumentActionProps } from 'sanity';
import { useToast } from '@sanity/ui';
import { getDeployHookUrl, triggerDeployHook } from '../lib/deployHook';

export const deployAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published } = props;
  const doc = (draft || published) as { _type?: string } | undefined;
  const docType = doc?._type;
  const toast = useToast();

  if (docType !== 'siteSettings') {
    return null;
  }

  const hookUrl = getDeployHookUrl();
  const disabled = !hookUrl;

  return {
    label: disabled ? 'Deploy unavailable' : 'Deploy site',
    title: disabled
      ? 'Missing SANITY_STUDIO_VERCEL_DEPLOY_HOOK (create in Vercel: Settings → Git → Deploy Hooks)'
      : 'Trigger a Vercel deploy for the website',
    disabled,
    onHandle: async () => {
      const confirmed = window.confirm('Trigger a Vercel deploy for the website?');
      if (!confirmed) {
        props.onComplete();
        return;
      }

      toast.push({ status: 'info', title: 'Deploy triggered', description: 'Request sent to Vercel.' });

      const result = await triggerDeployHook();
      if (result.ok) {
        props.onComplete();
        return;
      }

      if (result.error === 'missing-hook') {
        toast.push({
          status: 'error',
          title: 'Deploy hook missing',
          description:
            'Create a Vercel Deploy Hook (Settings → Git → Deploy Hooks) and set SANITY_STUDIO_VERCEL_DEPLOY_HOOK.',
        });
      } else {
        toast.push({
          status: 'error',
          title: 'Deploy failed',
          description:
            typeof result.status === 'number'
              ? `Vercel responded with ${result.status}.`
              : result.error || 'Unknown error',
        });
      }

      props.onComplete();
    },
  };
};
