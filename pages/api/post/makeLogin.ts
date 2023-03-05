const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import type { NextApiRequest, NextApiResponse } from 'next';
import { usersCollection } from '@/utils/dbConnect';
import { UserType } from '@/types/types';

const jwtSecret = process.env.JWT_SECRET;

type Data = { token: string } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const { login, password }: { login: string; password: string } =
        JSON.parse(req.body);
      const user: UserType = await usersCollection!.findOne({
        login: login.toLowerCase(),
      });

      if (login.length > 0 && password.length > 0) {
        if (
          user &&
          login === user.login &&
          bcrypt.compareSync(password, user.password)
        ) {
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 30 * 60,
              data: { id: user._id.toString() },
            },
            jwtSecret
          );
          res.status(200).json({ token });
        } else {
          throw new Error('Usuário não encontrado ou senha incorreta.');
        }
      } else {
        throw new Error('Algum dos campos não foi preenchido.');
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
