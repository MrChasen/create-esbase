import spawn from "cross-spawn";


const userAgent = process.env.npm_config_user_agent || ''
export const packageManager = /yarn/.test(userAgent) ? 'yarn' : 'npm'

export function executeNodeScript(cmd, data: string[]) {
    return new Promise((resolve,reject) => {
        const child = spawn(cmd, data, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${cmd} ${data.join(' ')}`,
                });
                return;
            }
            resolve(111);
        });
    })
}
