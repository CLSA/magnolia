cenozoApp.defineModule({
  name: "data_option",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "data_category",
          column: "data_category.name_en",
        },
      },
      name: {
        singular: "data-option",
        plural: "data-options",
        possessive: "data-option's",
      },
      columnList: {
        category_rank: {
          column: "data_category.rank",
          title: "Category Rank",
          type: "rank",
        },
        category_name_en: {
          column: "data_category.name_en",
          title: "Category Name",
        },
        rank: { title: "Rank", type: "rank" },
        justification: { title: "Justification", type: "boolean" },
        name_en: { title: "Name" },
        has_condition: { title: "Has Condition", type: "boolean" },
        note_en: { title: "Note", type: "text", limit: 20 },
      },
      defaultOrder: { column: "rank", reverse: false },
    });

    module.addInputGroup("", {
      data_category_name_en: {
        column: "data_category.name_en",
        title: "Category",
        type: "string",
        isConstant: true,
      },
      rank: {
        title: "Rank",
        type: "rank",
        isConstant: true,
      },
      justification: {
        title: "Justification",
        type: "boolean",
        help: "Whether the applicant must provide a justification when selecting this data-option.",
      },
      name_en: {
        title: "Name (English)",
        type: "string",
      },
      name_fr: {
        title: "Name (French)",
        type: "string",
      },
      condition_en: {
        title: "Condition (English)",
        type: "text",
        help: "If provided then this statement must be agreed to by the applicant as a condition to checking off this data option",
      },
      condition_fr: {
        title: "Condition (French)",
        type: "text",
        help: "If provided then this statement must be agreed to by the applicant as a condition to checking off this data option",
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
  },
});
