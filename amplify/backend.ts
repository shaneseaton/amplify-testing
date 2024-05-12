import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
// import { data } from './data/resource';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  // data,
  storage
});

backend.addOutput({
  storage: {
    aws_region: "ap-southeast-2",
    bucket_name: "sea066-test-amplify",    
  },
});