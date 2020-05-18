import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { RepositoryInfo, Issues, Container } from './styles';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { owner, repo } = useParams();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get(`/repos/${owner}/${repo}`).then((response) => {
      setRepository(response.data);
    });

    api.get(`/repos/${owner}/${repo}/issues`).then((response) => {
      setIssues(response.data);
    });
  }, [owner, repo]);

  return (
    <Container>
      {repository && (
        <RepositoryInfo>
          <Link to="/explorer">
            <FiChevronLeft size={16} />
            Voltar
          </Link>
          <header>
            <img
              src={repository?.owner.avatar_url}
              alt={repository?.owner.login}
            />
            <div>
              <strong>{repository?.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>Stars</strong>
              <strong>{repository.stargazers_count}</strong>
            </li>
            <li>
              <strong>Forks</strong>
              <strong>{repository.forks_count}</strong>
            </li>
            <li>
              <strong>Issues abertas</strong>
              <strong>{repository.open_issues_count}</strong>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues &&
          issues.map((issue) => (
            <a key={issue.id} href={issue.html_url}>
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.user.login}</p>
              </div>
              <FiChevronRight size={20} />
            </a>
          ))}
      </Issues>
    </Container>
  );
};

export default Repository;
