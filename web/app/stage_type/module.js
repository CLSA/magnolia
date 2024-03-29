cenozoApp.defineModule({
  name: "stage_type",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: { column: "name" },
      name: {
        singular: "stage type",
        plural: "stage types",
        possessive: "stage type's",
      },
      columnList: {
        rank: {
          title: "Rank",
          type: "rank",
        },
        name: {
          title: "Name",
        },
        phase: {
          title: "Phase",
        },
        notification_type: {
          column: "notification_type.name",
          title: "Notification",
        },
        reqn_count: {
          title: "Requisitions",
          type: "number",
        },
      },
      defaultOrder: {
        column: "rank",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      rank: {
        title: "Rank",
        type: "rank",
      },
      name: {
        title: "Name",
        type: "string",
      },
      phase: {
        title: "Phase",
        type: "string",
      },
      notification_type: {
        column: "notification_type.name",
        title: "Notification",
        type: "string",
        help: "The notification to send after the stage is complete.",
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnStageTypeListFactory", [
      "CnBaseListFactory",
      function (CnBaseListFactory) {
        var object = function (parentModel) {
          CnBaseListFactory.construct(this, parentModel);

          // extend the number of items per page to show all stage types on a single page
          this.paginationModel.itemsPerPage = 50;
        };
        return {
          instance: function (parentModel) {
            return new object(parentModel);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnStageTypeViewFactory", [
      "CnBaseViewFactory",
      function (CnBaseViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          async function init(object) {
            await object.deferred.promise;
            if (angular.isDefined(object.stageModel))
              object.stageModel.listModel.heading = "Requisition List";
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
