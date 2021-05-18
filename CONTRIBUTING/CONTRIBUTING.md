# Contributing

**Table of Contents:**

1. [Getting Started](#Getting-Started)
2. [Architecture](#Architecture)
3. [Making Changes](#Making-Changes)
4. [Building & Deployment](#Building--Deployment)

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

- `/environments` contains configuration scripts for setting up different environments for testing, development, prod, etc.

- `/assets` contains all of the image assets we use, as well as the [CornerstoneWADOImageLoader][wado-loader] codec used for parsing and loading DICOM data.

- `/app` contains the root `AppComponent`, as well as folders for any other Angular components, services, or directives that make up the application.

If you are not familiar with the Angular framework and the component model it uses, we recommend reading the following [documentation][ng-components] to get comfortable with all the basic building blocks of an Angular application before continuing on with making changes. Relevant topics include components, templates, styles, directives, modules, data binding, and component interaction.

## Making Changes

In the `/src/app` directory, we can see that our app has a few core pieces:

- `AppComponent`, the root component that embeds the DICOM viewer and handles global hotkeys as well as handing off input images to the viewer for loading.

- `/dragdrop`, which is a custom directive used to handle mouse drag-and-drop events for file input.

- `/info-dialog`, containing the HTML template for the Info (?) modal that can be triggered.

- `/dicom-viewer`, containing the DICOM viewer component that makes up the bulk of our app. Also holds the `cornerstone.directive.ts` file that encapsulates [Cornerstone.js][cornerstone] functionality for use within the component.

We will focus on breaking down the `dicom-viewer` component here, since the other components are relatively straightforward and are sufficiently explained with short descriptions.

### DICOM-Viewer: HTML

Starting in the HTML template, `dicom-viewer.component.html`, notice that the component is made up of a flex container holding three main pieces:

The Thumbnail Selector (left side of the page). This allows the user to select between different 'series', which is a stack of images defining a particular scan where each image is at a different level of depth within the 3D object.

![Thumbnail][thumbnail-img]

The Toolbar, centered at the top of the viewer window, which holds the buttons used to select tools, move through images within the current series, and trigger annotation download. The icons used are sourced from [Font Awesome][font-awesome].

![Toolbar][button-img]

And the Viewer, which displays the current loaded DICOM image and the metadata associated with it.

![Viewer][viewer-img]

### DICOM-Viewer: TypeScript

The TypeScript code for any behavior associated with the `dicom-viewer` component can be found in the `dicom-viewer.component.ts` file. If you're interested in changing the code for the UI surface which allows the user to interact with the Cornerstone instance, this is likely where you want to look.

Additionally, the `cornerstone.directive.ts` file defines a `CornerstoneDirective` that encapsulates behavior from the Cornerstone library for use within this Angular app. If you're interested in changing fundamental Cornerstone behavior and settings, this is likely where you want to look.

Once you've finished modifying and testing, commit and push your changes to the remote repository. Then, open a pull request for your changes to be reviewed and merged into the main branch.

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
[font-awesome]: https://fontawesome.com/icons?d=gallery&p=2
[viewer-img]: https://github.com/umb-deephealth/deephealth-annotate/blob/main/CONTRIBUTING/viewer.png
[button-img]: https://github.com/umb-deephealth/deephealth-annotate/blob/main/CONTRIBUTING/button.png
[thumbnail-img]: https://github.com/umb-deephealth/deephealth-annotate/blob/main/CONTRIBUTING/thumbnailselector.png
<!-- prettier-ignore-end -->
