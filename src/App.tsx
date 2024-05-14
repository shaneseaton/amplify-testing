// import { Button, Flex, Heading, Image, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { list } from 'aws-amplify/storage';
import { useEffect, useState } from 'react';


function App() {
  var [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async function() {
      try {
        const result = await list({
          path: '',
          // Alternatively, path: ({identityId}) => `album/{identityId}/photos/`
        });
        setItems(result.items);
      } catch (error) {
        console.log(error);
      }  
    }())
  }, [])

  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          {items.map(x => (
            <p>Farts: {x.path}</p>
          ))}
        </main>
      )}
    </Authenticator>
  );
}

export default App;