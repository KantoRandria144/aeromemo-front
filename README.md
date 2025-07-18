# G.M.P Frontend

**Gestion et Management de Projet**

This repository contains the frontend code for the GMP project.

## Table of Contents

- [About GMP](#about-gmp)
  - [Key Features](#key-features)
  - [Authentication](#authentication)
  - [Activity Tracking](#activity-tracking)
- [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Deployment](#deployment)
- [Installation](#installation)
- [Usage](#usage)
- [How To Deploy](#how-to-deploy)
- [Code Backup](#code-backup)
- [Document](#document)

## About GMP

GMP is a web application designed to help manage projects and activities for Ravinala personnel.

### Key Features

- **Budget Management**: Manage project budgets, including their amounts, unique codes, and the department sources.
- **Resource Management**: Track and organize all the materials required for a project, such as cameras, chairs, and other equipment.
- **Project Phases**: Define and manage the phases of a project. Each project consists of one or multiple phases, which outline the project's progress.
- **Team Management**: Assign roles and manage project teams, including:
  - Project Owners: Responsible for overseeing the project.
  - Team Members: Individuals tasked with executing the project.
  - Observers: Users who can monitor the project's progress.

### Authentication

Access to GMP requires Active Directory credentials. Use your Ravinala account in the format `your-matricule@ravinala-airports.aero` along with your Active Directory password to log in.

### Activity Tracking

With GMP, you can also manage individual activities, such as:

- **Intercontract**: Non-project-related activities or idle periods where no project work is performed.
- **Transverse Activities**: Tasks that may or may not be project-related, such as meetings, onboarding sessions, or training.

These features help track the time spent on various activities and ensure efficient management of resources and personnel.

## Prerequisites

### Local Development

To run the application locally, you need:

- **Node.js**: Version `v20.15.1` or compatible
- **npm**: Usually comes with Node.js installation
- **Modern web browser**: Chrome, Firefox, Edge, or Safari

### Deployment

For deployment to production environments, if you use IIS server, ensure you have:

- **Node.js**: Version `v20.15.1` or compatible
- **Url rewrite iis** [Download here](https://www.iis.net/downloads/microsoft/url-rewrite)
- **IIS Cors** [Download here](https://www.iis.net/downloads/microsoft/iis-cors-module)

## Installation

To set up the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd gmp-frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and set `VITE_API_ENDPOINT` to match your backend API endpoint.
   it will copy what inside .env.example file to your .env file

## Usage

To start the development server:

```bash
npm run dev
```

To build the project for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## How To Deploy

- Make sure that your environnement variables in `.env` match the IP in production. Change if that's not the case.
- run the command

```bash
npm run build
```
-
- copy the dist file in the gmp-front via ftp

* The identifiants for FTP are :
  - Protocole de fichier : FTP
  - Nom d'hôte : 10.0.180.37
  - Port : 21
  - Nom d'utilisateur : gmpfront
  - Mot de passe : gmp

**NB** DON'T ERASE THE `web.config` file

- If you erase the `web.config` file just create the `web.config` file and put this inside

```xml
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>

```

## Code Backup

- Remember to always save a backup after each modification. There must be `6 version `of the code from `v5` to `v0`.
- The V0 is the version that is actually in production and the V1 is the version before it.
- A backup folder contain both the `publish` compressed folder from backend and `dist` compressed folder from frontend.
- Actually all V0 to V5 is stored on the front end but it need another ftp to store it later.

## Document

- All document related to GMP are stored in the `data` folder.
- The document include the early Needs Study Document, Feasibility Study Document, Constraints documents, notifications documents. 
