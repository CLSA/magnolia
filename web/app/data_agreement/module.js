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
      filename: {
        title: "File",
        type: "file",
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnDataAgreementAddFactory", [
      "CnBaseAddFactory",
      function (CnBaseAddFactory) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);
          this.configureFileInput("filename");
        };
        return {
          instance: function (parentModel) {
            return new object(parentModel);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnDataAgreementViewFactory", [
      "CnBaseViewFactory",
      "CnHttpFactory",
      function (CnBaseViewFactory, CnHttpFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);
          this.configureFileInput("filename");
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
