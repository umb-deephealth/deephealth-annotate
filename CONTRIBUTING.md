# Contributing

_---This section is under construction.---_

Table of Contents: -[Getting Started](#Getting-Started) -[Architecture](#Architecture) -[Building & Deployment](#Building-&-Deployment)

## Getting Started

To start, clone the repository to your development machine:

```bash
git clone https://github.com/umb-deephealth/deephealth-annotate.git
```

Before we begin making changes, let's create a new git branch to work on and set it as our working branch:

```bash
git checkout -b YOUR_BRANCH_NAME
```

Now, we can try to run the application (from the root app directory containing 'package.json'):

```bash
ng serve
```

If successful, this should spin up a dev server. Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any of the source files.

## Architecture

_--------APPLICATION ARCHITECTURE AND MAKING CHANGES GOES HERE----------_

Finally, commit and push your changes to the remote repository. Then, open a pull request.

## Building & Deployment

GitHub Pages, the deployment environment for the application, is set to look at the '/docs' directory of the 'main' branch for build artifacts to serve at [https://umb-deephealth.github.io/deephealth-annotate/](https://umb-deephealth.github.io/deephealth-annotate/). This means code changes will need to be accepted and merged into the 'main' branch. Then, a new build of '/docs' must be made from the latest version of 'main' and pushed upstream to the remote repository to be served.

To perform a new production build, run the following from the root application directory:

```bash
ng build --prod=true --outputPath=docs --baseHref=/deephealth-annotate/
```

The build artifacts will be stored in the 'docs' directory given as an argument to '--outputPath'. When complete, be sure to add these new artifacts to your git index:

```bash
git add docs
```

Finally, commit and push your changes.
