#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import chalk from 'chalk';
import pkgDir from 'pkg-dir';  // Used to find the package directory

// Find the root directory of the current project
const packageDir = pkgDir.sync(process.cwd()); // Finds the root of the current package

if (!packageDir) {
  console.log(chalk.red("Could not find the package directory."));
  process.exit(1);  // Exit if package directory is not found
}

// Define the path to the templates folder inside the project-spark package
const templatesDir = path.join(packageDir, 'node_modules', 'project-spark', 'templates');

// Check if the templates directory exists
if (!fs.existsSync(templatesDir)) {
  console.log(chalk.red("Templates directory not found in the package. Please make sure your package is correctly installed."));
  process.exit(1);
}

async function setupProject() {
  // Get the list of available templates (subdirectories in the templates folder)
  const templates = fs.readdirSync(templatesDir).filter((file) => {
    const templatePath = path.join(templatesDir, file);
    return fs.statSync(templatePath).isDirectory();
  });

  // Check if templates are available
  if (templates.length === 0) {
    console.log(chalk.red("No templates found in the 'templates' directory."));
    return;
  }

  // Prompt the user to select a template
  const { templateName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateName',
      message: 'Choose a template for your new project:',
      choices: templates,
    },
  ]);

  // Function to validate project name
  function validateProjectName(name) {
    const regex = /^[a-z0-9-]+$/; // Only allow lowercase letters, numbers, and dashes
    if (!regex.test(name)) {
      return 'Project name must be lowercase letters, numbers, and dashes only.';
    }
    return true;
  }

  // Prompt the user for the new project name
  let projectName;
  while (true) {
    const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter your new project name:',
        validate: validateProjectName,
      },
    ]);
    projectName = response.projectName;

    // Check if the project name already exists in the current directory
    if (fs.existsSync(path.join(process.cwd(), projectName))) {
      console.log(chalk.red(`A project with the name "${projectName}" already exists. Please choose a different name.`));
    } else {
      break; // Exit loop if valid and unique name is provided
    }
  }

  // Define the path of the selected template directory
  const selectedTemplateDir = path.join(templatesDir, templateName);
  const projectDir = path.join(process.cwd(), projectName);
  fs.mkdirSync(projectDir, { recursive: true });

  // Function to copy files and replace placeholders
  function copyAndReplace(filePath) {
    const relativePath = path.relative(selectedTemplateDir, filePath);
    const destPath = path.join(projectDir, relativePath);
    const isDirectory = fs.lstatSync(filePath).isDirectory();

    if (isDirectory) {
      fs.mkdirSync(destPath, { recursive: true });
      fs.readdirSync(filePath).forEach(child =>
        copyAndReplace(path.join(filePath, child))
      );
    } else {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/{{projectName}}/g, projectName); // Replace projectName placeholder
      fs.writeFileSync(destPath, content, 'utf8');
    }
  }

  // Start copying files from the selected template directory to the project directory
  copyAndReplace(selectedTemplateDir);

  // Create the .env file from the .env.sample file if it exists
  const envSamplePath = path.join(selectedTemplateDir, '.env.sample');
  const envFilePath = path.join(projectDir, '.env');
  if (fs.existsSync(envSamplePath)) {
    fs.copyFileSync(envSamplePath, envFilePath);
  }

  // Update the package.json file in the new project directory, if it exists
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName; // Set the name field to the user-provided project name
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8'); // Write back to package.json
  } else {
    console.log(chalk.yellow('Warning: No package.json found in the template folder.'));
  }

  // Install dependencies in the new project directory
  console.log(chalk.blue(`Installing dependencies for ${projectName}...`));
  execSync('npm install', {
    cwd: path.join(projectDir),
    stdio: 'inherit',
  });

  console.log(chalk.green(`Project setup complete!`));
  console.log(chalk.cyan(`Your new project is located in: ${projectDir}`));
  console.log(chalk.yellow(`\nTo start your project, run the following commands:`));
  console.log(chalk.yellow(`cd ${projectName}`));
  console.log(chalk.yellow(`npm run start:dev`));
}

// Run the setup function
setupProject();
