import * as fs from 'fs';
import * as path from 'path';
import chalk from "chalk";
import fse from 'fs-extra';
import renderTemplate from "./render-template";

export const  create = async (appPath, templateName)=>{
    const templatePath = path.dirname(
        require.resolve(`${templateName}/package.json`, { paths: [appPath] })
    );
    console.log(templatePath)
    const templateDir = path.join(templatePath, 'template');
    console.log(templateDir,'<__templateDir')
    if (fs.existsSync(templateDir)) {
        await renderTemplate(templateDir, appPath);
        fse.removeSync(path.join(appPath, 'node_modules'));
    } else {
        console.error(
            `Could not locate supplied template: ${chalk.green(templateDir)}`
        );
        return;
    }
}
