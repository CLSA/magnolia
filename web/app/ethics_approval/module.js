cenozoApp.defineModule({
  name: "ethics_approval",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "reqn",
          column: "reqn.identifier",
        },
      },
      name: {
        singular: "ethics approval",
        plural: "ethics approvals",
        possessive: "ethics approval's",
      },
      columnList: {
        identifier: { column: "reqn.identifier", title: "Requisition" },
        filename: { title: "File" },
        date: { title: "Expiry" },
      },
      defaultOrder: {
        column: "ethics_approval.date",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      filename: {
        title: "File",
        type: "file",
      },
      date: {
        title: "Expiry",
        type: "date",
      },
    });

    /* ############################################################################################## */
    cenozo.providers.service("CnEthicsApprovalModalAddFactory", [
      "CnHttpFactory",
      "CnLocalization",
      "CnModalDatetimeFactory",
      "$uibModal",
      function (
        CnHttpFactory,
        CnLocalization,
        CnModalDatetimeFactory,
        $uibModal
      ) {
        var object = function (params) {
          this.language = "en";
          angular.extend(this, params);

          this.show = function () {
            var self = this;
            return $uibModal.open({
              backdrop: "static",
              keyboard: true,
              modalFade: true,
              templateUrl: module.getFileUrl("modal-add.tpl.html"),
              controller: [
                "$scope",
                "$uibModalInstance",
                function ($scope, $uibModalInstance) {
                  angular.extend($scope, {
                    file: {
                      key: "filename",
                      file: null,
                      uploading: false,
                      getFilename: function () {
                        var obj = this;
                        var data = new FormData();
                        data.append("file", obj.file);
                        var fileDetails = data.get("file");
                        return fileDetails.name;
                      },
                      upload: async function (path) {
                        var obj = this;

                        try {
                          obj.uploading = true;

                          // upload the file
                          await CnHttpFactory.instance({
                            path: path + "?file=filename",
                            data: obj.file,
                            format: "unknown",
                          }).patch();
                        } finally {
                          obj.uploading = false;
                        }
                      },
                    },
                    filename: null,
                    date: null,
                    selectDate: async function () {
                      var response = await CnModalDatetimeFactory.instance({
                        title: $scope.t("misc.expirationDate").toLowerCase(),
                        date: this.date,
                        pickerType: "date",
                        emptyAllowed: false,
                        locale: self.language,
                      }).show();

                      if (response) $scope.date = response.replace(/T.*/, "");
                    },
                    t: function (value) {
                      return CnLocalization.translate("application", value, self.language);
                    },
                    ok: function () {
                      $uibModalInstance.close({
                        file: $scope.file,
                        date: $scope.date,
                      });
                    },
                    cancel: function () {
                      $uibModalInstance.close(false);
                    },
                  });
                },
              ],
            }).result;
          };
        };

        return {
          instance: function (params) {
            return new object(angular.isUndefined(params) ? {} : params);
          },
        };
      },
    ]);
  },
});
