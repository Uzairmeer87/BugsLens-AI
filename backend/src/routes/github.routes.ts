import { Router } from 'express';
import { GitHubClient } from '../integrations/github/client.js';
import { authenticate } from '../middleware/auth.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.use(authenticate);

router.get('/repos/:owner/:repo', async (req, res, next) => {
  try {
    const client = new GitHubClient();
    const metadata = await client.getRepoMetadata(req.params.owner, req.params.repo);
    sendSuccess(res, metadata);
  } catch (error) {
    next(error);
  }
});

router.get('/repos/:owner/:repo/branches', async (req, res, next) => {
  try {
    const client = new GitHubClient();
    const branches = await client.listBranches(req.params.owner, req.params.repo);
    sendSuccess(res, { branches });
  } catch (error) {
    next(error);
  }
});

router.get('/repos/:owner/:repo/commits', async (req, res, next) => {
  try {
    const client = new GitHubClient();
    const commits = await client.listCommits(req.params.owner, req.params.repo);
    sendSuccess(res, { commits });
  } catch (error) {
    next(error);
  }
});

export default router;
