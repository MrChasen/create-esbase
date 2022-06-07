import * as fs from 'fs';
import * as path from 'path';

export const create = (appPath, templateName)=>{
    const templatePath = path.dirname(
        require.resolve(`${templateName}/package.json`, { paths: [appPath] })
    );
    console.log(templatePath)
    const packageJsonPath = path.join(templatePath, 'template/package.json');
    let packageJson = {}
    if (fs.existsSync(packageJsonPath)) {
        packageJson = require(packageJsonPath);
    }
    console.log(packageJson, '<---packageJson')
}
