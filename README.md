# IMPORTANT

With the disbanding of the FastTrack for Azure program, this repository is being archived.

# FTA as a Service (fta-aas)

This is the home for https://aka.ms/ftaaas, the self-service tool for Azure Design Reviews!

This is a tool in which the engineers from the Microsoft FastTrack for Azure organization have documented hundreds of best practices across different technologies so that anybody can benefit from them.

If you have any suggestion for any of the checklist items, please raise an issue in the [Azure Review Checklist GitHub repository](http://github.com/Azure/review-checklists).

If you would like to get assistance for your Azure project, check out [FastTrack for Azure](https://azure.microsoft.com/programs/azure-fasttrack/).

## Application Environments

| Environment | Status | Website URL |
|:--|:--|:--|
| staging | [![Deploy React App](https://github.com/Azure/fta-aas/actions/workflows/cd.yml/badge.svg?branch=main)](https://github.com/Azure/fta-aas/actions/workflows/cd.yml) | [stgazcheckliststg.z16.web.core.windows.net](https://stgazcheckliststg.z16.web.core.windows.net/) |
| production | [![Deploy React App](https://github.com/Azure/fta-aas/actions/workflows/cd.yml/badge.svg?branch=main)](https://github.com/Azure/fta-aas/actions/workflows/cd.yml) | [stgazchecklistprd.z16.web.core.windows.net](https://stgazchecklistprd.z16.web.core.windows.net/) |

## GitHub Actions

| Name | Status | GH Action | Description |
|:--|:--|:--|:--|
| Build React App | [![Build React App](https://github.com/Azure/fta-aas/actions/workflows/ci.yml/badge.svg)](https://github.com/Azure/fta-aas/actions/workflows/ci.yml) | [ci.yaml](./.github/workflows/ci.yml) | Triggered when a new PR is created against the **main** branch. It builds the react app and runs the tests. |
| Deploy React App | [![Deploy React App](https://github.com/Azure/fta-aas/actions/workflows/cd.yml/badge.svg?branch=main)](https://github.com/Azure/fta-aas/actions/workflows/cd.yml) | [cd.yaml](./.github/workflows/cd.yml) | Triggered whenever a push is made in the **main** branch (i.e., PR is merged). It builds the react app and then it deploys it in a static website of a storage account inside the **staging** environment. After the deployment in the **staging** environment is complete and the changes have been successfully reviewed and validated, a manual approval will be needed for the same GH action to deploy the react app in the **production** environment. |
| Detect Infrastructure Drift | [![Detect Infrastructure Drift](https://github.com/Azure/fta-aas/actions/workflows/detect-drift.yml/badge.svg)](https://github.com/Azure/fta-aas/actions/workflows/detect-drift.yml) | [detect-drift.yml](./.github/workflows/detect-drift.yml) | Triggered when a new PR is created against the **main**, only when it contains changes in any *.bicep file. It detects infrastructure drift in the target environments (**staging** and **production**), running a --what-if deployment. |
| Provision Infrastructure | [![Provision Infrastructure](https://github.com/Azure/fta-aas/actions/workflows/iac.yml/badge.svg?branch=main)](https://github.com/Azure/fta-aas/actions/workflows/iac.yml) | [iac.yaml](./.github/workflows/iac.yml) | Triggered whenever a push is made in the **main** branch (i.e., PR is merged), only when it contains changes in any *.bicep file. Provisions the infrastructure (storage account, app insights resource and enabling the static website) in the **staging** environment. After the deployment in the **staging** environment is complete and the changes have been successfully reviewed and validated, a manual approval will be needed for the same GH action to provision the infrastructure needed for the react app in the **production** environment. |

# Getting Started with Create React App and Fluent UI

This is a [Create React App](https://github.com/facebook/create-react-app) based repo that comes with Fluent UI pre-installed!

## Available Scripts

In the project directory, you can run:

### `npm install`

This is the first step you should execute to download all dependencies. Usually you only need to run this command once.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build --configuration production`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Project

> This repo has been populated by an initial template to help get you started. Please
> make sure to update the content to build a great experience for community-building.

As the maintainer of this project, please make a few updates:

- Improving this README.MD file to provide a great experience
- Updating SUPPORT.MD with content about this project's support experience
- Understanding the security reporting process in SECURITY.MD
- Remove this section from the README

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
