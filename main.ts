import fs from 'fs-extra'
import * as path from 'path';

import minimist from 'minimist'
import prompts from 'prompts';
import chalk from "chalk";
import logSymbols from "log-symbols";
import { isEmpty, emptyDir } from './utils/empty'
import { packageManager, executeNodeScript } from './utils/utils';
import { createApp } from './utils/create-app'

async function init() {
    const argv = minimist(process.argv.slice(2),{
        alias: {
            template: ['tmp']
        },
        default: {
            template: 'js'
        }
    });
    const template = argv['template']
    const targetDir = argv._[0];
    console.log();
    let result :{
        overwrite?: boolean;
        isCurrentDir?: boolean;
    } = {};
    try {
        result = await prompts(
            [
                {
                    name: 'isCurrentDir',
                    type: targetDir ? null : 'confirm',
                    message: 'Create project under current directory?',
                },
                {
                    type: (isCurrentDir)=> isCurrentDir ? null: (!fs.existsSync(targetDir) || isEmpty(targetDir)) ? null :'confirm',
                    name:'overwrite',
                    message: () => {
                      return targetDir && !fs.existsSync(targetDir) || isEmpty(targetDir) ? 'Current directory' : `Target directory ${targetDir.toLowerCase()} is not empty. Remove existing files and continue?`
                    }
                },
                {
                    name: 'overwriteChecker',
                    type: (overwrite) => {
                        if (overwrite === false) {
                            console.log(logSymbols.error,chalk.bold.red('Operation cancelled'))
                            process.exit()
                        }
                        return null
                    },
                },
            ]
        )
    } catch (e) {
        console.log(e)
        process.exit(1);
    }
    const { overwrite, isCurrentDir } = result;
    const currPath = process.cwd()
    const root = isCurrentDir ? currPath : path.join(currPath, targetDir.toLowerCase());
    const appName = path.basename(root);
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
        name: appName,
        version: '0.0.1',
    };
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
    console.log('Installing packages. This might take a couple of minutes.');
    console.log()
    const bool = await executeNodeScript('npm',[
        'install',
        '--no-audit',
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
    ].concat(`esbase-template-${template}`))
    if(bool)
    {
        await createApp(process.cwd(),`esbase-template-javascript`)
    }
    console.log(`\nDone. Now run:\n`)
    if (root !== currPath) {
        console.log(`  cd ${path.relative(currPath, root)}`)
    }
    console.log(`  ${packageManager} install`)
    console.log(`  ${packageManager} run dev`)
    console.log()
}

init().catch((e) => {
    console.error(e);
})
