# Your Profile Page - GraphQL

This project aims to create a personalized profile page using GraphQL to query user-specific data from the 01.kood.tech platform's provided GraphQL endpoint. The profile includes various sections displaying user information fetched via GraphQL queries and visualizations of statistics using SVG-generated graphs.

## Table of Contents

- [Auditing](#auditing)
- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
- [Login](#login)
- [Statistics Graphs](#statistics-graphs)
- [Hosting](#hosting)
- [Contributors](#contributors)

## Auditing

To audit the project head over to <https://h2ving.github.io/graphql/static/> and log in with your 01.kood.tech credentials.

## Overview

The objective of this project is to leverage GraphQL for querying user-specific data and to design a profile page with customizable sections, displaying personal information obtained from the GraphQL endpoint.

## Features

- **Profile Information**: Basic user identification, XP amount, audits.
- **Statistical Graphs**: SVG-generated graphs displaying different statistics, such as XP earned over time and audit ratio.
- **Login and Authentication**: Sign in functionality using credentials (username:password or email:password), JWT authentication, and error handling for invalid credentials.

## Usage

To run this project locally you need to serve index.html file on a server. For example install the liveserver extension for vscode and run the live server in the cloned repository directory.

## Login

To access user-specific data via GraphQL queries, users must authenticate using the login page. Both username:password and email:password credentials are supported. Invalid credentials will prompt an error message.

You'll need a JWT to access the GraphQL API. A JWT can be obtained from the signin endpoint (<https://01.kood.tech/api/auth/signin>).

## Statistics Graphs

The profile page includes two SVG-based statistical graphs displaying metrics like XP earned over time and audit ratio. Users can interact with these graphs to visualize their progress and achievements.

## Hosting

The profile page will be hosted on GitHub Pages at <https://h2ving.github.io/graphql/static/>

## Contributors

h2ving (<https://github.com/h2ving>).
