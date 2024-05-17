// import { Button, Flex, Heading, Image, Text } from '@aws-amplify/ui-react';
import { AccountSettings, Authenticator, Button, Card, Flex, Heading, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import FileManager from './FileManager';

function App() {
  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <Flex direction="column" gap="1rem" >
          <Card variation="elevated" style={{ padding: "0.5rem" }}>
            <Flex direction="row" gap="1rem" justifyContent="flex-end" alignItems="baseline">
              <View flex="1 0 auto"><Heading>CPT S3 Explorer</Heading></View>
              <View>{user?.signInDetails?.loginId}</View>
              <Button size="small" onClick={signOut}>Sign out</Button>
            </Flex>
          </Card>
          <FileManager />
        </Flex>
      )}
    </Authenticator>
  );
}

export default App;