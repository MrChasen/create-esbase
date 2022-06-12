import * as path from 'path';
import spawn from 'cross-spawn'
import chalk from "chalk";
import fs from 'fs-extra';

export const  createApp = async (appPath, templateName, useYarn, options = {},)=>{
    const templatePath = path.dirname(
        require.resolve(`${templateName}/package.json`, { paths: [appPath] })
    );
    const templateDir = path.join(templatePath, 'template');
    if (fs.existsSync(templateDir)) {
        await require(path.join(templatePath, 'scripts/create'))(appPath, options)
    } else {
        console.error(
            `Could not locate supplied template: ${chalk.red(templateDir)}`
        );
        return;
    }
    let command;
    let remove;
    let args;
    if (useYarn) {
        command = 'yarnpkg';
        remove = 'remove';
        args = ['add'];
    } else {
        command = 'npm';
        remove = 'uninstall';
        args = [
            'install',
            '--save',
        ]
    }
    if (templateName) {
        console.log();
        console.log(`Installing template dependencies using ${command}...`);
        const proc = spawn.sync(command, args, { stdio: 'inherit' });
        if (proc.status !== 0) {
            console.error(`\`${command} ${args.join(' ')}\` failed`);
            return;
        }
    }
    console.log(`Removing template package using ${command}...`);
    const proc = spawn.sync(command, [remove, templateName], {
        stdio: 'inherit',
    });
    if (proc.status !== 0) {
        console.error(`\`${command} ${args.join(' ')}\` failed`);
        return;
    }
}
