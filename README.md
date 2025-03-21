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

### External libraries

- Tanstack Query:
- React Router: 
- Tailwind: 
- Storybook: 
- Zustand:

# Potential improvements
