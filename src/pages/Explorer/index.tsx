import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import { Link } from 'react-router-dom';
import {
  Container,
  Title,
  Form,
  Repositories,
  Error,
  Subtitle,
} from './styles';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Explorer: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storedRepositories = localStorage.getItem(
      '@GitHubExplorer:repositories',
    );
    if (storedRepositories) {
      return JSON.parse(storedRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GitHubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  const handleAddRepository = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      try {
        if (!newRepo) {
          setErrorMessage('Type the owner/repository you are trying to find');
          return;
        }

        const response = await api.get<Repository>(`/repos/${newRepo}`);

        const repository = response.data;

        setRepositories([...repositories, repository]);
        setNewRepo('');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('This repository does not exist');
      }
    },
    [newRepo, repositories],
  );

  return (
    <Container>
      <Title>Explore repositories on GitHub</Title>
      <Subtitle>Find any repository you want!</Subtitle>

      <Form onSubmit={handleAddRepository} hasError={!!errorMessage}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Example: Owner/Repository"
        />

        <button type="submit">Search</button>
      </Form>

      {errorMessage && <Error>{errorMessage}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              alt={repository.owner.login}
              src={repository.owner.avatar_url}
            />

            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </Container>
  );
};

export default Explorer;
