cenozoApp.defineModule({
  name: "amendment_type",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {},
      name: {
        singular: "amendment type",
        plural: "amendment types",
        possessive: "amendment type's",
      },
      columnList: {
        rank: { title: "Rank", type: "rank" },
        new_user: { title: "Request New User", type: "boolean" },
        show_in_description: { title: "Show in Description", type: "boolean" },
        reason_en: { title: "Reason (English)" },
        reason_fr: { title: "Reason (French)" },
      },
      defaultOrder: {
        column: "amendment_type.rank",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      rank: {
        title: "Rank",
        type: "rank",
      },
      new_user: {
        title: "Request New User",
        type: "boolean",
      },
      show_in_description: {
        title: "Show in Description",
        type: "boolean",
      },
      fee_canada: {
        title: "Canadian Fee ($)",
        type: "string",
        format: "integer",
      },
      fee_international: {
        title: "International Fee ($)",
        type: "string",
        format: "integer",
      },
      reason_en: {
        title: "Reason (English)",
        type: "string",
      },
      reason_fr: {
        title: "Reason (French)",
        type: "string",
      },
      justification_prompt_en: {
        title: "Justification Prompt (English)",
        type: "text",
      },
      justification_prompt_fr: {
        title: "Justification Prompt (French)",
        type: "text",
      },
    });
  },
});
