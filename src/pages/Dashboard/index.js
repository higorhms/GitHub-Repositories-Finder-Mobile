/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBook } from 'react-icons/fa';
import api from '../../services/api';

import {
   Container,
   RepositoriesContainer,
   List,
   ListItem,
   Name,
   Description,
   Language,
   FollowersContainer,
   Separator,
} from './styles';
import CardFollow from '../../components/CardFollow';

export default function Dashboard() {
   const [repositories, setRepositories] = useState([]);
   const [following, setFollowing] = useState([]);
   const [followers, setFollowers] = useState([]);
   const profile = useSelector(state => state.user.profile?.user);

   useEffect(() => {
      async function fetchApi() {
        const [repositoriesResponse, followersResponse, followingResponse] = await Promise.all([
        api.get(`/users/${profile.login}/repos`),
        api.get(`/users/${profile.login}/followers`),
        api.get(`/users/${profile.login}/following`)]
        )
         setRepositories(repositoriesResponse.data);
         setFollowers(followersResponse.data);
         setFollowing(followingResponse.data);
      }
      fetchApi();
   }, [profile]);

   return (
      <Container container item xs sm>
         <RepositoriesContainer item xs={12} sm={9}>
            <h1>Your Repositories</h1>
            <List>
               {repositories &&
                  repositories.map(r => (
                     <a
                        target="_blank"
                        href={`https://github.com/${profile.login}/${r.name}`}
                        key={r.id}
                     >
                        <ListItem>
                           <Name>
                              <div>
                                 <FaBook size={15} />
                                 <p>{r.name}</p>
                              </div>
                              <Language>{r.language}</Language>
                           </Name>
                           <Description>{r.description}</Description>
                        </ListItem>
                     </a>
                  ))}
            </List>
         </RepositoriesContainer>

         <FollowersContainer item xs>
            <h1>Friends</h1>
            <CardFollow title="Following" list={following} />
            <Separator />
            <CardFollow title="Followers" list={followers} />
         </FollowersContainer>
      </Container>
   );
}
