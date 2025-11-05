cenozoApp.defineModule({
  name: "amendment",
  models: ["list", "view"],
  defaultTab: "stage",
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "reqn",
          column: "reqn.identifier",
        },
      },
      name: {
        singular: "amendment",
        plural: "amendments",
        possessive: "amendment's",
      },
      columnList: {
        formatted_name: { title: "Name" },
        fee: { title: "Fee", type: "currency:$:0" },
        override_fee: { title: "Override Fee", type: "currency:$:0" },
      },
      defaultOrder: {
        column: "name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      formatted_name: { title: "Name", type: "string", isConstant: true },
      fee: { title: "Fee ($)", type: "string", format: "integer", isConstant: true },
      override_fee: { title: "Override Fee ($)", type: "string", format: "integer" },
    });
  },
});
