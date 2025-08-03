module.exports = function (app) {
  const modelName = "roles";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: {
        type: String,
        required: false,
        unique: false,
        lowercase: false,
        uppercase: false,
        minLength: 3,
        maxLength: 1000000,
        index: true,
        trim: true,
      },
      description: {
        type: String,
        required: false,
        unique: false,
        lowercase: false,
        uppercase: false,
        minLength: 3,
        maxLength: 1000000,
        index: true,
        trim: true,
      },
      isDefault: { type: Boolean, required: false, default: false },
    },
    {
      timestamps: true,
    },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
