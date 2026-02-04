export function getDeployHookUrl() {
  return import.meta.env.SANITY_STUDIO_VERCEL_DEPLOY_HOOK || '';
}

export async function triggerDeployHook() {
  const hookUrl = getDeployHookUrl();
  if (!hookUrl) {
    return { ok: false, error: 'missing-hook' as const };
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' });
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
