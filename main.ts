import * as fs from 'fs';
import * as path from 'path';

import minimist from 'minimist'
import prompts from 'prompts';
import chalk from "chalk";
import logSymbols from "log-symbols";
import { isEmpty, emptyDir } from './utils/empty'
import { packageManager, executeNodeScript } from './utils/utils';
import { create } from './utils/demo'

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
    console.log(template, targetDir, '<---template, targetDir')
    let result :{
        overwrite?: boolean;
    } = {};
    return
    try {
        result = await prompts(
            [
                {
                    name: 'projectName',
                    type: targetDir ? null : 'confirm',
                    message: 'Create project under current directory?',
                },
                {
                    type: () => {
                        return !fs.existsSync(targetDir) || isEmpty(targetDir) ? null :'confirm'
                    },
                    name:'overwrite',
                    message: () => !fs.existsSync(targetDir) || isEmpty(targetDir) ? 'Current directory' : `Target directory ${targetDir.toLowerCase()} is not empty. Remove existing files and continue?`
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
    } catch (e :any) {
        console.log(e)
        process.exit(1);
    }
    const { overwrite } = result;
    return
    const currPath = process.cwd()
    const root = path.join(currPath, targetDir.toLowerCase());
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
        version: '0.1.0',
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
        await create(process.cwd(),`esbase-template-javascript`)
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
