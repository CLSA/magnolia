cenozoApp.defineModule({
  name: "review_type_question",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "review_type",
          column: "review_type.name",
        },
      },
      name: {
        singular: "question",
        plural: "questions",
        possessive: "question's",
      },
      columnList: {
        rank: { title: "Rank", type: "rank" },
        question: { title: "Question", type: "text", limit: 200 },
      },
      defaultOrder: { column: "rank", reverse: false },
    });

    module.addInputGroup("", {
      rank: { title: "Rank", type: "rank" },
      question: { title: "Question", type: "text" },
    });
  },
});
