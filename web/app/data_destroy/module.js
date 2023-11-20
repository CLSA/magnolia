cenozoApp.defineModule({
  name: "data_destroy",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "reqn",
          column: "reqn.identifier",
        },
      },
      name: {
        singular: "data destroy",
        plural: "data destroy",
        possessive: "data destroy's",
      },
      columnList: {
        name: { title: "Name" },
        datetime: { title: "Date & Time", type: "datetime" },
      },
      defaultOrder: {
        column: "data_destroy.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      identifier: {
        title: "Identifier",
        column: "reqn.identifier",
        type: "string",
        isConstant: true,
        isExcluded: 'add',
      },
      name: {
        title: "Data to Destroy",
        type: "string",
      },
      datetime: {
        title: "Date & Time of Destruction",
        type: "datetime",
      },
    });

  },
});
