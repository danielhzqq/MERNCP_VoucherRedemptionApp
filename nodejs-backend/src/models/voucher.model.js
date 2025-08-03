
    module.exports = function (app) {
        const modelName = 'voucher';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            categoryId: { 
              type: Schema.Types.ObjectId, 
              ref: "catergory", 
              required: true 
            },
            points: { 
              type: Number, 
              required: true,
              min: 0,
              max: 999999999,
            },
            title: { 
              type: String, 
              required: true,
              maxLength: 200,
              trim: true,
            },
            image: { 
              type: String, 
              required: true,
              maxLength: 500,
              trim: true,
            },
            description: { 
              type: String, 
              required: true,
              maxLength: 1000,
              trim: true,
            },
            termsAndCondition: { 
              type: String, 
              required: true,
              maxLength: 2000,
              trim: true,
            },
            isLatest: { 
              type: Boolean, 
              required: false,
              default: false,
            },
            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: false }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };