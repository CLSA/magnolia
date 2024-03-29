cenozoApp.defineModule({
  name: "output_type",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: { column: "name_en" },
      name: {
        singular: "output type",
        plural: "output types",
        possessive: "output type's",
      },
      columnList: {
        name_en: {
          title: "Name (English)",
        },
        name_fr: {
          title: "Name (French)",
        },
        output_count: {
          title: "Outputs",
          type: "number",
        },
      },
      defaultOrder: {
        column: "name_en",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name_en: {
        title: "Name (English)",
        type: "string",
        format: "identifier",
      },
      name_fr: {
        title: "Name (French)",
        type: "string",
        format: "identifier",
      },
      note_en: {
        title: "Note (English)",
        type: "text",
      },
      note_fr: {
        title: "Note (French)",
        type: "text",
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnOutputTypeViewFactory", [
      "CnBaseViewFactory",
      "CnReqnHelper",
      function (CnBaseViewFactory, CnReqnHelper) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          angular.extend(this, {
            onView: async function (force) {
              this.updateOutputListLanguage();
              await this.$$onView(force);
            },

            updateOutputListLanguage: function () {
              var columnList = cenozoApp.module("output").columnList;
              columnList.output_type_en.isIncluded = function ($state, model) {
                return true;
              };
              columnList.output_type_fr.isIncluded = function ($state, model) {
                return false;
              };
              columnList.output_type_en.title = CnReqnHelper.translate(
                "output",
                "output_type",
                "en"
              );
              columnList.output_type_fr.title = CnReqnHelper.translate(
                "output",
                "output_type",
                "fr"
              );
              columnList.detail.title = CnReqnHelper.translate(
                "output",
                "detail",
                "en"
              );
              columnList.output_source_count.title = CnReqnHelper.translate(
                "output",
                "output_source_count",
                "en"
              );
            },
          });
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
