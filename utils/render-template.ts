import * as fs from 'fs';
import * as path from 'path';

export default async function renderTemplate(templateDir, root) {
    function copy(src, dest) {
        const stat = fs.statSync(src)
        if (stat.isDirectory()) {
            copyDir(src, dest)
        } else {
            fs.copyFileSync(src, dest)
        }
    }

    function copyDir(srcDir, destDir) {
        fs.mkdirSync(destDir, { recursive: true })
        for (const file of fs.readdirSync(srcDir)) {
            const srcFile = path.resolve(srcDir, file)
            const destFile = path.resolve(destDir, file)
            copy(srcFile, destFile)
        }
    }

    const write = (file) => {
        copy(path.join(templateDir, file), path.join(root, file))
    }

    const files = fs.readdirSync(templateDir)
    for (const file of files) {
        write(file)
    }
}
