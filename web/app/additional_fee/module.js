cenozoApp.defineModule({
  name: "additional_fee",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {},
      name: {
        singular: "additional fee",
        plural: "additional fees",
        possessive: "additional fee's",
      },
      columnList: {
        name: { title: "Name", },
        cost: { title: "Cost", },
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
      cost: {
        title: "Cost ($)",
        type: "string",
        format: "integer",
      },
    });
  },
});
