import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/client';
import { withApiSession } from '../../../lib/withApiSession';
import bcrypt from 'bcrypt';

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

  const { email, password } = req.body;

  const foundUser = await client.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!foundUser) {
    res.status(404).end();
  } else {
    const passwordCheckResult = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!passwordCheckResult) {
      return res.status(404).end();
    } else {
      req.session.user = {
        id: foundUser.id,
      };
      await req.session.save();
    }
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(handler);
