cenozoApp.defineModule({
  name: "deferral_note",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "reqn",
          column: "reqn.identifier",
        },
      },
      name: {
        singular: "deferral note",
        plural: "deferral notes",
        possessive: "deferral note's",
      },
      columnList: {
        identifier: { column: "reqn.identifier", title: "Requisition" },
        form_title: { title: "Form" },
        page_title: { title: "Page" },
      },
      defaultOrder: {
        column: "form",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      form_title: { title: "Form", type: "string", isConstant: true },
      page_title: { title: "Page", type: "string", isConstant: true },
      note: { title: "Note", type: "text" },
    });

  },
});
