# Getting started

Local:

- Clone repo: `git clone https://github.com/Randulfe/surfe-notes.git`
- Install dependencies: `npm ci`
- Run project: `npm run dev`

Deployment:

- Build: `npm run build`

# Context and Constrains

Assignment details [here](https://surfe.notion.site/Front-end-coding-challenge-159f216748f74f78b0677b472e6ee62e).

- The requirements clearly prefer simple low level solutions with little to no use of external libraries and tools.
- The data is to be persisted across browser sessions instead of user sessions, thus, only the browser/FE context is important.
- The API provides methods only for GET, PUT and POST. Therefore, no deletion will be available.
- The API does not return paginated data and instead returns everything in one go. Clearly not efficient but for the purpose of a coding assignment it's a fair decision.
- I had a short time constraint (and a lot of incredible ideas to play around for this app!) so a lot of the technical decisions were impacted by this and this compromised some execution I would have done differently in a more relaxed scenario (not the same the day to day than a mini hackathon).

# Technical decisions


### React SPA with React Router

A NextJS/Tanstack SSR solution seems a bit of an overkill, specially given that this is a FE exclusive application without DB persistence. Moreover, the routing should be simple with just two page types available and this ties well with the task intention of using little to no libraries.

### Pipeline

- Husky pre-commit hooks: runs quick tests to prevent overloading the CI/CD server or consuming resources for no reason. This is, anything with Typescript, Eslint, Prettier or Unit test issues. Tests that can take longer or need feedback from other members of the team will be left to the CI/CD pipeline server.
- Github actions: Great for running E2E tests that might take longer or might need feedback/discussion from other engineers, PMs or QAs.

### External libraries

This solution uses a minimal set of libraries that don't solve any of the tasks from tha assignment for myself. These are just libraries that help me maintain good practices and standards and power up throw the nice to haves and application development.

- Tanstack Query: Great solution for controlling API/BE/third parties state and context. It solves many complex problems for you (caching, pagination, etc.) without taking away the flexibility and low level control you might need.
- React Router: Simple solution great for an SPA that manages all the browser history complexities and lets you focus on what matters: architecting the application and how the user interacts with it.
- Tailwind: Low level scalable solution for styling keeping context in the component and isolating abstraction to the application entities (user input, dashboards, etc.) rather than the technologies (HTML, CSS, JS, etc.). I believe this is the USP of React and Tailwind just enables that in the styling dimension.
- Storybook: Will speed up UI/UX component building, isolating their functionality and allowing easy and fast testing. It will also enable true E2E component testing that isn't a waste of time in the FE.
- Zustand: Great solution for controlling application/FE state and context. Simple yet effective and reliable that solves some of React Context pain points without adding complexity nor boilerplate code.
- Reactflow: as this is more of a nice to have I thought it would be out of the scope of using little to no libraries so I took the freedom to give the app some life harvesting this great package.

# Improvements

### The obvious ones

- Add error handling from the API (reflected on TODOs across the application's comments). This could be a toast message for things like update errors (and after some retries blocking the user from typing and showing a clear error message), a full message or a redirection where it makes sense.
- Handling limits and edge cases: note length (involves checking with the BE), maximum number of workspaces (localstorage is big but we don't want to make our app impractical and letting users have 100s of workspaces is bad user experience) and maximum number of notes (same as with workspaces but we could expect this limit to be higher).
- Efficient user lookups. If the BE provided an endpoint to get a batch of users per query this would be the way to go for the dropdown. A simple, much shorter debounce when typing and filtering supported by the BE could improve performance (specially if we have 1000s of users). Async could be handled with optimistic updates of the list we are showing to the user.
- Efficient note update. The current endpoint requires the whole body to update the note. If we had a more complex endpoint we could simply send the cursor position in our sanitized text and the change to prevent larger payloads, specially if the note length is large.
- Add testing and follow more TDD. The application, specially in terms of utils and hooks lacks a lot of tests that would be very useful and good to make sure solutions are robust. Given the time constraints, I had to sacrifice some of these, specially towards the end of the assignment.
- Centralized error boundaries and better handle 404s or going to pages where notes don't exist.
- Send update request on the browser event for tab close.
- Send update request on the browser event for switching to a different tab.
- Get the notes to be editable in the React Flow canvas (this is likely a bug with how I have integrated with the library as this was the very last thing I did).
- Save notes position in the canvas so when you refresh or switch to a new or existing note the position of the sticker notes remains. Would need to implement the integration with Zustand + ReactFlow for managing Node state.
- Keyboard actions like
  - CMD + S -> Show toast explaining notes are automatically saved
  - CMD + C / CMD + V / CMD + X -> Would work as expected
  - CMD + N -> New Note
  - CMD + A -> Go to all notes


#### Rich Input

- If the library constraint wasn't there I would have opted out for researching a good rich input library that is open source, flexible and extensible that handles all the browser specific complexities gracefully (like TipTap or Slate).
- Handle mentions and rich content with DOM Nodes instead of as a string of innerHTML. To insert mentions in the `contentEditable` element my first approach was to have an array of nodes of type either text or mention which then can be handled exclusively by React instead of by the HTML element (prevent the super inefficient and bug prone `createRoot`). However, after some struggle with managing the cursor position with this approach and due to the time constraints, I needed to do an easier workaround letting the element control the cursor position and selection and simply modifying the sanitized innerHTML.
- Use a different standard for the sanitized value I manage and send to the BE. Currently, new lines are handled by replacing them with `<br/>`. It would be better to use a Node system where new lines, mentions, text and any other future update (like bold, list, etc.) are managed as DOM Nodes and converted into markup instead of my simple conversion.
- Have the same model in `RichInput` for the `value` and the `div` content that is displayed and then on the adaptors convert the Nodes I created into the right markup language we have gone for.
- More functionality with the same API limitations. Some of the features I didn't have enough time to implement were the title and updated at. I was planning on having two inputs for these and then merge them as strings with the note body to persist them with the BE. This kind of input combination in the same string would also have allowed for other things like tables, colored notes and sticker note properties, other rich input, selection, calendar inputs and much more. Obviously, the implementation gets complex but with a flexible and extensible system as mentioned above it would have been fun and relatively easy to add new note features.
- The Node solution would also allow me to implement an undo/redo functionality by keeping track of current and past actions in a better and easier way.
- Currently, on refresh I'm inserting the mentions if the @username matches regardless wether the user ACTUALLY inserted it or not. With a more complex Node/markup system I could specify which @username have been tagged and respect user choices better.

### Better CI/CD/DX

- PR template
- Release please
- Automatic storybook creation on PR public for those with access to the repo
- Integration with a work tracking system like Jira
- Ngrok integration to test local changes across different devices
- Containers in local and different envs (dev, staging, prod)
- Husky output logs if step failed
- Contribution guidelines and use of conventional comments for PRs
- Sentry for monitoring
- Posthog for session replays, A/B testing features, feature flags and analytics

### DS

- Design System package that can be used across different applications if the Notes app grew (if working in a feature with both changes in the DS and your project you can always use yalc to sync)
- Support dark mode
- The DS components would be a bit more generic and open to many different data structures and not so tight to my application
- Storybook improvements
  - Chromatic integration with Storybook to point out visual differences in Storybook
  - Figma integration with Storybook to point components to their source of truth

