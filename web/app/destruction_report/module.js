cenozoApp.defineModule({
  name: "destruction_report",
  dependencies: ["data_destroy"],
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "reqn",
          column: "reqn.identifier",
        },
      },
      name: {
        singular: "destruction report",
        plural: "destruction reports",
        possessive: "destruction report's",
      },
      columnList: {
        version: {
          title: "Version",
          type: "rank",
        },
        datetime: {
          title: "Date & Time",
          type: "datetime",
        },
      },
      defaultOrder: {
        column: "destruction_report.version",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      identifier: {
        column: "reqn.identifier",
        title: "Identifier",
        type: "string",
      },

      // the following are for the form and will not appear in the view
      version: { type: "string" },
      current_reqn_version_id: { column: "reqn_version.id", type: "string" },
      trainee_user_id: { column: "reqn.trainee_user_id", type: "string" },
      designate_user_id: { column: "reqn.designate_user_id", type: "string" },
      state: { column: "reqn.state", type: "string" },
      stage_type: { column: "stage_type.name", type: "string" },
      phase: { column: "stage_type.phase", type: "string" },
      lang: { column: "language.code", type: "string" },
      deferral_note_destruction: { column: "reqn.deferral_note_destruction", type: "text" },
      current_final_report_id: { column: "final_report.id", type: "string" },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnDestructionReportView", [
      "CnDestructionReportModelFactory",
      "cnRecordViewDirective",
      "CnReqnModelFactory",
      "CnReqnHelper",
      "CnSession",
      function (
        CnDestructionReportModelFactory,
        cnRecordViewDirective,
        CnReqnModelFactory,
        CnReqnHelper,
        CnSession
      ) {
        // used to piggy-back on the basic view controller's functionality
        var cnRecordView = cnRecordViewDirective[0];
        var reqnModel = CnReqnModelFactory.instance();

        return {
          templateUrl: module.getFileUrl("view.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          link: function (scope, element, attrs) {
            cnRecordView.link(scope, element, attrs);

            scope.model.viewModel.afterView(function () {
              // setup the breadcrumbtrail
              CnSession.setBreadcrumbTrail([
                {
                  title: reqnModel.module.name.plural.ucWords(),
                  go: async function () {
                    await reqnModel.transitionToListState();
                  },
                },
                {
                  title: scope.model.viewModel.record.identifier,
                  go: async function () {
                    await reqnModel.transitionToViewState({
                      getIdentifier: function () {
                        return (
                          "identifier=" +
                          scope.model.viewModel.record.identifier
                        );
                      },
                    });
                  },
                },
                {
                  title: scope.model.module.name.singular.ucWords(),
                  go: async function () {
                    await scope.model.transitionToViewState(
                      scope.model.viewModel.record
                    );
                  },
                },
              ]);
            });

            scope.model.viewModel.onView();
          },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model)) $scope.model = CnDestructionReportModelFactory.root;
            cnRecordView.controller[1]($scope);
            $scope.t = function (value) {
              return $scope.model.viewModel.record.lang ?
                CnReqnHelper.translate("destructionReport", value, $scope.model.viewModel.record.lang) : "";
            };

            $scope.getHeading = function () {
              var status = null;
              if ("deferred" == $scope.model.viewModel.record.state) {
                status = $scope.model.isRole("applicant", "designate")
                  ? "Action Required"
                  : "Deferred to Applicant";
              } else if ($scope.model.viewModel.record.state) {
                status = $scope.model.viewModel.record.state.ucWords();
              }

              return [
                $scope.t("heading"), "-", $scope.model.viewModel.record.identifier,
                "version", $scope.model.viewModel.record.version,
                null != status ? "(" + status + ")" : "",
              ].join(" ");
            };
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnDestructionReportViewFactory", [
      "CnBaseViewFactory",
      "CnReqnHelper",
      "CnHttpFactory",
      "CnModalMessageFactory",
      "CnModalConfirmFactory",
      "CnModalDatetimeFactory",
      "CnSession",
      "$state",
      function (
        CnBaseViewFactory,
        CnReqnHelper,
        CnHttpFactory,
        CnModalMessageFactory,
        CnModalConfirmFactory,
        CnModalDatetimeFactory,
        CnSession,
        $state
      ) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          angular.extend(this, {
            isLoading: false,
            translate: function (value) {
              return this.record.lang
                ? CnReqnHelper.translate("destructionReport", value, this.record.lang)
                : "";
            },
            show: function (subject) {
              return CnReqnHelper.showAction(subject, this.record);
            },
            viewReqn: function () {
              return this.parentModel.transitionToParentViewState(
                "reqn",
                "identifier=" + this.record.identifier
              );
            },
            viewReqnVersion: async function () {
              await this.parentModel.transitionToParentViewState(
                "reqn_version",
                this.record.current_reqn_version_id
              );
            },
            viewFinalReport: async function () {
              await $state.go("final_report.view", {
                identifier: this.record.current_final_report_id,
              });
            },

            onView: async function (force) {
              // reset tab value
              this.setFormTab(this.parentModel.getQueryParameter("t"), false);
              await this.$$onView(force);
              cenozoApp.setLang(this.record.lang);

              // get a list of all data-destroy
              this.isLoading = true;
              this.dataDestroyList = [];
              try {
                const response = await CnHttpFactory.instance({
                  path: "reqn/identifier=" + this.record.identifier + '/data_destroy',
                  data: { select: { column: ["id", "name", "datetime"] } },
                }).query();

                this.dataDestroyList = response.data.map( row => {
                  angular.extend(row, {
                    // format all datetimes
                    formattedDatetime: CnSession.formatValue(row.datetime, "datetime", true),
                    // track when patching
                    isPatching: false,
                  });
                  return row;
                });
              } finally {
                this.isLoading = false;
              }
            },

            onPatch: async function (data) {
              var property = Object.keys(data)[0];
              if (!this.parentModel.getEditEnabled())
                throw new Error("Calling onPatch() but edit is not enabled.");

              if (null == property.match(/^deferral_note/)) {
                await this.$$onPatch(data);
              } else {
                // make sure to send patches to deferral notes to the parent reqn
                var parent = this.parentModel.getParentIdentifier();
                var httpObj = {
                  path: parent.subject + "/" + parent.identifier,
                  data: data,
                };
                var self = this;
                httpObj.onError = function (response) {
                  self.onPatchError(response);
                };
                try {
                  await CnHttpFactory.instance(httpObj).patch();
                  this.afterPatchFunctions.forEach((fn) => fn());
                } catch (error) {
                  // handled by onError above
                }
              }
            },

            selectDataDestroyDatetime: async function(dataDestroy) {
              if (this.parentModel.getEditEnabled()) {
                const response = await CnModalDatetimeFactory.instance({
                  title: "Select Date & Time of Destruction",
                  date: dataDestroy.datetime ? dataDestroy.datetime : moment(),
                  maxDate: "now",
                  pickerType: "datetime",
                  emptyAllowed: true,
                }).show();

                console.log( response );
                if (false !== response) {
                  dataDestroy.isPatching = true;
                  try {
                    await CnHttpFactory.instance({
                      path: "data_destroy/" + dataDestroy.id,
                      data: { datetime: response },
                      onError: function (error) {
                        CnModalMessageFactory.httpError(error);
                      },
                    }).patch();

                    angular.extend(dataDestroy, {
                      datetime: response,
                      formattedDatetime: CnSession.formatValue(response, "datetime", true),
                    });
                  } finally {
                    dataDestroy.isPatching = false;
                  }
                }
              }
            },

            // setup language and tab state parameters
            toggleLanguage: function () {
              this.record.lang = "en" == this.record.lang ? "fr" : "en";

              return CnHttpFactory.instance({
                path: "reqn/identifier=" + this.record.identifier,
                data: { language: this.record.lang },
              }).patch();
            },

            formTab: "",
            tabSectionList: ["instructions", "dataList"],
            setFormTab: async function (tab, transition) {
              if (angular.isUndefined(transition)) transition = true;

              // find the tab section
              var selectedTabSection = null;
              this.tabSectionList.some((tabSection) => {
                if (tab == tabSection) {
                  selectedTabSection = tabSection;
                  return true;
                }
              });

              // get the tab (or default of none was found)
              tab =
                null != selectedTabSection
                  ? selectedTabSection
                  : "instructions";

              this.formTab = tab;
              this.parentModel.setQueryParameter("t", tab);

              if (transition)
                await this.parentModel.reloadState(false, false, "replace");

              // update all textarea sizes
              angular.element("textarea[cn-elastic]").trigger("elastic");
            },

            nextSection: async function (reverse) {
              if (angular.isUndefined(reverse)) reverse = false;

              var currentTabSectionIndex = this.tabSectionList.indexOf(
                this.formTab
              );
              if (null != currentTabSectionIndex) {
                var tabSection =
                  this.tabSectionList[
                    currentTabSectionIndex + (reverse ? -1 : 1)
                  ];
                if (angular.isDefined(tabSection))
                  await this.setFormTab(tabSection);
              }
            },

            downloadDestructionReport: async function () {
              await CnReqnHelper.download(
                "destruction_report",
                this.record.getIdentifier()
              );
            },

            submit: async function () {
              var record = this.record;
              var response = await CnModalConfirmFactory.instance({
                title: this.translate("misc.pleaseConfirm"),
                noText: this.parentModel.isRole("applicant", "designate")
                  ? this.translate("misc.no")
                  : "No",
                yesText: this.parentModel.isRole("applicant", "designate")
                  ? this.translate("misc.yes")
                  : "Yes",
                message: this.translate("misc.submitWarning"),
              }).show();

              if (response) {
                var parent = this.parentModel.getParentIdentifier();
                await CnHttpFactory.instance({
                  path: parent.subject + "/" + parent.identifier + "?action=submit",
                }).patch();

                var code =
                  CnSession.user.id == this.record.trainee_user_id ? "traineeSubmit" :
                  CnSession.user.id == this.record.designate_user_id ? "designateSubmit" : "submit";
                await CnModalMessageFactory.instance({
                  title: this.translate("misc." + code + "Title"),
                  message: this.translate("misc." + code + "Message"),
                  closeText: this.translate("misc.close"),
                }).show();

                if (this.parentModel.isRole("applicant", "designate")) {
                  await $state.go("root.home");
                } else {
                  await this.onView(true); // refresh
                }
              }
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
    cenozo.providers.factory("CnDestructionReportModelFactory", [
      "CnBaseModelFactory",
      "CnDestructionReportListFactory",
      "CnDestructionReportViewFactory",
      "CnReqnHelper",
      "CnSession",
      "$state",
      function (
        CnBaseModelFactory,
        CnDestructionReportListFactory,
        CnDestructionReportViewFactory,
        CnReqnHelper,
        CnSession,
        $state
      ) {
        var object = function (type) {
          CnBaseModelFactory.construct(this, module);
          this.type = type;
          this.listModel = CnDestructionReportListFactory.instance(this);

          angular.extend(this, {
            viewModel: CnDestructionReportViewFactory.instance(
              this,
              "root" == this.type
            ),
            inputList: {},

            getMetadata: async function() {
              await this.$$getMetadata();

              // create generic yes/no enum
              const misc = CnReqnHelper.lookupData.destructionReport.misc;
              this.metadata.yesNoEnumList = {
                en: [
                  { value: "", name: misc.choose.en },
                  { value: true, name: misc.yes.en },
                  { value: false, name: misc.no.en },
                ],
                fr: [
                  { value: "", name: misc.choose.fr },
                  { value: true, name: misc.yes.fr },
                  { value: false, name: misc.no.fr },
                ],
              };
            },

            getEditEnabled: function () {
              var stage_type = this.viewModel.record.stage_type ? this.viewModel.record.stage_type : "";
              var state = this.viewModel.record.state ? this.viewModel.record.state : "";

              // only edit when in the data destruction stage
              return this.$$getEditEnabled() && "Data Destruction" == stage_type && (
                // applicants and designates can only edit when the reqn is deferred
                this.isRole("applicant", "designate") ? "deferred" == state : true
              );
            },

            setupBreadcrumbTrail: function () {
              var trail = [];

              if (this.isRole("applicant", "designate")) {
                trail = [
                  { title: "Destruction Report" },
                  { title: this.viewModel.record.identifier },
                ];
              } else {
                trail = [
                  {
                    title: "Requisitions",
                    go: async () => {
                      await $state.go("reqn.list");
                    },
                  },
                  {
                    title: this.viewModel.record.identifier,
                    go: async () => {
                      await $state.go("reqn.view", {
                        identifier:
                          "identifier=" + this.viewModel.record.identifier,
                      });
                    },
                  },
                  {
                    title:
                      "Destruction Report version " + this.viewModel.record.version,
                  },
                ];
              }

              CnSession.setBreadcrumbTrail(trail);
            },
          });

          // make the input lists from all groups more accessible
          module.inputGroupList.forEach((group) =>
            Object.assign(this.inputList, group.inputList)
          );
        };

        return {
          root: new object("root"),
          instance: function () {
            return new object();
          },
        };
      },
    ]);
  },
});
