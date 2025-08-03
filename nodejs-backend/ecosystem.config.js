const path = require('path');
const cwd = path.basename(path.resolve(process.cwd()));

module.exports = {
    apps: [
        {
            name: 'voucher-redeem-merncp',
            script: 'src/',
            instance_var: 'INSTANCE_ID',
            appendEnvToName: true,
            env_production: {
                NODE_ENV: 'prd'
            },
            env_stg: {
                NODE_ENV: 'stg'
            },
            env_uat: {
                NODE_ENV: 'uat'
            },
            env_sit: {
                NODE_ENV: 'sit'
            }
        }
    ]
};
