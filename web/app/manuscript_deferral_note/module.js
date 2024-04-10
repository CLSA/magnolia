cenozoApp.defineModule({
  name: "manuscript_deferral_note",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "manuscript",
          column: "manuscript.id",
        },
      },
      name: {
        singular: "deferral note",
        plural: "deferral notes",
        possessive: "deferral note's",
      },
      columnList: {
        title: { column: "manuscript.title", title: "Requisition" },
        page_title: { title: "Page" },
      },
      defaultOrder: {
        column: "page",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      page_title: { title: "Page", type: "string", isConstant: true },
      note: { title: "Note", type: "text" },
    });

  },
});
