
## Introduction to `project-spark`

Welcome to the `project-spark` setup guide! This tool is designed to quickly generate a new NestJS project from predefined templates. By following the steps below, you'll be able to create and run a new project with ease, saving you time on initial setup.

The guide walks you through the process, from cloning the repository to running your new project locally. Whether you're building an API or starting a new NestJS project, `project-spark` simplifies the process and helps you get up and running quickly.

Let's dive into the steps to set up `project-spark` and start building your new project!


## Using NPM
Install package \`project-spark\` globally using npm 

```
npm install -g project-spark
```

Run project generation command

```
project-spark
```

Follow step 6 to 10 


## Locally

#### Step 1: Clone the Repository

Clone the \`project-spark\` repository to your local machine:

```
git clone git@github.com:utdevnp/project-spark.git
```

#### Step 2: Go to the Project Folder

Navigate to the cloned project directory:

```
cd project-spark
```

#### Step 3: Install Dependencies

Run the following command to install the required dependencies:

```
npm install
```

#### Step 4: Link the Package

Link the package globally using \`npm link\`:

```
npm link
```

#### Step 5: Create a New Project

Run the following command to create a new project:

```
project-spark
```

#### Step 6: Choose a Template

The CLI will prompt you to choose a template. By default, we have one template called \`api\`. Press **Enter** to choose the \`api\` template.

#### Step 7: Name the Project

Next, it will ask you to provide a name for your new project. For example, enter \`my-new-project\`:

```
Enter project name: my-new-project
```

After pressing **Enter**, the project will be created, and dependencies will be installed. 

#### Step 8: Go to the New Project Directory

Navigate to the folder of the newly created project:

```
cd my-new-project
```

#### Step 9: Run the Project

Run the following command to start the project using Docker Compose:

```
npm run start:dev
```

#### Step 10: Access the Project

Open your browser and go to` http://localhost:3000` to see the project running!

Done.

HAPPY COADING ...

 