module.exports = function (app) {
  const modelName = "users";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        uppercase: false,
        minLength: 5,
        maxLength: 150,
        index: true,
        trim: true,
      },
      username: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        minLength: 2,
        maxLength: 100,
        index: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: false,
        unique: false,
        lowercase: false,
        uppercase: false,
        minLength: 10,
        maxLength: 20,
        index: false,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        minLength: 5,
        maxLength: 300,
        index: true,
        trim: true,
      },
      profileImage: {
        type: String,
        required: false,
        unique: false,
        lowercase: false,
        uppercase: false,
        maxLength: 500,
        index: false,
        trim: true,
      },
      isActive: { 
        type: Boolean, 
        required: false, 
        default: true 
      },
      points: {
        type: Number,
        required: false,
        default: 0,
        min: 0,
        max: 999999999,
      },
      address: {
        type: String,
        required: false,
        unique: false,
        lowercase: false,
        uppercase: false,
        maxLength: 500,
        index: false,
        trim: true,
      },
      aboutMe: {
        type: String,
        required: false,
        unique: false,
        lowercase: false,
        uppercase: false,
        maxLength: 1000,
        index: false,
        trim: true,
      },
      role: {
        type: String,
        required: false,
        default: "customer",
        enum: ["customer", "admin"],
        index: true,
      },
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
