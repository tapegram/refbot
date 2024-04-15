# Refbot

A POC webapp for reviewing fencing touches!

## What is it?

A simple app that loads in random, single touch clips and allows you to practice refereeing!

The hope is that

1. We can leverage the sabre video collection that Will Spear and Andrew Fischl has built up to build a fun little practice app
2. Collect real opinions to be used in training a "robot" (ML model) to referee based on similar clips.
3. Collect data and display back to users to see how they compare to "general" opinions, or even specific well-known users!

## TODOs

Currently implementing this entirely as a frontend app with no state, but providing hooks to wire in a real backend in the near future

- Return user specific data in the decisions summary
- Update video flow to display summary info after making a decision and before moving to the next clip
- Record use specific decisions
- Display decisions compared to other users
- Login/signup flow
- Introduce comment section to facilitate arguing
- Consider more fine-grained decisions (None, is a pretty unhelpful catch-all)
- Consider using a fun styled component library instead of just practicing CSS.
- Move all of the fake frontend stuff to the backend

## Done

- Deploy on internet
- Setup CI/CD
- Record decisions
- Do some slightly hacky buffering of videos to not get gross flashing when moving to the next clip
- Create Auth Context and hard code in a User
- Use the above context to report user specific decisions
