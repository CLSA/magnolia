cenozoApp.defineModule({
  name: "manuscript_attachment",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "manuscript",
          column: "manuscript.id",
        },
      },
      name: {
        singular: "attachment",
        plural: "attachments",
        possessive: "attachment's",
      },
      columnList: {
        filename: { column: "manuscript_attachment.filename", title: "Name" },
      },
      defaultOrder: {
        column: "manuscript_attachment.filename",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      data: {
        title: "File",
        type: "base64",
        getFilename: function ($state, model) { return model.viewModel.record.filename; },
      },
      filename: { type: "string", isExcluded: true },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnManuscriptAttachmentAddFactory", [
      "CnBaseAddFactory",
      function (CnBaseAddFactory) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);

          // extend onAdd to automatically set the filename property
          this.onAdd = async function (record) {
            record.filename = this.fileList.findByProperty("key", "data").getFilename();
            await this.$$onAdd(record);
          }
        };
        return {
          instance: function (parentModel) {
            return new object(parentModel);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnManuscriptAttachmentViewFactory", [
      "CnBaseViewFactory",
      "CnHttpFactory",
      function (CnBaseViewFactory, CnHttpFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          // always set the name of the record based on the name of the uploaded file
          const self = this;
          this.fileList.findByProperty("key", "data").postUpload = async function() {
            await CnHttpFactory.instance({
              path: self.parentModel.getServiceResourcePath(),
              data: { filename: this.file.name },
            }).patch();
            await self.onView();
          };
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
