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

    /* ############################################################################################## */
    cenozo.providers.factory("CnManuscriptDeferralNoteModelFactory", [
      "CnBaseModelFactory",
      "CnManuscriptDeferralNoteListFactory",
      "CnManuscriptDeferralNoteViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnManuscriptDeferralNoteListFactory,
        CnManuscriptDeferralNoteViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnManuscriptDeferralNoteListFactory.instance(this);
          this.viewModel = CnManuscriptDeferralNoteViewFactory.instance(this, root);

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
