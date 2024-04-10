cenozoApp.defineModule({
  name: "manuscript_notification",
  models: "list",
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "manuscript",
          column: "manuscript.id",
        },
      },
      name: {
        singular: "notification",
        plural: "notifications",
        possessive: "notification's",
      },
      columnList: {
        manuscript: {
          column: "manuscript.title",
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
