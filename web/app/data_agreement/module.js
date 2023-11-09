cenozoApp.defineModule({
  name: "data_agreement",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {},
      name: {
        singular: "master data agreement",
        plural: "master data agreements",
        possessive: "master data agreement's",
      },
      columnList: {
        institution: {
          title: "Institution",
        },
        version: {
          title: "Version",
          type: "date",
        },
        reqn_count: {
          title: "Requisition Count",
          type: "number",
        },
      },
      defaultOrder: {
        column: "institution",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      institution: {
        title: "Institution",
        type: "string",
      },
      version: {
        title: "Version",
        type: "date",
      },
      data: {
        title: "File",
        type: "base64",
        mimeType: "application/pdf",
        getFilename: function ($state, model) {
          return model.viewModel.record.institution + " (" + model.viewModel.record.version + ")";
        }
      },
    });
  },
});
