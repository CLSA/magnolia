cenozoApp.extendModule({
  name: "user",
  create: (module) => {
    // we don't need the site column since this is a one-site application
    delete module.columnList.sites;

    // add the suspended column to the column list
    cenozo.insertPropertyAfter(module.columnList, "active", "suspended", {
      column: "suspended",
      title: "Suspended",
      type: "boolean",
    });

    // add the newsletter column to the column list
    cenozo.insertPropertyAfter(module.columnList, "role_list", "newsletter", {
      column: "newsletter",
      title: "Newsletter",
      type: "boolean",
    });

    // add extra inputs
    module.addInput("", "supervisor_user_id", {
      title: "Supervisor",
      type: "lookup-typeahead",
      typeahead: {
        table: "user",
        select:
          'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: ["user.first_name", "user.last_name", "user.name"],
      },
      isExcluded: "add",
      help:
        "If set then all new requisitions created by this user will define the supervisor as the primary applicant " +
        "and this user as the trainee.",
    });

    module.addInput("", "suspended", {
      title: "Suspended for Non-payment",
      type: "boolean",
      help: "Whether the user's account is suspended due to non-payment of fees.",
    }, 'active' );

    module.addInput("", "newsletter", {
      title: "Newsletter Consent",
      type: "boolean",
      help: "Whether the user will be included in the newsletter mailouts.",
    });

    module.addInput("", "note", { title: "Note", type: "text" });

    // extend the model factory
    cenozo.providers.decorator("CnUserModelFactory", [
      "$delegate",
      "CnHttpFactory",
      function ($delegate, CnHttpFactory) {
        var instance = $delegate.instance;
        function extendObject(object) {
          object.baseGetMetadataFn = object.getMetadata;
          angular.extend(object, {
            // extend getMetadata
            getMetadata: async function () {
              await object.baseGetMetadataFn();
              var response = await CnHttpFactory.instance({
                path: "applicant",
              }).head();
              var columnMetadata = angular.fromJson(
                response.headers("Columns")
              ).supervisor_user_id;
              columnMetadata.required = "1" == columnMetadata.required;
              object.metadata.columnList.supervisor_user_id = columnMetadata;
            },
          });
        }

        extendObject($delegate.root);

        $delegate.instance = function () {
          var object = instance();
          extendObject(object);
          return object;
        };

        return $delegate;
      },
    ]);
  },
});
