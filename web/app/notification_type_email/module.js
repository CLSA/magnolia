cenozoApp.defineModule({
  name: "notification_type_email",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "notification_type",
          column: "notification_type.name",
        },
      },
      name: {
        singular: "carbon copy",
        plural: "carbon copies",
        possessive: "carbon copy's",
      },
      columnList: {
        email: {
          title: "Email",
        },
        blind: {
          title: "BCC",
          type: "boolean",
        },
      },
      defaultOrder: {
        column: "email",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      email: {
        title: "Email",
        type: "string",
        format: "email",
        help: 'Must be in the format "account@domain.name".',
      },
      blind: {
        title: "Blind Carbon Copy",
        type: "boolean",
        help: "Whether to blind copy the email so that other recipiants do not see the email address.",
      },
    });
  },
});
