
    module.exports = function (app) {
        const modelName = 'cartitems';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            voucherId: { 
              type: Schema.Types.ObjectId, 
              ref: "voucher", 
              required: true 
            },
            userId: { 
              type: Schema.Types.ObjectId, 
              ref: "users", 
              required: true 
            },
            quantity: { 
              type: Number, 
              required: true,
              min: 1,
              max: 100,
              default: 1,
            },
            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };