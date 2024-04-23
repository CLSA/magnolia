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
      data: {
        title: "", // defined below
        type: "base64",
        mimeType: "application/pdf",
        getFilename: function ($state, model) {
          return model.viewModel.record.filename;
        },
      },
      url: {
        title: "", // defined below
        type: "string",
      },
      filename: { type: "string", isExcluded: true },
      detail: { column: "output.detail", isExcluded: true },
      lang: { column: "language.code", type: "string", isExcluded: true },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnOutputSourceAdd", [
      "CnOutputSourceModelFactory",
      "CnModalMessageFactory",
      "CnHttpFactory",
      "CnLocalization",
      function (
        CnOutputSourceModelFactory,
        CnModalMessageFactory,
        CnHttpFactory,
        CnLocalization
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
                  data: { select: { column: { table: "language", column: "code", alias: "lang" } } },
                }).get();
                lang = response.data.lang;
              }

              cnRecordAddScope.baseSaveFn = cnRecordAddScope.save;
              angular.extend(cnRecordAddScope, {
                getCancelText: function () { return CnLocalization.translate("output", "cancel", lang); },
                getSaveText: function () { return CnLocalization.translate("output", "save", lang); },
                save: function () {
                  if (
                    !$scope.model.addModel.hasFile("data") &&
                    angular.isUndefined(cnRecordAddScope.record.url)
                  ) {
                    CnModalMessageFactory.instance({
                      title: CnLocalization.translate("output", "newOutputSourceTitle", lang),
                      message: CnLocalization.translate("output", "newOutputSourceMessage", lang),
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
      "CnLocalization",
      function (
        CnOutputSourceModelFactory,
        CnModalMessageFactory,
        CnLocalization
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
                  return "final_report" == origin ?
                    CnLocalization.translate("output", "delete", $scope.model.viewModel.record.lang) :
                    "Delete";
                },
                getViewText: function (subject) {
                  return "final_report" == origin ?
                    CnLocalization.translate("output", "viewOutput", $scope.model.viewModel.record.lang) :
                    "View " + cnRecordViewScope.parentName(subject);
                },
                patch: function () {
                  const record = $scope.model.viewModel.record;
                  const backupRecord = $scope.model.viewModel.backupRecord;
                  const formattedRecord = $scope.model.viewModel.formattedRecord;
                  if ((!record.data || 0 == record.data.size) && !record.url) {
                    CnModalMessageFactory.instance({
                      title: "Please Note",
                      message: "You must provide either a file or web link (URL)",
                      error: true,
                    }).show();

                    // undo the change
                    if (record.data != backupRecord.data) {
                      record.data = backupRecord.data;
                      formattedRecord.data = backupRecord.formatted_data;
                    }
                    if (record.url != backupRecord.url) record.url = backupRecord.url;
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
      "CnLocalization",
      function (CnBaseAddFactory, CnHttpFactory, CnLocalization) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);

          angular.extend(this, {
            onNew: async function (record) {
              await this.$$onNew(record);
              var parent = this.parentModel.getParentIdentifier();
              var origin = this.parentModel.getQueryParameter("origin", true);
              var lang = "en";

              if ("final_report" == origin) {
                if (angular.isDefined(parent.identifier)) {
                  var response = await CnHttpFactory.instance({
                    path: "output/" + parent.identifier,
                    data: { select: { column: { table: "language", column: "code", alias: "lang" } } },
                  }).get();
                  lang = response.data.lang;
                }
              }

              this.parentModel.updateLanguage(lang);
              this.heading = CnLocalization.translate("output", "createOutputSource", lang);
            },

            // extend onAdd to automatically set the filename property
            onAdd: async function (record) {
              record.filename = this.fileList.findByProperty("key", "data").getFilename();
              await this.$$onAdd(record);
            }
          });
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
      "CnLocalization",
      "CnHttpFactory",
      function (CnBaseViewFactory, CnLocalization, CnHttpFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          this.onView = async function (force) {
            await this.$$onView(force);

            var origin = this.parentModel.getQueryParameter("origin", true);
            var lang = "final_report" == origin ? this.record.lang : "en";
            this.parentModel.updateLanguage(lang);
            this.heading = CnLocalization.translate("output", "outputSourceDetails", lang);
          };

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

    /* ############################################################################################## */
    cenozo.providers.factory("CnOutputSourceModelFactory", [
      "CnBaseModelFactory",
      "CnOutputSourceAddFactory",
      "CnOutputSourceListFactory",
      "CnOutputSourceViewFactory",
      "CnSession",
      "CnLocalization",
      "$state",
      function (
        CnBaseModelFactory,
        CnOutputSourceAddFactory,
        CnOutputSourceListFactory,
        CnOutputSourceViewFactory,
        CnSession,
        CnLocalization,
        $state
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnOutputSourceAddFactory.instance(this);
          this.listModel = CnOutputSourceListFactory.instance(this);
          this.viewModel = CnOutputSourceViewFactory.instance(this, root);

          angular.extend(this, {
            getDeleteEnabled: function() {
              var phase = this.viewModel.record.phase ? this.viewModel.record.phase : "";
              var state = this.viewModel.record.state ? this.viewModel.record.state : "";

              return this.$$getDeleteEnabled() && (
                // applicants and designates can only change sources if the reqn is deferred
                this.isRole("applicant","designate") ? "deferred" == phase : true
              );
            },

            getEditEnabled: function() {
              var phase = this.viewModel.record.phase ? this.viewModel.record.phase : "";
              var state = this.viewModel.record.state ? this.viewModel.record.state : "";

              return this.$$getEditEnabled() && (
                // applicants and designates can only change sources if the reqn is deferred
                this.isRole("applicant","designate") ? "deferred" == phase : true
              );
            },

            updateLanguage: function (lang) {
              var group = this.module.inputGroupList.findByProperty("title", "");
              group.inputList.data.title = CnLocalization.translate("output", "attachment", lang);
              group.inputList.url.title = CnLocalization.translate("output", "url", lang);
            },

            setupBreadcrumbTrail: function () {
              // change the breadcrumb trail based on the origin parameter
              this.$$setupBreadcrumbTrail();
              var origin = this.getQueryParameter("origin", true);
              if ("final_report" == origin) {
                var parent = this.getParentIdentifier();
                var index = CnSession.breadcrumbTrail.findIndexByProperty("title", "Output");
                CnSession.breadcrumbTrail[index + 1].go = async function () {
                  await $state.go("output.view", { identifier: parent.identifier, origin: origin });
                };
                delete CnSession.breadcrumbTrail[index].go;
              }
            },

            transitionToAddState: async function () {
              var origin = this.getQueryParameter("origin", true);
              if ("final_report" == origin) {
                await $state.go(
                  "^.add_" + this.module.subject.snake,
                  { parentIdentifier: $state.params.identifier, origin: origin }
                );
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
              var stateParams = { identifier: this.getParentIdentifier().identifier, };
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
