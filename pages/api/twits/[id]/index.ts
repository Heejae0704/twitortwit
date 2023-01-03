import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/client';
import { withApiSession } from '../../../../lib/withApiSession';

interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const {
      query: { id },
      session: { user },
    } = req;
    const twit = await client.twit.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },

        user: {
          select: {
            fullName: true,
            handle: true,
            avatarColor: true,
          },
        },
      },
    });

    const isLiked = Boolean(
      await client.like.findFirst({
        where: {
          twitId: Number(id),
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    res.json({ ok: true, twit, isLiked });
  } else {
    res.status(403).end();
  }
}

export default withApiSession(handler);
