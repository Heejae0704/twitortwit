import { NextApiRequest, NextApiResponse } from 'next';
import { withApiSession } from '../../../lib/withApiSession';

interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method !== 'POST') {
    res.status(403).end();
  }

  await req.session.destroy();
  res.redirect(307, '/log-in');
}

export default withApiSession(handler);
