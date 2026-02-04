import type { NavbarProps } from 'sanity';
import { Box, Button, Flex, useToast } from '@sanity/ui';
import { getDeployHookUrl, triggerDeployHook } from '../lib/deployHook';

export function DeployToolbar(props: NavbarProps) {
  const toast = useToast();
  const hookUrl = getDeployHookUrl();
  const disabled = !hookUrl;

  const handleDeploy = async () => {
    const confirmed = window.confirm('Trigger a Vercel deploy for the website?');
    if (!confirmed) return;

    toast.push({ status: 'info', title: 'Deploy triggered', description: 'Request sent to Vercel.' });
    const result = await triggerDeployHook();
    if (result.ok) return;

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
  };

  return (
    <Box>
      {props.renderDefault(props)}
      <Box
        style={{
          position: 'fixed',
          right: 'clamp(140px, calc(18vw + 50px), 440px)',
          top: 8,
          zIndex: 1000,
        }}
      >
        <Button
          text="Deploy site"
          tone="primary"
          mode="ghost"
          disabled={disabled}
          onClick={handleDeploy}
          title={
            disabled
              ? 'Missing SANITY_STUDIO_VERCEL_DEPLOY_HOOK (create in Vercel: Settings → Git → Deploy Hooks)'
              : 'Trigger a Vercel deploy for the website'
          }
        />
      </Box>
    </Box>
  );
}
