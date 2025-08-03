const {
    AuthenticationService,
    JWTStrategy
} = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

// Custom Authentication Service that adds status field
class CustomAuthenticationService extends AuthenticationService {
    async getEntityData(entity, params) {
        const baseData = await super.getEntityData(entity, params);
        
        // Add status field for admin authentication
        return {
            ...baseData,
            status: true // Always true for authenticated users
        };
    }
}

module.exports = (app) => {
    const authentication = new CustomAuthenticationService(app);

    authentication.register('jwt', new JWTStrategy());
    authentication.register('local', new LocalStrategy());

    app.use('/authentication', authentication);
    app.configure(expressOauth());
};
