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

    /* ############################################################################################## */
    cenozo.providers.factory("CnDeferralNoteModelFactory", [
      "CnBaseModelFactory",
      "CnDeferralNoteListFactory",
      "CnDeferralNoteViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnDeferralNoteListFactory,
        CnDeferralNoteViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnDeferralNoteListFactory.instance(this);
          this.viewModel = CnDeferralNoteViewFactory.instance(this, root);

          // deferral notes can only be added in the form UI
          this.getAddEnabled = function () { return false; }
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
