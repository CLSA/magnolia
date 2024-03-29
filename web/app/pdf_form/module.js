cenozoApp.defineModule({
  name: "pdf_form",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "pdf_form_type",
          column: "pdf_form_type.name",
        },
      },
      name: {
        singular: "version",
        plural: "versions",
        possessive: "version's",
        friendlyColumn: "version",
      },
      columnList: {
        version: {
          title: "Version",
          type: "date",
        },
        active: {
          title: "Active",
          type: "boolean",
          help: "Is this the actively used version of the form?",
        },
      },
      defaultOrder: {
        column: "version",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      version: {
        title: "Version",
        type: "date",
      },
      active: {
        title: "Active",
        type: "boolean",
        help: "Determines whether this is the actively used version of the form (only one version may be active)",
      },
      data: {
        title: "File",
        type: "base64",
        isConstant: true
      },
    });
  },
});
