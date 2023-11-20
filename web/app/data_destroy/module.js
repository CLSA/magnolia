cenozoApp.defineModule({
  name: "data_destroy",
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
        singular: "data destroy",
        plural: "data destroy",
        possessive: "data destroy's",
      },
      columnList: {
        name: { title: "Name" },
        datetime: { title: "Date & Time", type: "datetime" },
      },
      defaultOrder: {
        column: "data_destroy.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      identifier: {
        title: "Identifier",
        column: "reqn.identifier",
        type: "string",
        isConstant: true,
        isExcluded: 'add',
      },
      name: {
        title: "", // defined below
        type: "string",
      },
      datetime: {
        title: "", // defined below
        type: "datetime",
      },
      lang: { column: "language.code", type: "string", isExcluded: true },

      // the following are for the form and will not appear in the view
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnDataDestroyAdd", [
      "CnDataDestroyModelFactory",
      "CnHttpFactory",
      "CnReqnHelper",
      function (CnDataDestroyModelFactory, CnHttpFactory, CnReqnHelper) {
        return {
          templateUrl: module.getFileUrl("add.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnDataDestroyModelFactory.root;

            $scope.$on("cnRecordAdd ready", async function (event, data) {
              var cnRecordAddScope = data;
              var parent = $scope.model.getParentIdentifier();
              var lang = "en";
              if ("destruction_report" == parent.subject) {
                var response = await CnHttpFactory.instance({
                  path: "destruction_report/" + parent.identifier,
                  data: {
                    select: {
                      column: {
                        table: "language",
                        column: "code",
                        alias: "lang",
                      },
                    },
                  },
                }).get();
                lang = response.data.lang;
              }

              await $scope.model.updateLanguage(lang);

              // translate the cancel and save buttons
              angular.extend(cnRecordAddScope, {
                getCancelText: function () {
                  return CnReqnHelper.translate("dataDestroy", "cancel", lang);
                },

                getSaveText: function () {
                  return CnReqnHelper.translate("dataDestroy", "save", lang);
                },
              });
            });
          },
        };
      },
    ]);

  },
});
