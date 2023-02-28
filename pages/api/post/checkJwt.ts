import type { NextApiRequest, NextApiResponse } from 'next';
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

type Data = { id: string } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const token = JSON.parse(req.body);
      const decoded = await jwt.verify(token, jwtSecret);

      if (decoded) {
        const { id } = decoded.data;
        res.status(200).json({ id });
      } else {
        throw new Error('Token expirado ou inválido.');
      }
    } catch (err: any) {
      res.status(err.status).json({ message: err.message });
    }
  }
}
