import fs from 'fs-extra';
import * as path from 'path';

import minimist from 'minimist'
import prompts from 'prompts';
import chalk from "chalk";
import logSymbols from "log-symbols";
import { isEmpty, emptyDir } from './utils/empty'
import { useYarn, packageManager, executeNodeScript } from './utils/utils';
import { createApp } from './utils/create-app';

async function init() {
    console.log()
    const argv = minimist(process.argv.slice(2),{
        alias: {
            typescript: ['ts']
        },
    });
    const { ts } = argv
    const targetDir = argv._[0];
    let result :{
        overwrite?: boolean;
        isCurrentDir?: boolean;
        needsTypeScript?: boolean;
        needsRouter?: boolean;
        needsToolkit?: boolean;
        needsEslint?: boolean;
        needsStylelint?: boolean
    } = {};
    try {
        result = await prompts(
            [
                {
                    name: 'isCurrentDir',
                    type: targetDir ? null : 'confirm',
                    message: 'Create project under current directory?',
                    initial: true,
                },
                {
                    type: (isCurrentDir)=> isCurrentDir ? null: (!fs.existsSync(targetDir) || isEmpty(targetDir)) ? null :'confirm',
                    name:'overwrite',
                    initial: true,
                    message: () => {
                      return targetDir && !fs.existsSync(targetDir) || isEmpty(targetDir) ? 'Current directory' : `Target directory ${targetDir.toLowerCase()} is not empty. Remove existing files and continue?`
                    }
                },
                {
                    name: 'overwriteChecker',
                    type: (overwrite) => {
                        if (overwrite === false) {
                            console.log()
                            console.log(chalk.red(logSymbols.error), chalk.red('Operation cancelled'))
                            process.exit()
                        }
                        return null
                    },
                },
                {
                    name: 'needsTypeScript',
                    type: () => (ts ? null : 'toggle'),
                    message: 'Add TypeScript for Application development?',
                    initial: true,
                    active: 'Yes',
                    inactive: 'No',
                },
                {
                    name: 'needsRouter',
                    type: 'toggle',
                    message: 'Add React Router for Application development?',
                    initial: true,
                    active: 'Yes',
                    inactive: 'No',
                },
                {
                    name: 'needsToolkit',
                    type: 'toggle',
                    message: 'Add React Toolkit for Application development?',
                    initial: true,
                    active: 'Yes',
                    inactive: 'No',
                },
                {
                    name: 'needsEslint',
                    type: 'toggle',
                    message: 'Add ESLint for code quality?',
                    initial: true,
                    active: 'Yes',
                    inactive: 'No',
                },
                {
                    name: 'needsStylelint',
                    type: 'toggle',
                    message: 'Add Stylelint for Scss code quality?',
                    initial: true,
                    active: 'Yes',
                    inactive: 'No',
                },
            ],
            {
                onCancel: () => {
                    console.log()
                    console.log(chalk.red(logSymbols.error) + ' Operation cancelled')
                    process.exit()
                }
            }
        )
    } catch (e :any) {
        throw new Error(e);
    }
    const { overwrite, isCurrentDir } = result;
    const currPath = process.cwd()
    const root = isCurrentDir ? currPath : path.join(currPath, targetDir.toLowerCase());
    if(overwrite) {
        emptyDir(root)
    } else if(!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true })
    }
    console.log();
    console.log(`Creating a new React app in ${chalk.green(root)}.`);
    console.log();
    process.chdir(root);
    const packageJson = {
        name: targetDir || 'React-app',
        version: '0.0.1',
        description: 'React Project'
    };
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
    console.log('Installing packages. This might take a couple of minutes.');
    const args = useYarn ? ['add'] : [ 'install', '--save'];
    const bool = await executeNodeScript(args.concat('esbase-template'))
    if(bool)
    {
        await createApp(process.cwd(),'esbase-template', useYarn, { ts, ...result })
        console.log(`\nDone. Now run:\n`)
        if (root !== currPath) {
            console.log(`  cd ${path.relative(currPath, root)}`)
        }
        console.log(`  ${packageManager} install`)
        console.log(`  ${packageManager} run dev`)
        console.log()
    }
}

init().catch((e) => {
    console.error(e);
})
