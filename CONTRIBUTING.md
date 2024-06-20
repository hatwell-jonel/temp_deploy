# Contributing Guide

Thank you for investing your time in contributing to our project! Any contribution you make will be reflected on this repository.

In this guide you will get an overview of the contribution workflow from creating a PR, reviewing, and merging the PR.

## Getting started

### Clone the project

Go to the [this repository](https://bitbucket.org/capexcargo/cis-v3-accounting/src/main/) and click clone button

Paste it into your terminal, hit enter and finally: 

```shell
cd cis-v3-accounting
```

### Install dependencies

Install the project dependencies:

```shell
pnpm install
```

### Adding environment variables

Duplicate `.env.example` as another file named `.env`. If some values are missing, go ask the main contributors.

### Create a branch

Create and check out your feature branch:

```shell
git checkout -b my-new-feature
```

### Make changes locally

Make your changes to the codebase.

### Commit your changes

Commit your changes:

```shell
git add .
git commit -m 'Add some feature'
```

### Push your changes

Push your changes to your fork:

```shell
git push -u origin my-new-feature
```

### Create a pull request

When you're finished with the changes, create a pull request, also known as a PR. 

- [Click this to create a new one](https://bitbucket.org/capexcargo/cis-v3-accounting/pull-requests/new)
- Change the source branch to `my-new-feature` and change the destination branch into `staging`.
- Don't create a PR against `main` unless you're shipping changes for production.

### Merging PR

When you're done with creating PR, either you merge it instantaneously or wait for the reviewer to review first and let them merge.

### Your PR is merged

Congratulations! The Team thanks you!

Once your PR is merged, your contributions will be publicly visible on the repository.

### Credits

This Contributing Guide is adapted from [GitHub docs contributing guide](https://github.com/github/docs/blob/main/CONTRIBUTING.md?plain=1).