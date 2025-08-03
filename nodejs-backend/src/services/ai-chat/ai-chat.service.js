const { AiChatService } = require("./ai-chat.class");
const createModel = require("../../models/ai-chat.model");
const hooks = require("./ai-chat.hooks");

module.exports = function (app) {
  const mongooseClient = app.get("mongooseClient");
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate"]
  };

  // Initialize our service with any options it requires
  app.use("/ai-chat", new AiChatService(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("ai-chat");

  service.hooks(hooks);
}; 