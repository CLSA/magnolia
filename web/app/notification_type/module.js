cenozoApp.defineModule({
  name: "notification_type",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: { column: "name" },
      name: {
        singular: "notification type",
        plural: "notification types",
        possessive: "notification type's",
      },
      columnList: {
        name: {
          title: "Name",
        },
        notification_count: {
          title: "Notifications",
          type: "number",
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
        isConstant: true,
      },
      title_en: {
        title: "Title (English)",
        type: "string",
        help: "The title of the email to English applicants when this notification is triggered.",
      },
      title_fr: {
        title: "Title (French)",
        type: "string",
        help: "The title of the email to French applicants when this notification is triggered.",
      },
      message_en: {
        title: "Message (English)",
        type: "text",
        help: "The message sent by email to English applicants when this notification is triggered.",
      },
      message_fr: {
        title: "Message (French)",
        type: "text",
        help: "The message sent by email to French applicants when this notification is triggered.",
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnNotificationTypeViewFactory", [
      "CnBaseViewFactory",
      function (CnBaseViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root, "notification");

          angular.extend(this, {
            getChildTitle: function (child) {
              // differentiate between manuscript and requisition notifications
              return (
                "manuscript_notification" == child.subject.snake ? "Manuscript " :
                "notification" == child.subject.snake ? "Requisition " : ""
              ) + this.$$getChildTitle(child);
            },
          });

          async function init(object) {
            await object.deferred.promise;
            if (angular.isDefined(object.stageTypeModel)) {
              object.stageTypeModel.listModel.heading = "Notified Stage Type List";
            }
          }

          init(this);
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);
  },
});
