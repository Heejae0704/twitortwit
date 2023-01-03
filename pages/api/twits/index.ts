import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/client';
import { withApiSession } from '../../../lib/withApiSession';

interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const twits = await client.twit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      twits,
    });
  } else if (req.method === 'POST') {
    const { user } = req.session;
    const { content, imageUrl } = req.body;

    const twit = await client.twit.create({
      data: {
        content,
        imageUrl,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      twit,
    });
  }
}

export default withApiSession(handler);
