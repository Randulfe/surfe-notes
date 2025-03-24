# Getting started

Local:

- Clone repo: `git clone https://github.com/Randulfe/surfe-notes.git`
- Install dependencies: `npm ci`
- Run project: `npm run dev`

Deployment:

- Build: `npm run build`

# Technical decisions

### React SPA with React Router

- The requirements clearly prefer simple solutions without over complicating the wheel with external libraries and tools
- The data is to be persisted across browser sessions instead of user sessions, thus, only the browser/FE context is important.
- A NextJS or Tanstack application with SSR seems a bit of an overkill, specially giving that this seems to be a FE exclusive application without DB persistency. Moreover, the routing should be simple with just two page types available.

### Pipeline

- Husky pre-commit hooks: runs quick test to prevent overloading the server CI/CD pipeline with code we didn't meant to push. This is, anything with Typescript, Eslint, Prettier or Unit test issues. Tests that can take longer or need feedback from other members of the team will be left to the CI/CD pipeline server.
- Github actions: Great for running E2E tests that might take longer or might need feedback/discussion from other engineers, PMs or QAs.

### External libraries

- Tanstack Query: Great solution for controlling API/BE/third parties state and context. It solves many complex problems for you (caching, pagination, etc.) without taking away the flexibility and low level control you might need.
- React Router: Simple solution great for an SPA that manages all the browser history complexities and lets you focus on what matters: architecting the application and how the user interacts with it.
- Tailwind: Low level scalable solution for styling keeping context in the component and isolating abstraction to the application entities (user input, dashboards, etc.) rather than the technologies (HTML, CSS, JS, etc.). I believe this is the USP of React and Tailwind just enables that in the styling dimension.
- Storybook: Will speed up UI/UX component building isolating their functionality and allowing easy and fast testing. It will also enable true E2E component testing that isn't a waste of time in the FE.
- Zustand: Great solution for controlling application/FE state and context. Simple yet effective and reliable that solves some of React Context pain points without adding complexity nor boilerplate code.

# Potential improvements

- Better CI/CD setup
  - PR template
  - Release please
  - Automatic storybook creation on PR public for those with access to the repo
  - Integration with a work tracking system like Jira
- Design System package that can be used across different applications if the Notes app grew (if working in a feature with both changes in the DS and your project you can always use yalc to sync)
- Ngrok integration to test local changes across different devices
- Storybook improvements
  - Chromatic integration with Storybook to point out visual differences in Storybook
  - Figma integration with Storybook to point components to their source of truth
- Containers in local and different envs (dev, staging, prod)
- Husky output logs if step failed
- I know it's a bit of a stereotype but honestly, if I had more time for this I would have added unit tests to the `richInput` editor as I'm building it rather than later or not adding them. I have just been short of time given other responsibilities I got.
- If sessions were a more complex data system I would rather use array of objects or hash maps than the array of strings I've got
- The DS components would be a bit more generic and open to many different data structures and not so tight to my application
