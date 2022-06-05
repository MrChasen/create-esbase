import * as fs from 'fs';
import * as path from 'path';

import minimist from 'minimist'
import prompts from 'prompts';
import chalk from "chalk";
import logSymbols from "log-symbols";
// import spawn from "cross-spawn";
import { isEmpty, emptyDir } from './utils/empty'
import renderTemplate from './utils/render-template';

// function executeNodeScript(cmd, data: string[]) {
//     return new Promise((resolve,reject) => {
//         const child = spawn(cmd, data, { stdio: 'inherit' });
//         child.on('close', code => {
//             if (code !== 0) {
//                 reject({
//                     command: `${cmd} ${data.join(' ')}`,
//                 });
//                 return;
//             }
//             resolve(111);
//         });
//     })
//
// }

async function init() {
    const currPath = process.cwd();
    const argv = minimist(process.argv.slice(2));
    let targetDir = argv._[0];
    const defaultProjectName = !targetDir ? 'React-Project' : targetDir

    // console.log(process.execPath,'<___666666')
    // const bool = await executeNodeScript('npm',[
    //     'install',
    //     '--no-audit',
    //     '--save',
    //     '--save-exact',
    //     '--loglevel',
    //     'error',
    // ].concat('esbase-template'))
    // console.log(bool,'<___bool')
    // if(bool)
    // {
    //     process.exit(0)
    // }

    let result :{
        overwrite?: boolean;
        template?: string
    } = {};

    try {
        result = await prompts(
            [
                {
                    name: 'projectName',
                    type: targetDir ? null : 'text',
                    message: 'Project name:',
                    initial: defaultProjectName,
                    onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
                },
                {
                    type: () => {
                        return !fs.existsSync(targetDir) || isEmpty(targetDir) ? null :'confirm'
                    },
                    name:'overwrite',
                    message: () => !fs.existsSync(targetDir) || isEmpty(targetDir) ? 'Current directory' : `Target directory ${targetDir.toLowerCase()} is not empty. Remove existing files and continue?`
                },
                {
                    type: (overwrite) => {
                        if (overwrite === false) {
                            console.log(logSymbols.error,chalk.bold.red('Operation cancelled'))
                            process.exit()
                        }
                        return null
                    },
                    name: 'overwriteChecker'
                },
                {
                    type: 'select',
                    name: 'template',
                    message: 'Select Typescript or Javascript for your React Project',
                    choices: [
                        {
                            value: 'js',
                            name: 'js'
                        },
                        {
                            value: 'ts',
                            name: 'ts'
                        }
                    ]
                },
            ]
        )
    } catch (e :any) {
        console.log(e)
        process.exit(1);
    }
    const { overwrite, template } = result;
    const root = path.join(currPath, targetDir.toLowerCase());
    if(overwrite) {
        emptyDir(root)
    } else if(!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true })
    }

    const templateDir = path.resolve(__dirname, './package', `esbase-template-${template}`)

    renderTemplate(templateDir, root);

    const userAgent = process.env.npm_config_user_agent || ''
    const packageManager = /yarn/.test(userAgent) ? 'yarn' : 'npm'

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
