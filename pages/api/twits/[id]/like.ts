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
  if (req.method === 'POST') {
    const {
      query: { id },
      session: { user },
    } = req;
    const alreadyExists = await client.like.findFirst({
      where: {
        twitId: Number(id),
        userId: user?.id,
      },
    });
    if (alreadyExists) {
      await client.like.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          twit: {
            connect: {
              id: Number(id),
            },
          },
        },
      });
    }
    res.json({ ok: true });
  }
}

export default withApiSession(handler);
