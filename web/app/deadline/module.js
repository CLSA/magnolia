cenozoApp.defineModule({
  name: "deadline",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: { column: "name" },
      name: {
        singular: "deadline",
        plural: "deadlines",
        possessive: "deadline's",
      },
      columnList: {
        name: {
          title: "Name",
        },
        datetime: {
          title: "Date & Time",
          type: "datetime",
        },
        reqn_count: {
          title: "Requisitions",
        },
      },
      defaultOrder: {
        column: "datetime",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
        format: "identifier",
      },
      datetime: {
        title: "Date & Time",
        type: "datetime",
      },
    });
  },
});
