cenozoApp.defineModule({
  name: "additional_fee",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: { column: "name" },
      name: {
        singular: "additional fee",
        plural: "additional fees",
        possessive: "additional fee's",
      },
      columnList: {
        name: { title: "Name", },
        reqn_count: { title: "Requisitions" },
      },
      defaultOrder: {
        column: "name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
        format: "identifier",
      },
    });
  },
});
