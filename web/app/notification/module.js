cenozoApp.defineModule({
  name: "notification",
  models: "list",
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "reqn",
          column: "identifier",
        },
      },
      name: {
        singular: "notification",
        plural: "notifications",
        possessive: "notification's",
      },
      columnList: {
        reqn: {
          column: "reqn.identifier",
          title: "Requisition",
        },
        email_list: {
          title: "Sent To",
        },
        type: {
          column: "notification_type.name",
          title: "Type",
        },
        datetime: {
          title: "Date & Time",
          type: "datetime",
        },
        sent: {
          title: "Sent",
          type: "boolean",
        },
      },
      defaultOrder: {
        column: "datetime",
        reverse: true,
      },
    });
  },
});
