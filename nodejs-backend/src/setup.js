const fs = require('fs');
const fileFolder = './src/resources';
const codeGen = require('./utils/codegen');
const _ = require('lodash');
const initializeDatabase = require('./setup/init-database');

// Your setup function
module.exports = (app) => {
    initializeSuperUser(app);
    insertRefData(app);
    initializeVoucherDatabase(app);
    console.log('Setup completed.');
};

const initializeVoucherDatabase = async (app) => {
    try {
        // Check if database is already initialized
        const existingCategories = await app.service('catergory').find({
            query: { $limit: 1 }
        });

        if (existingCategories.data.length === 0) {
            console.log('🔄 Initializing voucher database...');
            await initializeDatabase();
            console.log('✅ Voucher database initialization completed');
        } else {
            console.log('✅ Voucher database already initialized');
        }
    } catch (error) {
        console.error('❌ Error initializing voucher database:', error);
    }
};

const initializeSuperUser = (app) => {
    const userEmail = ['danielhzq@gmail.com'];
    app.service('userInvites')
        .find({
            query: {
                emailToInvite: { $in: userEmail }
            }
        })
        .then(async (getUserEmail) => {
            if (getUserEmail.data.length === 0) {
                await app.service('userInvites').create(
                    userEmail.map((user) => {
                        return {
                            emailToInvite: user,
                            status: false,
                            sendMailCounter: 0,
                            code: codeGen()
                        };
                    })
                );
                console.debug(`user invite for ${userEmail} created.`);
            }
        });
};

const insertRefData = (app) => {
    let files = fs.readdirSync(fileFolder);
    files = files.filter(
        (file) => !['config.json', 'standard.json'].includes(file)
    );
    files = files.sort((a, b) => b.localeCompare(a));

    const promises = [];
    const services = [];
    const results = [];

    files.forEach((file) => {
        const names = file.split('.');
        const service = _.camelCase(names[1]);
        const existing = app.service(service).find({});
        promises.push(existing);
        services.push(service);
    });
    if (_.isEmpty(services)) return;
    Promise.all(promises).then(async (allData) => {
        try {
            services.forEach((service, i) => {
                const _results = insertData(
                    app,
                    allData[i].data,
                    files[i],
                    service
                );
                if (!_.isEmpty(_results)) results.push(_results);
            });
            if (!_.isEmpty(results)) {
                await Promise.all(results);
                console.debug(
                    'reference data setup is completed successfully.'
                );
            }
        } catch (error) {
            console.error(error.message);
        }
    });
};

const insertData = (app, existing, file, service) => {
    const dataNew = require(`./resources/${file}`);
    const existingNames = existing.map((t) => t.name);
    const inserts = [];
    if (dataNew.length === 0) return;
    dataNew.forEach((n) => {
        if (!existingNames.includes(n.name)) {
            const temp = n;
            delete temp._id;
            delete temp.__v;
            delete temp.createdAt;
            delete temp.updatedAt;
            inserts.push(temp);
        }
    });
    if (!_.isEmpty(inserts)) {
        return [app.service(service).create(inserts)];
    } else return [];
};
