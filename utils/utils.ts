import spawn from "cross-spawn";

const userAgent = process.env.npm_config_user_agent || ''
export const useYarn = /yarn/.test(userAgent)
export const packageManager = /yarn/.test(userAgent) ? 'yarn' : 'npm'

export function executeNodeScript(data: string[]) {
    const command = useYarn ? 'yarnpkg' : 'npm';
    return new Promise((resolve,reject) => {
        const child = spawn(command, data, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${data.join(' ')}`,
                });
                return;
            }
            resolve(true);
        });
    })
}
