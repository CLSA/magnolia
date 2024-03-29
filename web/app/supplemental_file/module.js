cenozoApp.defineModule({
  name: "supplemental_file",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {},
      name: {
        singular: "supplemental file",
        plural: "supplemental files",
        possessive: "supplemental file's",
      },
      columnList: { name_en: { title: "Name" } },
      defaultOrder: { column: "name_en", reverse: false },
    });

    module.addInputGroup("", {
      name_en: {
        title: "Name (English)",
        type: "string",
        help: "The name of the file (in English) as it will appear along with study data.",
      },
      name_fr: {
        title: "Name (French)",
        type: "string",
        help: "The name of the file (in French) as it will appear along with study data.",
      },
      data_en: {
        title: "File (English)",
        type: "base64",
        mimeType: "application/pdf",
        getFilename: function ($state, model) {
          return model.viewModel.record.name_en;
        },
      },
      data_fr: {
        title: "File (French)",
        type: "base64",
        mimeType: "application/pdf",
        getFilename: function ($state, model) {
          return model.viewModel.record.name_fr;
        },
      },
    });
  },
});
