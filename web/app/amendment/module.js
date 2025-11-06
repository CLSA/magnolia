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
        fee: { title: "Fee Change", type: "currency:$:0" },
        override_fee: { title: "Override Fee Change", type: "currency:$:0" },
        has_agreement: { title: "Has Agreement", type: "boolean" },
        datetime: { column: "first_reqn_version.datetime", title: "Datetime", type: "datetime" },
        note: { title: "Note", type: "text", limit: 200 },
      },
      defaultOrder: {
        column: "name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      formatted_name: { title: "Name", type: "string", isConstant: true },
      fee: { title: "Fee Change ($)", type: "string", format: "integer", isConstant: true },
      override_fee: { title: "Override Fee Change ($)", type: "string", format: "integer" },
      has_agreement: { title: "Has Agreement", type: "boolean", isConstant: true },
      datetime: {
        column: "first_reqn_version.datetime",
        title: "Datetime",
        type: "datetime",
        isConstant: true,
      },
      note: { title: "Note", type: "text" },
    });
  },
});
