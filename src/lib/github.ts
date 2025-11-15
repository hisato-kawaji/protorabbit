import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

let octokit: Octokit | null = null;

export const getOctokit = async (): Promise<Octokit> => {
  if (octokit) {
    return octokit;
  }

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const owner = process.env.GITHUB_REPO_OWNER;

  if (!appId || !privateKey || !owner) {
    throw new Error('GitHub App environment variables are not set');
  }

  const appAuth = createAppAuth({
    appId,
    privateKey,
  });

  const installationAuth = await appAuth({
    type: 'app',
  });

  const { data: installations } = await new Octokit({ auth: installationAuth.token }).apps.listInstallations();
  const installation = installations.find(
    (i) => (i.account as any)?.login === owner
  );

  if (!installation) {
    throw new Error(`GitHub App not installed for owner: ${owner}`);
  }

  const { token } = await appAuth({
    type: 'installation',
    installationId: installation.id,
  });

  octokit = new Octokit({ auth: token });
  return octokit;
};
