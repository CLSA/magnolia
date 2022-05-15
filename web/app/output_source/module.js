cenozoApp.defineModule({
  name: "output_source",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "output",
          column: "output.id",
          friendly: "detail",
        },
      },
      name: {
        singular: "source",
        plural: "sources",
        possessive: "source's",
      },
      columnList: {
        filename: { title: "" }, // defined by directives at run-time
        url: { title: "" }, // defined by directives at run-time
      },
      defaultOrder: {
        column: "output_source.id",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      filename: {
        title: "", // defined below
        type: "file",
      },
      url: {
        title: "", // defined below
        type: "string",
      },
      detail: {
        column: "output.detail",
        isExcluded: true,
      },
      lang: { column: "language.code", type: "string", isExcluded: true },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnOutputSourceAdd", [
      "CnOutputSourceModelFactory",
      "CnModalMessageFactory",
      "CnHttpFactory",
      "CnReqnHelper",
      function (
        CnOutputSourceModelFactory,
        CnModalMessageFactory,
        CnHttpFactory,
        CnReqnHelper
      ) {
        return {
          templateUrl: module.getFileUrl("add.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnOutputSourceModelFactory.root;

            // get the child cn-record-add's scope
            $scope.$on("cnRecordAdd ready", async function (event, data) {
              var cnRecordAddScope = data;
              var parent = $scope.model.getParentIdentifier();
              var origin = $scope.model.getQueryParameter("origin", true);
              var lang = "en";
              if ("final_report" == origin) {
                var response = await CnHttpFactory.instance({
                  path: "output/" + parent.identifier,
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

              cnRecordAddScope.baseSaveFn = cnRecordAddScope.save;
              angular.extend(cnRecordAddScope, {
                getCancelText: function () {
                  return CnReqnHelper.translate("output", "cancel", lang);
                },
                getSaveText: function () {
                  return CnReqnHelper.translate("output", "save", lang);
                },
                save: function () {
                  if (
                    !$scope.model.addModel.hasFile("filename") &&
                    angular.isUndefined(cnRecordAddScope.record.url)
                  ) {
                    CnModalMessageFactory.instance({
                      title: CnReqnHelper.translate(
                        "output",
                        "newOutputSourceTitle",
                        lang
                      ),
                      message: CnReqnHelper.translate(
                        "output",
                        "newOutputSourceMessage",
                        lang
                      ),
                      error: true,
                    }).show();
                  } else cnRecordAddScope.baseSaveFn();
                },
              });
            });
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.directive("cnOutputSourceView", [
      "CnOutputSourceModelFactory",
      "CnModalMessageFactory",
      "CnReqnHelper",
      function (
        CnOutputSourceModelFactory,
        CnModalMessageFactory,
        CnReqnHelper
      ) {
        return {
          templateUrl: module.getFileUrl("view.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnOutputSourceModelFactory.root;

            // get the child cn-record-add's scope
            $scope.$on("cnRecordView ready", function (event, data) {
              var cnRecordViewScope = data;
              var origin = $scope.model.getQueryParameter("origin", true);
              cnRecordViewScope.basePatchFn = cnRecordViewScope.patch;
              angular.extend(cnRecordViewScope, {
                getDeleteText: function () {
                  return "final_report" == origin
                    ? CnReqnHelper.translate(
                        "output",
                        "delete",
                        $scope.model.viewModel.record.lang
                      )
                    : "Delete";
                },
                getViewText: function (subject) {
                  return "final_report" == origin
                    ? CnReqnHelper.translate(
                        "output",
                        "viewOutput",
                        $scope.model.viewModel.record.lang
                      )
                    : "View " + cnRecordViewScope.parentName(subject);
                },
                patch: function () {
                  if (
                    !$scope.model.viewModel.record.filename &&
                    !$scope.model.viewModel.record.url
                  ) {
                    CnModalMessageFactory.instance({
                      title: "Please Note",
                      message:
                        "You must provide either a file or web link (URL)",
                      error: true,
                    }).show();

                    // undo the change
                    if (
                      $scope.model.viewModel.record.filename !=
                      $scope.model.viewModel.backupRecord.filename
                    ) {
                      $scope.model.viewModel.record.filename =
                        $scope.model.viewModel.backupRecord.filename;
                      $scope.model.viewModel.formattedRecord.filename =
                        $scope.model.viewModel.backupRecord.formatted_filename;
                    }
                    if (
                      $scope.model.viewModel.record.url !=
                      $scope.model.viewModel.backupRecord.url
                    )
                      $scope.model.viewModel.record.url =
                        $scope.model.viewModel.backupRecord.url;
                  } else cnRecordViewScope.basePatchFn();
                },
              });
            });
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnOutputSourceAddFactory", [
      "CnBaseAddFactory",
      "CnHttpFactory",
      "CnReqnHelper",
      function (CnBaseAddFactory, CnHttpFactory, CnReqnHelper) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);
          this.configureFileInput("filename");

          this.onNew = async function (record) {
            var parent = this.parentModel.getParentIdentifier();
            var origin = this.parentModel.getQueryParameter("origin", true);
            var lang = "en";

            if ("final_report" == origin) {
              if (angular.isDefined(parent.identifier)) {
                var response = await CnHttpFactory.instance({
                  path: "output/" + parent.identifier,
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
            }

            this.parentModel.updateLanguage(lang);
            this.heading = CnReqnHelper.translate(
              "output",
              "createOutputSource",
              lang
            );
          };
        };
        return {
          instance: function (parentModel) {
            return new object(parentModel);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnOutputSourceViewFactory", [
      "CnBaseViewFactory",
      "CnReqnHelper",
      function (CnBaseViewFactory, CnReqnHelper) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);
          this.configureFileInput("filename");

          this.onView = async function (force) {
            await this.$$onView(force);

            var origin = this.parentModel.getQueryParameter("origin", true);
            var lang = "final_report" == origin ? this.record.lang : "en";
            this.parentModel.updateLanguage(lang);
            this.heading = CnReqnHelper.translate(
              "output",
              "outputSourceDetails",
              lang
            );
          };
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnOutputSourceModelFactory", [
      "CnBaseModelFactory",
      "CnOutputSourceAddFactory",
      "CnOutputSourceListFactory",
      "CnOutputSourceViewFactory",
      "CnSession",
      "CnReqnHelper",
      "$state",
      function (
        CnBaseModelFactory,
        CnOutputSourceAddFactory,
        CnOutputSourceListFactory,
        CnOutputSourceViewFactory,
        CnSession,
        CnReqnHelper,
        $state
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnOutputSourceAddFactory.instance(this);
          this.listModel = CnOutputSourceListFactory.instance(this);
          this.viewModel = CnOutputSourceViewFactory.instance(this, root);

          angular.extend(this, {
            updateLanguage: function (lang) {
              var group = this.module.inputGroupList.findByProperty(
                "title",
                ""
              );
              group.inputList.filename.title = CnReqnHelper.translate(
                "output",
                "filename",
                lang
              );
              group.inputList.url.title = CnReqnHelper.translate(
                "output",
                "url",
                lang
              );
            },

            setupBreadcrumbTrail: function () {
              // change the breadcrumb trail based on the origin parameter
              this.$$setupBreadcrumbTrail();
              var origin = this.getQueryParameter("origin", true);
              if ("final_report" == origin) {
                var parent = this.getParentIdentifier();
                var index = CnSession.breadcrumbTrail.findIndexByProperty(
                  "title",
                  "Output"
                );
                CnSession.breadcrumbTrail[index + 1].go = async function () {
                  await $state.go("output.view", {
                    identifier: parent.identifier,
                    origin: origin,
                  });
                };
                delete CnSession.breadcrumbTrail[index].go;
              }
            },

            transitionToAddState: async function () {
              var origin = this.getQueryParameter("origin", true);
              if ("final_report" == origin) {
                await $state.go("^.add_" + this.module.subject.snake, {
                  parentIdentifier: $state.params.identifier,
                  origin: origin,
                });
              } else {
                await this.$$transitionToAddState();
              }
            },

            transitionToViewState: async function (record) {
              var origin = this.getQueryParameter("origin", true);
              if ("final_report" == origin) {
                await $state.go("output_source.view", {
                  identifier: record.getIdentifier(),
                  parentIdentifier: $state.params.identifier,
                  origin: origin,
                });
              } else {
                await this.$$transitionToViewState(record);
              }
            },

            transitionToLastState: async function () {
              // include the origin in the parent output's state
              var stateParams = {
                identifier: this.getParentIdentifier().identifier,
              };
              var origin = this.getQueryParameter("origin", true);
              if (angular.isDefined(origin)) stateParams.origin = origin;
              await $state.go("output.view", stateParams);
            },

            transitionToParentViewState: async function (subject, identifier) {
              // include the origin in the parent output's state
              var stateParams = { identifier: identifier };
              var origin = this.getQueryParameter("origin", true);
              if (angular.isDefined(origin)) stateParams.origin = origin;
              await $state.go(subject + ".view", stateParams);
            },
          });
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
