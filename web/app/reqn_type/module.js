cenozoApp.defineModule({
  name: "reqn_type",
  models: ["list", "view"],
  defaultTab: 'reqn',
  create: (module) => {
    angular.extend(module, {
      identifier: { column: "name" },
      name: {
        singular: "requisition type",
        plural: "requisition types",
        possessive: "requisition type's",
      },
      columnList: {
        name: {
          title: "Name",
        },
        available: {
          title: "Available",
          type: "boolean",
        },
        reqn_count: {
          title: "Requisitions",
          type: "number",
        },
        stage_type_list: {
          title: "Stage Types",
        },
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
      available: {
        title: "Available",
        type: "boolean",
        help: "Determines whether this type is available to applicants when creating new requisitions.",
      },
    });
  },
});
