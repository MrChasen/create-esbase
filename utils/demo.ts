import * as path from 'path';

export const create = (appPath, templateName)=>{
    console.log(666666)
    const templatePath = path.dirname(
        require.resolve(`${templateName}/package.json`, { paths: [appPath] })
    );
    console.log(templatePath)
}
