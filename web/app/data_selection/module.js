cenozoApp.defineModule({
  name: "data_selection",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "data_option",
          column: "data_option.name_en",
        },
      },
      name: {
        singular: "data-selection",
        plural: "data-selections",
        possessive: "data-selection's",
      },
      columnList: {
        option_rank: {
          column: "data_option.rank",
          title: "Data-Option Rank",
          type: "rank",
        },
        option_name_en: {
          column: "data_option.name_en",
          title: "Data-Option Name",
        },
        study: { column: "study.name", title: "Study" },
        study_phase: { column: "study_phase.name", title: "Phase" },
        cost: { title: "Fee", type: "currency:$:0" },
        cost_combined: { title: "Fee Combined", type: "boolean" },
        is_unavailable: { title: "Unavailable", type: "boolean" },
      },
      defaultOrder: { column: "study_phase_id", reverse: false },
    });

    module.addInputGroup("", {
      data_option_id: {
        title: "Data-Option",
        type: "enum",
        isExcluded: "add",
        isConstant: "view",
      },
      study_phase_id: {
        title: "Study-Phase",
        type: "enum",
        isConstant: "view",
      },
      cost: {
        title: "Fee ($)",
        type: "string",
        format: "integer",
      },
      cost_combined: {
        title: "Fee Combined",
        type: "boolean",
        help: "Determines whether the fee for this selection is combined with others from the same option.",
      },
      unavailable_en: {
        title: "Unavailable Text (English)",
        type: "string",
        help:
          "If requisitions should not be allowed to select this data-selection then " +
          "provide the English text that will replace the selection button.",
      },
      unavailable_fr: {
        title: "Unavailable Text (French)",
        type: "string",
        help:
          "If requisitions should not be allowed to select this data-selection then " +
          "provide the French text that will replace the selection button.",
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnDataSelectionModelFactory", [
      "CnBaseModelFactory",
      "CnDataSelectionAddFactory",
      "CnDataSelectionListFactory",
      "CnDataSelectionViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnDataSelectionAddFactory,
        CnDataSelectionListFactory,
        CnDataSelectionViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnDataSelectionAddFactory.instance(this);
          this.listModel = CnDataSelectionListFactory.instance(this);
          this.viewModel = CnDataSelectionViewFactory.instance(this, root);

          // extend getMetadata
          this.getMetadata = async function () {
            await this.$$getMetadata();

            var [dataOptionResponse, studyPhaseResponse] = await Promise.all([
              CnHttpFactory.instance({
                path: "data_option",
                data: {
                  select: {
                    column: [
                      "id",
                      "name_en",
                      {
                        table: "data_category",
                        column: "name_en",
                        alias: "category",
                      },
                    ],
                  },
                  modifier: {
                    order: ["data_category.rank", "data_option.rank"],
                    limit: 1000,
                  },
                },
              }).query(),

              CnHttpFactory.instance({
                path: "study_phase",
                data: {
                  select: {
                    column: [
                      "id",
                      "name",
                      { table: "study", column: "name", alias: "study" },
                    ],
                  },
                  modifier: {
                    order: ["study.name", "study_phase.rank"],
                    limit: 1000,
                  },
                },
              }).query(),
            ]);

            this.metadata.columnList.data_option_id.enumList =
              dataOptionResponse.data.reduce((list, item) => {
                list.push({
                  value: item.id,
                  name: item.category + ": " + item.name_en,
                });
                return list;
              }, []);

            this.metadata.columnList.study_phase_id.enumList =
              studyPhaseResponse.data.reduce((list, item) => {
                list.push({
                  value: item.id,
                  name: item.study + ": " + item.name,
                });
                return list;
              }, []);
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
