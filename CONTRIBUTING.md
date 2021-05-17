# Contributing

_This section is under construction._

To start, clone the repository to your development machine:

```bash
git clone https://github.com/umb-deephealth/deephealth-annotate.git
```

Before we begin making changes, let's create a new git branch to work on:

```bash
git branch -b YOUR_BRANCH_NAME
```

Verify the branch was created and set it as our current working branch:

```bash
git checkout YOUR_BRANCH_NAME
```

Now, we can try to run the application (from the root app directory containing 'package.json'):

```bash
ng serve
```

If successful, this should spin up a dev server. Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any of the source files.

_APPLICATION ARCHITECTURE AND MAKING CHANGES GOES HERE_

Finally, commit and push the changes to the remote repository. Then, open a pull request:

_todo_

To perform a new production build, run the following from the root application directory:

```bash
ng build --prod=true --outputPath=prod --baseHref=/deephealth-annotate/
```

The build artifacts will be stored in the 'prod' directory given as an argument to '--outputPath'. When complete, be sure to add these new artifacts to your git index:

```bash
git add prod
```

Finally, commit and push your changes to the remote repository.

GitHub Pages, the deployment environment for the application, is set to look at the 'prod' directory on the 'main' branch for build artifacts to serve at [https://umb-deephealth.github.io/deephealth-annotate/](https://umb-deephealth.github.io/deephealth-annotate/). This means changes will need to be accepted and merged into main along with a corresponding build of '/prod' in order for those changes to be reflected in the production application.
