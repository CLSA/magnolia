cenozoApp.defineModule({
  name: "data_category_study_phase",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "data_category",
          column: "data_category.id",
        },
      },
      name: {
        singular: "study phase",
        plural: "study phases",
        possessive: "study phase's",
      },
      columnList: {
        study: { column: "study.name", title: "Study" },
        rank: { column: "study_phase.rank", title: "Rank" },
        name: { column: "study_phase.name", title: "Name" },
        cost_combined: { title: "Fee Combined", type: "boolean" },
      },
      defaultOrder: { column: "study_phase.rank", reverse: false },
    });

    module.addInputGroup("", {
      data_category_name_en: {
        column: "data_category.name_en",
        title: "Category",
        type: "string",
        isConstant: true,
      },
      study_name_en: {
        column: "study.name",
        title: "Study",
        type: "string",
        isConstant: true,
      },
      study_phase_name_en: {
        column: "study_phase.name",
        title: "Study Phase",
        type: "string",
        isConstant: true,
      },
      cost_combined: {
        title: "Fee Combined",
        type: "boolean",
        help: "Determines whether the fee for all options in this study phase are combined (only counted once for all selected options).",
      },
    });
  },
});
