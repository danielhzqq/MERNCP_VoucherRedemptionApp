const { DynaFields } = require("./dynaFields.class");
const createModel = require("../../models/dynaFields.model");
const hooks = require("./dynaFields.hooks");

module.exports = function (app) {
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use("/dynaFields", new DynaFields(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("dynaFields");

  // Get the schema of the collections
  app.get("/dynaFieldsSchema", function (request, response) {
    const schema = createModel(app).schema.tree;
    const excludes = ["__v", "id"];
    const result = Object.keys(schema).map((key) => {
      if (typeof schema[key].type === "function") {
        if (schema[key].type === String) schema[key].type = "String";
        else if (schema[key].type === Number) schema[key].type = "Number";
        else if (schema[key].type === Boolean) schema[key].type = "Boolean";
        else if (schema[key].type === Date) schema[key].type = "Date";
        else if (schema[key].type === Schema.Types.ObjectId)
          schema[key].type = "ObjectId";
        else if (schema[key].type === Schema.Types.Mixed)
          schema[key].type = "Mixed";
        else schema[key].type = "undefined";
      }
      return (
        !excludes.includes(key) && {
          field: key,
          properties: schema[key],
        }
      );
    });
    return response.status(200).json(result);
  });
  service.hooks(hooks);
};
