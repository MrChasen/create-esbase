import fs from 'fs-extra'

export default function clean(appPath) {
    fs.remove(appPath)
}
