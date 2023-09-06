cenozoApp.defineModule({
  name: "stage",
  models: "list",
  create: (module) => {
    angular.extend(module, {
      identifier: {}, // standard
      name: {
        singular: "stage",
        plural: "stages",
        possessive: "stage's",
      },
      columnList: {
        identifier: {
          column: "reqn.identifier",
          title: "Requisition",
        },
        amendment: { title: "Amendment" },
        stage_type: {
          column: "stage_type.name",
          title: "Stage Type",
        },
        user_full_name: {
          title: "Completed By",
        },
        datetime: {
          title: "Date & Time",
          type: "datetime",
        },
      },
      defaultOrder: {
        column: "datetime",
        reverse: true,
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnStageModelFactory", [
      "CnBaseModelFactory",
      "CnStageListFactory",
      "$state",
      function (CnBaseModelFactory, CnStageListFactory, $state) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnStageListFactory.instance(this);

          // Only allow viewing a stage when in the stage_type.view state (which will go to the reqn)
          this.getViewEnabled = function () {
            return (
              "stage_type" == this.getSubjectFromState() &&
              "view" == this.getActionFromState()
            );
          };

          // When in the stage.list state transition to the reqn when clicking the stage record
          this.transitionToViewState = async function (record) {
            await $state.go("reqn.view", {
              identifier: "identifier=" + record.identifier,
            });
          };
        };

        return {
          root: new object(true),
          instance: function () {
            return new object(false);
          },
        };
      },
    ]);
  },
});
