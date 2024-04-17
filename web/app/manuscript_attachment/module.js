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
        name: { column: "manuscript_attachment.name", title: "Name" },
      },
      defaultOrder: {
        column: "manuscript_attachment.name",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
      },
      data: {
        title: "File",
        type: "base64",
        getFilename: function ($state, model) { return model.viewModel.record.name; },
      }
    });

  },
});
