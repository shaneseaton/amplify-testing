import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'seatontestingamplify',
  access: (allow) => ({
    "data/*": [ 
      allow.authenticated.to(["read", "write", "delete"])
    ],
    "data/shared/*": [ 
      allow.authenticated.to(["read", "write", "delete"])
    ],
    // "data/team1/*": [
    //   allow.groups(["ADMIN"]).to(["read", "write", "delete"]),
    //   allow.groups(["TEAM1"]).to(["read", "write", "delete"]),
    // ],
    // "data/team2/*": [
    //   allow.groups(["ADMIN"]).to(["read", "write", "delete"]),
    //   allow.groups(["TEAM2"]).to(["read", "write", "delete"]),
    // ]
  })
});