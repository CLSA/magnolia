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
        cross_institution_data_access: {
          title: "Cross-Institution Data Access",
          type: "boolean",
        },
        start_date: {
          title: "Start Date",
          type: "date",
        },
        end_date: {
          title: "End Date",
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
      cross_institution_data_access: {
        title: "Cross-Institution Data Access",
        type: "boolean",
        help: "Defines whether the agreement allows sharing data with co-applicants in other institutions.",
      },
      start_date: {
        title: "Start Date",
        type: "date",
      },
      end_date: {
        title: "End Date",
        type: "date",
      },
      data: {
        title: "File",
        type: "base64",
        mimeType: "application/pdf",
        getFilename: function ($state, model) {
          return model.viewModel.record.institution + " (" + model.viewModel.record.start_date + ")";
        }
      },
    });
  },
});
