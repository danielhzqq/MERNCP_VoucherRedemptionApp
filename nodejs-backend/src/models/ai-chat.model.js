module.exports = function (app) {
  const modelName = "ai-chat";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      topic: {
        type: String,
        required: true,
        enum: ['customer', 'voucher', 'admin', 'general'],
        default: 'general'
      },
      message: {
        type: String,
        required: true,
        maxLength: 2000,
        trim: true
      },
      response: {
        type: String,
        required: false,
        maxLength: 5000,
        trim: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false
      },
      sessionId: {
        type: String,
        required: false,
        trim: true
      },
      metadata: {
        type: Schema.Types.Mixed,
        required: false
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false
      }
    },
    {
      timestamps: true
    }
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
}; 