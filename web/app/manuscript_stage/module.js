cenozoApp.defineModule({
  name: "manuscript_stage",
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
        title: {
          column: "manuscript.title",
          title: "Manuscript",
        },
        manuscript_stage_type: {
          column: "manuscript_stage_type.name",
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
    cenozo.providers.factory("CnManuscriptStageModelFactory", [
      "CnBaseModelFactory",
      "CnManuscriptStageListFactory",
      "$state",
      function (CnBaseModelFactory, CnManuscriptStageListFactory, $state) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnManuscriptStageListFactory.instance(this);

          // Only allow viewing a stage when in the stage_type.view state (which will go to the manuscript)
          this.getViewEnabled = function () {
            return (
              "manuscript_stage_type" == this.getSubjectFromState() &&
              "view" == this.getActionFromState()
            );
          };

          // When in the stage.list state transition to the manuscript when clicking the stage record
          this.transitionToViewState = async function (record) {
            await $state.go("manuscript.view", { identifier: record.id });
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
