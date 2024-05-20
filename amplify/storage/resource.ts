import { defineStorage } from '@aws-amplify/backend';

const allgroups = ["ADMIN", "TEAM1", "TEAM2"]

export const storage = defineStorage({
  name: 'seatontestingamplify',
  access: (allow) => ({
    "data/*": [ 
      allow.authenticated.to(["read", "write", "delete"]),
      allow.groups(["ADMIN"]).to(["read", "write", "delete"]),
      allow.groups(["TEAM1", "TEAM2"]).to(["read"]),
    ],
    "data/shared/*": [ 
      allow.authenticated.to(["read", "write", "delete"]),
      allow.groups(allgroups).to(["read", "write", "delete"]),
    ],
    "data/team1/*": [
      allow.groups(["ADMIN", "TEAM1"]).to(["read", "write", "delete"]),
    ],
    "data/team2/*": [
      allow.groups(["ADMIN", "TEAM2"]).to(["read", "write", "delete"]),
    ]
  })
});