import MenuContainer from '@/components/containers/MenuContainer';
import Title from '@/components/text/Title';
import { useGlobalContext } from '@/context/GlobalContext';
import useFetch from '@/custom-hooks/useFetch';
import { usersCollection } from '@/utils/dbConnect';
import { ObjectId } from 'mongodb';
import Router from 'next/router';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

export const getServerSideProps = async (context: any) => {
  try {
    const jwt = require('jsonwebtoken');
    const jwtSecret = process.env.JWT_SECRET;

    const { id, jwt: token } = JSON.parse(context.req.headers.cookie.slice(9));
    const decoded = await jwt.verify(token, jwtSecret);

    if (decoded && id === decoded.data.id) {
      const { nome, endereco, sexo } = await usersCollection.findOne({
        _id: new ObjectId(id),
      });

      return {
        props: {
          userData: {
            _id: id,
            nome,
            endereco,
            sexo,
          },
        },
      };
    } else throw new Error();
  } catch (err: any) {
    return {
      props: {
        userData: {
          _id: '',
          nome: '',
          endereco: '',
          sexo: '',
        },
      },
    };
  }
};

type Props = {
  userData: {
    _id: string;
    nome: string;
    endereco: string;
    sexo: string;
  };
};

const Profile = ({ userData }: Props) => {
  const { _id, nome, endereco, sexo } = userData;
  const [editing, setEditing] = useState<boolean>(false);
  const [editNome, setEditNome] = useState<string>(nome);
  const [editEndereco, setEditEndereco] = useState<string>(endereco);
  const [editSexo, setEditSexo] = useState<string>(sexo);
  const { data, error, loading, request } = useFetch();
  const router = useRouter();

  const { isLoggedIn, checkJwt } = useGlobalContext();

  const handleSave = async () => {
    setEditing(false);
    if (await checkJwt()) {
      const { response, json } = await request(
        process.env.NEXT_PUBLIC_URL + '/api/post/updateUserProfile',
        {
          method: 'POST',
          body: JSON.stringify({
            _id,
            editNome,
            editEndereco,
            editSexo,
          }),
        }
      );
      if (response?.ok) {
        router.reload();
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditNome(nome);
    setEditEndereco(endereco);
    setEditSexo(sexo);
  };

  useEffect(() => {
    if (!window.localStorage.getItem('storeJwt')) {
      Router.push('/login');
    }
  }, [isLoggedIn]);

  return (
    isLoggedIn && (
      <ProfileContainer>
        {editing ? (
          <>
            <Title>Profile</Title>
            <h3>Nome: </h3>
            <input
              value={editNome}
              onChange={({ target }) => setEditNome(target.value)}
            />
            <h3>Endereço: </h3>
            <input
              value={editEndereco}
              onChange={({ target }) => setEditEndereco(target.value)}
            />
            <h3>Sexo: </h3>
            <select
              value={editSexo}
              onChange={({ target }) => setEditSexo(target.value)}
            >
              <option value='Prefiro não informar'>Prefiro não informar</option>
              <option value='Não-binário'>Não-binário</option>
              <option value='Masculino'>Masculino</option>
              <option value='Feminino'>Feminino</option>
            </select>
            <button onClick={handleSave}>salvar</button>
            <button onClick={handleCancel}>cancelar</button>
          </>
        ) : (
          <>
            <Title>Profile</Title>
            <h3>Nome: </h3>
            <p>{nome}</p>
            <h3>Endereço: </h3>
            <p>{endereco}</p>
            <h3>Sexo: </h3>
            <p>{sexo}</p>
            <button onClick={() => setEditing(true)}>editar</button>
          </>
        )}
      </ProfileContainer>
    )
  );
};

export default Profile;

const ProfileContainer = styled(MenuContainer)`
  padding: 3rem 12rem;
  @media (max-width: 790px) {
    padding: 3rem 3rem;
  }
`;
