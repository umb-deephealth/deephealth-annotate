# Contributing

_---This section is under construction.---_

**Table of Contents:**

1. [Getting Started](#Getting-Started)
2. [Architecture](#Architecture)
3. [Building & Deployment](#Building--Deployment)

## Getting Started

To start, clone the repository to your development machine:

```bash
git clone https://github.com/umb-deephealth/deephealth-annotate.git
```

Before we begin making changes, let's create a new git branch to work on and set it as our working branch:

```bash
git checkout -b YOUR_BRANCH_NAME
```

Now, we can install dependencies and run the application (from the app's root directory containing 'package.json'):

```bash
npm install && ng serve
```

If successful, this should spin up a dev server. Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any of the source files.

## Architecture

This project was generated with [Angular CLI][angular-cli] 11.2.2. Angular project configuration settings can be found in the root directory in [angular.json][angular-json], together with [package.json][package-json], which defines the project's [NPM][npmjs] settings, build scripts, and dependencies.

The `/docs` folder contains only build artifacts. We can ignore it until we discuss [Building & Deployment](#building--deployment).

Last but certainly not least is the `/src` folder, which contains our Angular application code and resources. At the root, we have a set of files that make up the entry point of the application:

- `styles.scss`, which defines global CSS imports and styles accessible within the entire application.

- `main.ts`, which is the TypeScript entrypoint. This file serves as a startup service to bootstrap our root `AppComponent` located within the `/app` folder.

- `index.html`, which is the HTML entrypoint. The `<app-root>` tag in this file will be replaced with the contents of our root `AppComponent` HTML.

We also have a few folders:

- `/environments` contains configurations scripts for setting up different environments for testing, development, prod, etc.

- `/assets` contains all of the image assets we use, as well as the [CornerstoneWADOImageLoader][wado-loader] codec used for parsing and loading DICOM data.

- `/app` contains the root `AppComponent`, as well as folders for any other Angular components, services, or directives that make up the application.

If you are not familiar with the Angular framework and the component model it uses, we recommend reading the following [documentation][ng-components] to get comfortable with all the basic building blocks of an Angular application before continuing on with making changes. Relevant topics include components, templates, views, styles, directives, data binding, and component interaction.

## Making Changes

In the `/src/app` directory, we can see that our app has a few core pieces:

- `AppComponent`, the root component that embeds the DICOM viewer and handles global hotkeys as well as handing off of input images to the viewer for loading.

- `/dragdrop`, which is a custom directive used to handle mouse drag-and-drop events for file input.

- `/info-dialog`, containing the HTML template for the Info (?) modal that can be triggered.

- `/dicom-viewer`, containing the DICOM viewer component that makes up the bulk of our app. The `cornerstone.directive.ts` file contains the directive that encapsulates [Cornerstone.js][cornerstone] functionality for use within the component.

_CHANGE EXAMPLE GOES HERE_

Finally, commit and push your changes to the remote repository. Then, open a pull request.

## Building & Deployment

GitHub Pages, the deployment environment for the application, is set to look at the `/docs` directory of the `main` branch for build artifacts to serve at [https://umb-deephealth.github.io/deephealth-annotate/](https://umb-deephealth.github.io/deephealth-annotate/). This means code changes will need to be accepted and merged into the `main` branch. Then, a new build of `/docs` must be made from the latest version of `main` and pushed upstream to the remote repository to be served.

To perform a new production build, run the following from the root application directory on branch `main`:

```bash
ng build --prod=true --outputPath=docs --baseHref=/deephealth-annotate/
```

The build artifacts will be stored in the `/docs` directory given as an argument to '--outputPath'. When complete, be sure to add these new artifacts to your git index:

```bash
git add docs
```

Finally, commit and push your changes.

<!-- prettier-ignore-start -->
[angular-cli]: https://angular.io/guide/setup-local
[angular-json]: https://github.com/umb-deephealth/deephealth-annotate/blob/main/angular.json
[package-json]: https://github.com/umb-deephealth/deephealth-annotate/blob/main/package.json
[npmjs]: https://docs.npmjs.com/about-npm
[wado-loader]: https://github.com/cornerstonejs/cornerstoneWADOImageLoader
[ng-components]: https://angular.io/guide/component-overview
[cornerstone]: https://github.com/cornerstonejs/cornerstone
<!-- prettier-ignore-end -->
