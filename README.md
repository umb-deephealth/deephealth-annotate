<!-- prettier-ignore-start -->
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg?label=License)](http://opensource.org/licenses/MIT)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![Contributors](https://img.shields.io/badge/All_Contributors-6-blue.svg?style=flat)](#contributors)
[![CodeQL](https://github.com/umb-deephealth/deephealth-annotate/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/umb-deephealth/deephealth-annotate/actions/workflows/codeql-analysis.yml)
[![Build](https://img.shields.io/github/deployments/umb-deephealth/deephealth-annotate/github-pages?label=Build)][deephealth-annotate]
<!-- prettier-ignore-end -->

# DeepHealth Annotate

[DeepHealth Annotate][deephealth-annotate] is a web-based tool for viewing and annotating DICOM images.

Viewer tools are provided to adjust windowing (brightness/contrast), zoom, invert, and panning of the image.

Annotation tools are provided for marking images with either Rectangles or Length measurements. These annotations are defined by their bounding (x,y) coordinates as well as some other metadata (units such as "mm" in the case of line Length annotations, for example).

All annotation metadata can be exported in JSON format to be used for a variety of purposes, such as training input for [deep learning models][deephealth-paper] using bounding box algorithms. The downloaded JSON files can also be later used to restore any annotation state stored in them by simply dragging and dropping the relevant JSON file onto the viewer while the images are loaded.

To get started, follow the link above to go to the application, then click the "Choose DICOM Files" button in the top-right corner of the page and select all desired DICOM files from your local machine to load them into the viewer, or simply drag and drop the files onto the window.

For further help with application usage, consult the Info menu within the app by clicking on the (?) icon in the top-right corner of the page.

## Contributors

Thanks to all of our contributors:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/3970591?s=400&u=0d0412c4664fd9fdd4ad6acf6d7efc35e20b09e4&v=4" width="100px;" alt="Ryan Dern"/><br /><sub><b>Ryan Dern</b></sub>](https://github.com/RMDern)<br />[💻](https://github.com/RMDern "GitHub") [💼](https://www.linkedin.com/in/rdern/ "LinkedIn") | [<img src="https://avatars.githubusercontent.com/u/31746926?v=4" width="100px;" alt="Ayah Aboelela"/><br /><sub><b>Ayah Aboelela</b></sub>](https://github.com/ayahea)<br />[💻](https://github.com/ayahea "GitHub") [💼](https://www.linkedin.com/in/ayah-aboelela-4b88b8152/ "LinkedIn") | [<img src="https://avatars.githubusercontent.com/u/79118882?v=4" width="100px;" alt="Sahmeer Odies"/><br /><sub><b>Sahmeer Odies</b></sub>](https://github.com/SahmeerOdies)<br />[💻](https://github.com/SahmeerOdies "GitHub") [💼](https://www.linkedin.com/in/sahmeerodies/ "LinkedIn") | [<img src="https://avatars.githubusercontent.com/u/50211940?v=4" width="100px;" alt="Alvin Lam"/><br /><sub><b>Alvin Lam</b></sub>](https://github.com/alvin688)<br />[💻](https://github.com/alvin688 "GitHub") [💼](https://www.linkedin.com/in/alvin-lam-341692171/ "LinkedIn") | [<img src="https://avatars.githubusercontent.com/u/33044191?v=4" width="100px;" alt="Rob Steele"/><br /><sub><b>Rob Steele</b></sub>](https://github.com/RWadeS)<br />[💻](https://github.com/RWadeS "GitHub") [💼](https://www.linkedin.com/in/robert-steele/ "LinkedIn") | [<img src="https://avatars.githubusercontent.com/u/36428213?v=4" width="100px;" alt="Freddy Mansour"/><br /><sub><b>Freddy Mansour</b></sub>](https://github.com/fmansour10)<br />[💻](https://github.com/fmansour10 "GitHub") [💼](https://www.linkedin.com/in/freddymansour/ "LinkedIn")
| :---: | :---: | :---: | :---: | :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

_Note: This project follows the [all-contributors][all-contributors] specification._

## Contributing

Documentation describing the general architecture, examples of how to make changes, as well as how to run, build, and deploy the application can be found [here][contributing-md].

## License

[MIT](LICENSE)

<!-- prettier-ignore-start -->
[deephealth-annotate]: https://umb-deephealth.github.io/deephealth-annotate/
[all-contributors]: https://github.com/kentcdodds/all-contributors
[contributing-md]: https://github.com/umb-deephealth/deephealth-annotate/blob/main/CONTRIBUTING/CONTRIBUTING.md
[deephealth-paper]: https://arxiv.org/pdf/1912.11027.pdf
<!-- prettier-ignore-end -->
