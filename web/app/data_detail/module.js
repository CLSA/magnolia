cenozoApp.defineModule({
  name: "data_detail",
  dependencies: ["data_selection"],
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "data_selection",
          column: "data_selection.id",
        },
      },
      name: {
        singular: "data-detail",
        plural: "data-details",
        possessive: "data-detail's",
      },
      columnList: {
        rank: { title: "Rank", type: "rank" },
        name_en: { title: "Name" },
        note_en: { title: "Note", type: "text", limit: 200 },
      },
      defaultOrder: { column: "rank", reverse: false },
    });

    module.addInputGroup("", {
      data_category_name_en: {
        column: "data_category.name_en",
        title: "Category",
        type: "string",
        isExcluded: "add",
        isConstant: true,
      },
      data_selection_id: {
        title: "Data Selection",
        type: "enum",
        isExcluded: "add",
        isConstant: "view",
      },
      rank: { title: "Rank", type: "rank" },
      name_en: { title: "Name (English)", type: "string" },
      name_fr: { title: "Name (French)", type: "string" },
      note_en: { title: "Note (English)", type: "text" },
      note_fr: { title: "Note (French)", type: "text" },
      data_category_rank: { column: "data_category.rank", type: "hidden" },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnDataDetailModelFactory", [
      "CnBaseModelFactory",
      "CnDataDetailAddFactory",
      "CnDataDetailListFactory",
      "CnDataDetailViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnDataDetailAddFactory,
        CnDataDetailListFactory,
        CnDataDetailViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnDataDetailAddFactory.instance(this);
          this.listModel = CnDataDetailListFactory.instance(this);
          this.viewModel = CnDataDetailViewFactory.instance(this, root);

          // extend getMetadata
          this.getMetadata = async function () {
            await this.$$getMetadata();

            var dataSelectionResponse = await CnHttpFactory.instance({
              path: "data_selection",
              data: {
                select: {
                  column: [
                    "id",
                    { table: "data_option", column: "name_en" },
                    { table: "study_phase", column: "code" },
                  ],
                },
                modifier: { order: "data_option.rank", limit: 1000 },
              },
            }).query();

            this.metadata.columnList.data_selection_id.enumList =
              dataSelectionResponse.data.reduce((list, item) => {
                list.push({
                  value: item.id,
                  name: item.name_en + " (" + item.code + ")",
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
