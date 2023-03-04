const mongoose = require('mongoose');
import type { NextApiRequest, NextApiResponse } from 'next';
import { usersCollection } from '../../../utils/dbConnect';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

type Data = { token: '' } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const {
        username: login,
        password,
        confirmPassword,
      } = JSON.parse(req.body);
      const alreadyRegistered = await usersCollection.findOne({ login });
      //se já nao tiver registrado
      if (!alreadyRegistered) {
        //se as senhas forem preenchidas corretamente
        if (password === confirmPassword) {
          const saltRounds = process.env.SALTYSALTY!;
          const salt = bcrypt.genSaltSync(parseInt(saltRounds));
          const hashedPass = bcrypt.hashSync(password, salt);

          const newUser = {
            login: login.toLowerCase(),
            nome: 'User',
            password: hashedPass,
            endereco: '',
            sexo: 'Prefiro não informar',
            itensComprados: [],
          };
          const insert = await usersCollection!.insertOne({ ...newUser });
          if (insert) {
            const userId = insert.insertedId.toString();

            const token = jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 30 * 60,
                data: { id: userId },
              },
              jwtSecret
            );
            res.status(200).json({ token });
          } else
            res
              .status(500)
              .json({ message: 'Erro na inserção do usuário na database.' });
        } else res.status(500).json({ message: 'Senhas não conferem.' });
      } else res.status(500).json({ message: 'Usuário já registrado.' });
    } catch (err: any) {
      const { message } = err;
      res.status(err.status).json({ message });
    }
  }
}
