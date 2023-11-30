# Your Profile Page - GraphQL Learning Project

This project aims to create a personalized profile page using GraphQL to query user-specific data from the platform's provided GraphQL endpoint. The profile includes various sections displaying user information fetched via GraphQL queries and visualizations of statistics using SVG-generated graphs.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Login](#login)
- [Statistics Graphs](#statistics-graphs)
- [Hosting](#hosting)
- [Contributors](#contributors)

## Overview

The objective of this project is to leverage GraphQL for querying user-specific data and to design a profile page with customizable sections, displaying personal information obtained from the GraphQL endpoint.

## Features

- **Profile Information**: Basic user identification, XP amount, audits.
- **Statistical Graphs**: SVG-generated graphs displaying different statistics, such as XP earned over time and audit ratio.
- **Login and Authentication**: Sign in functionality using credentials (username:password or email:password), JWT authentication, and error handling for invalid credentials.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/h2ving/graphql.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

To use this project you need to install the liveserver extension for vscode and run the live server in cloned repository.

## Login

To access user-specific data via GraphQL queries, users must authenticate using the login page. Both username:password and email:password credentials are supported. Invalid credentials will prompt an error message.

You'll need a JWT to access the GraphQL API. A JWT can be obtained from the signin endpoint (<https://01.kood.tech/api/auth/signin>).

## Statistics Graphs

The profile page includes at least two SVG-based statistical graphs displaying various metrics like XP earned over time, project PASS and FAIL ratio, audit ratio, etc. Users can interact with these graphs to visualize their progress and achievements.

## Hosting

The profile page will be hosted on GitHub Pages

## Contributors

h2ving (<https://github.com/h2ving>).
