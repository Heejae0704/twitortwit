import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/client';
import { withApiSession } from '../../../lib/withApiSession';
import bcrypt from 'bcrypt';

interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

const avatarColors = [
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'fuchsia',
  'pink',
];

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const profile = await client.user.findUnique({
      where: {
        id: req.session?.user?.id,
      },
    });
    if (profile) {
      res.json({
        ok: true,
        profile,
      });
    } else {
      res.json({
        ok: false,
      });
    }
  } else if (req.method === 'POST') {
    const { email, fullName, handle, password } = req.body;
    const existingEmail = await client.user.findFirst({
      where: {
        email,
      },
    });

    const existingHandle = await client.user.findFirst({
      where: {
        handle,
      },
    });

    const existingFields: { [key: string]: string } = {};

    if (existingEmail) {
      existingFields.email = email;
    }
    if (existingHandle) {
      existingFields.handle = handle;
    }

    console.log(existingFields);

    if (existingFields.email || existingFields.handle) {
      console.log('existing logic works!');
      res.json({ ok: false, existingFields });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.user.create({
      data: {
        email,
        fullName,
        handle,
        password: hashedPassword,
        avatarColor: avatarColors[Math.floor(Math.random() * 14)],
      },
    });

    res.json({ ok: true });
  } else {
    res.status(403).end();
  }
}

export default withApiSession(handler);
