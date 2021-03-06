cenozoApp.defineModule({
  name: "output",
  dependencies: ["reqn"],
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: [
          {
            subject: "reqn",
            column: "reqn.identifier",
          },
          {
            subject: "final_report",
            column: "final_report.id",
          },
        ],
      },
      name: {
        singular: "output",
        plural: "outputs",
        possessive: "output's",
      },
      columnList: {
        identifier: {
          column: "reqn.identifier",
          title: "Requisition",
          isIncluded: function ($state, model) {
            return "output_type" == model.getSubjectFromState();
          },
        },
        output_type_en: {
          column: "output_type.name_en",
          title: "", // defined by the reqn, output_type and final_report modules
          isIncluded: function () {
            return true;
          },
        },
        output_type_fr: {
          column: "output_type.name_fr",
          title: "", // defined by the reqn, output_type and final_report modules
          isIncluded: function () {
            return false;
          },
        },
        detail: {
          title: "", // defined by the reqn, output_type and final_report modules
        },
        output_source_count: {
          title: "", // defined by the reqn, output_type and final_report modules
        },
      },
      defaultOrder: {
        column: "detail",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      reqn_id: {
        column: "output.reqn_id",
        title: "Requisition",
        type: "lookup-typeahead",
        typeahead: {
          table: "reqn",
          select: "reqn.identifier",
          where: ["reqn.identifier"],
        },
        isExcluded: function ($state, model) {
          return "output_type" != model.getSubjectFromState();
        },
      },
      output_type_id: {
        title: "", // defined below
        type: "enum",
      },
      detail: {
        title: "", // defined below
        type: "string",
      },
      identifier: {
        column: "reqn.identifier",
        type: "string",
        isExcluded: true,
      },
      final_report_id: {
        column: "final_report.id",
        type: "string",
        isExcluded: true,
      },
      lang: { column: "language.code", type: "string", isExcluded: true },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnOutputAdd", [
      "CnOutputModelFactory",
      "CnHttpFactory",
      "CnReqnHelper",
      function (CnOutputModelFactory, CnHttpFactory, CnReqnHelper) {
        return {
          templateUrl: module.getFileUrl("add.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnOutputModelFactory.root;

            $scope.$on("cnRecordAdd ready", async function (event, data) {
              var cnRecordAddView = data;
              var parent = $scope.model.getParentIdentifier();
              var lang = "en";
              if ("final_report" == parent.subject) {
                var response = await CnHttpFactory.instance({
                  path: "final_report/" + parent.identifier,
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
              angular.extend(cnRecordAddView, {
                getCancelText: function () {
                  return CnReqnHelper.translate("output", "cancel", lang);
                },
                getSaveText: function () {
                  return CnReqnHelper.translate("output", "save", lang);
                },
              });
            });
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.directive("cnOutputList", [
      "CnOutputModelFactory",
      function (CnOutputModelFactory) {
        return {
          templateUrl: module.getFileUrl("list.tpl.html"),
          restrict: "E",
          scope: {
            model: "=?",
            simple: "@",
          },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnOutputModelFactory.root;
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.directive("cnOutputView", [
      "CnOutputModelFactory",
      "CnReqnHelper",
      function (CnOutputModelFactory, CnReqnHelper) {
        return {
          templateUrl: module.getFileUrl("view.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnOutputModelFactory.root;

            // get the child cn-record-add's scope
            $scope.$on("cnRecordView ready", function (event, data) {
              var cnRecordViewScope = data;
              var origin = $scope.model.getQueryParameter("origin", true);
              cnRecordViewScope.baseParentExistsFn =
                cnRecordViewScope.parentExists;
              angular.extend(cnRecordViewScope, {
                // don't show the option to view the parent reqn to the applicant
                parentExists: function (subject) {
                  return $scope.model.isRole("applicant", "designate") &&
                    "reqn" == subject
                    ? false
                    : cnRecordViewScope.baseParentExistsFn(subject);
                },
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
                  return "final_report" == subject && "final_report" == origin
                    ? CnReqnHelper.translate(
                        "output",
                        "viewFinalReport",
                        $scope.model.viewModel.record.lang
                      )
                    : "View " + cnRecordViewScope.parentName(subject);
                },
              });
            });

            // note, we are changing the output-source list, not the output list
            $scope.$on("cnRecordList ready", function (event, data) {
              var cnRecordListScope = data;
              var origin = $scope.model.getQueryParameter("origin", true);
              angular.extend(cnRecordListScope, {
                getAddText: function () {
                  return CnReqnHelper.translate(
                    "output",
                    "add",
                    "final_report" == origin
                      ? $scope.model.viewModel.record.lang
                      : "en"
                  );
                },
              });
            });
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnOutputAddFactory", [
      "CnBaseAddFactory",
      "CnHttpFactory",
      "CnReqnHelper",
      function (CnBaseAddFactory, CnHttpFactory, CnReqnHelper) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);

          this.onNew = async function (record) {
            var parent = this.parentModel.getParentIdentifier();
            var lang = "en";

            await this.$$onNew(record);

            if ("final_report" == parent.subject) {
              var response = await CnHttpFactory.instance({
                path: "final_report/" + parent.identifier,
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

            await this.parentModel.updateLanguage(lang);
            this.heading = CnReqnHelper.translate(
              "output",
              "createOutput",
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
    cenozo.providers.factory("CnOutputListFactory", [
      "CnBaseListFactory",
      function (CnBaseListFactory) {
        var object = function (parentModel) {
          CnBaseListFactory.construct(this, parentModel);

          // The final report's output list is in "simple" mode which means the pagination widget isn't visible,
          // so to make sure that all records show changethe itemsPerPage value to 100 (it is assumed that no
          // reqn will have more than 100 outputs)
          this.onList = async function (replace) {
            this.paginationModel.itemsPerPage =
              "final_report" == this.parentModel.getSubjectFromState()
                ? 100
                : 20;
            await this.$$onList(replace);
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
    cenozo.providers.factory("CnOutputViewFactory", [
      "CnBaseViewFactory",
      "CnReqnModelFactory",
      "CnReqnHelper",
      function (CnBaseViewFactory, CnReqnModelFactory, CnReqnHelper) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          angular.extend(this, {
            getViewReqnEnabled: function () {
              return CnReqnModelFactory.root.getViewEnabled();
            },

            updateOutputSourceListLanguage: function (lang) {
              var columnList = cenozoApp.module("output_source").columnList;
              columnList.filename.title = CnReqnHelper.translate(
                "output",
                "filename",
                lang
              );
              columnList.url.title = CnReqnHelper.translate(
                "output",
                "url",
                lang
              );
            },

            onView: async function (force) {
              await this.$$onView(force);
              var origin = this.parentModel.getQueryParameter("origin", true);
              var lang = "final_report" == origin ? this.record.lang : "en";
              await this.parentModel.updateLanguage(lang);
              this.updateOutputSourceListLanguage(lang);
              this.outputSourceModel.listModel.heading = CnReqnHelper.translate(
                "output",
                "outputSourceListHeading",
                lang
              );
              this.heading = CnReqnHelper.translate(
                "output",
                "outputDetails",
                lang
              );
            },
          });
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnOutputModelFactory", [
      "CnBaseModelFactory",
      "CnOutputAddFactory",
      "CnOutputListFactory",
      "CnOutputViewFactory",
      "CnSession",
      "CnHttpFactory",
      "CnReqnHelper",
      "$state",
      function (
        CnBaseModelFactory,
        CnOutputAddFactory,
        CnOutputListFactory,
        CnOutputViewFactory,
        CnSession,
        CnHttpFactory,
        CnReqnHelper,
        $state
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnOutputAddFactory.instance(this);
          this.listModel = CnOutputListFactory.instance(this);
          this.viewModel = CnOutputViewFactory.instance(this, root);

          angular.extend(this, {
            updateLanguage: async function (lang) {
              var group = this.module.inputGroupList.findByProperty(
                "title",
                ""
              );
              group.inputList.output_type_id.title = CnReqnHelper.translate(
                "output",
                "output_type",
                lang
              );
              group.inputList.detail.title = CnReqnHelper.translate(
                "output",
                "detail",
                lang
              );
              await this.metadata.getPromise();
              this.metadata.columnList.output_type_id.enumList =
                this.metadata.columnList.output_type_id.enumLists[lang];
            },

            setupBreadcrumbTrail: function () {
              // change the breadcrumb trail based on the origin parameter
              this.$$setupBreadcrumbTrail();
              var origin = this.getQueryParameter("origin", true);
              if ("final_report" == origin) {
                var parent = this.getParentIdentifier();
                var index = CnSession.breadcrumbTrail.findIndexByProperty(
                  "title",
                  "Final Report"
                );
                CnSession.breadcrumbTrail[index + 1].go = async function () {
                  await $state.go("final_report.view", {
                    identifier: parent.identifier,
                    t: "part2",
                  });
                };
                delete CnSession.breadcrumbTrail[index].go;
              }
            },

            getParentIdentifier: function () {
              var parentIdentifier = {};

              // make sure to use the appropriate parent based on the origin parameter
              var origin = this.getQueryParameter("origin");
              if ("final_report" == origin) {
                var parent = this.module.identifier.parent.findByProperty(
                  "subject",
                  "final_report"
                );
                parentIdentifier = {
                  subject: parent.subject,
                  identifier: parent.getIdentifier(this.viewModel.record),
                };
                if (angular.isDefined(parent.friendly))
                  parentIdentifier.friendly = parent.friendly;
              } else {
                parentIdentifier = this.$$getParentIdentifier();
              }

              return parentIdentifier;
            },

            transitionToAddState: async function () {
              if ("final_report" == this.getSubjectFromState()) {
                await $state.go("^.add_" + this.module.subject.snake, {
                  parentIdentifier: $state.params.identifier,
                  origin: "final_report",
                });
              } else {
                await this.$$transitionToAddState();
              }
            },

            transitionToViewState: async function (record) {
              // add the origin when transitioning to the view state
              var stateName = $state.current.name;
              var stateParams = {
                identifier: record.getIdentifier(),
                origin: this.getSubjectFromState(),
              };
              if ("view" == stateName.substring(stateName.lastIndexOf(".") + 1))
                stateParams.parentIdentifier = $state.params.identifier;
              await $state.go(this.module.subject.snake + ".view", stateParams);
            },

            transitionToLastState: async function () {
              // if we're transitioning back to the final report then load the output list in part2
              if ("final_report" == this.getSubjectFromState()) {
                await $state.go("final_report.view", {
                  identifier: this.getParentIdentifier().identifier,
                  t: "part2",
                });
              } else {
                await this.$$transitionToLastState();
              }
            },

            transitionToParentViewState: async function (subject, identifier) {
              // if we're transitioning back to the final report then load the output list in part2
              return "final_report" == subject
                ? await $state.go("final_report.view", {
                    identifier: this.viewModel.record.final_report_id,
                    t: "part2",
                  })
                : await this.$$transitionToParentViewState(subject, identifier);
            },

            getMetadata: async function () {
              await this.$$getMetadata();

              var response = await CnHttpFactory.instance({
                path: "output_type",
                data: {
                  select: { column: ["id", "name_en", "name_fr"] },
                  modifier: { order: "name_en", limit: 1000 },
                },
              }).query();

              // we need both languages, we'll dynamically choose which one to use
              this.metadata.columnList.output_type_id.enumLists = {
                en: [],
                fr: [],
              };
              response.data.forEach((item) => {
                this.metadata.columnList.output_type_id.enumLists.en.push({
                  value: item.id,
                  name: item.name_en,
                });
                this.metadata.columnList.output_type_id.enumLists.fr.push({
                  value: item.id,
                  name: item.name_fr,
                });
              });

              // sort the french enum list
              this.metadata.columnList.output_type_id.enumLists.fr.sort(
                (a, b) => (a.name < b.name ? -1 : a.name == b.name ? 0 : 1)
              );
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
