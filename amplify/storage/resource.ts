import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'seatontestingamplify',
  access: (allow) => ({
    "shared/*": [ 
      allow.authenticated.to(["read", "write", "delete"])
    ],
    "team1/*": [
      allow.groups(["ADMIN"]).to(["read", "write", "delete"]),
      allow.groups(["TEAM1"]).to(["read", "write", "delete"]),
    ],
    "team2/*": [
      allow.groups(["ADMIN"]).to(["read", "write", "delete"]),
      allow.groups(["TEAM2∂"]).to(["read", "write", "delete"]),
    ]
  })
});