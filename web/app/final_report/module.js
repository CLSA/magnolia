cenozoApp.defineModule({
  name: "final_report",
  dependencies: ["output"],
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
        singular: "final report",
        plural: "final reports",
        possessive: "final report's",
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
        column: "final_report.version",
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
      achieved_objectives: { type: "boolean" },
      findings: { type: "text" },
      thesis_title: { type: "text" },
      thesis_status: { type: "text" },
      impact: { type: "text" },
      opportunities: { type: "text" },
      dissemination: { type: "text" },
      waiver: { column: "reqn_version.waiver", type: "string" },
      current_destruction_report_id: { column: "destruction_report.id", type: "string" },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnFinalReportView", [
      "CnFinalReportModelFactory",
      "cnRecordViewDirective",
      "CnReqnModelFactory",
      "CnLocalization",
      "CnSession",
      function (
        CnFinalReportModelFactory,
        cnRecordViewDirective,
        CnReqnModelFactory,
        CnLocalization,
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
            scope.isDAO = function () { return scope.model.isRole("dao"); };
            scope.liteModel.viewModel.onView();
            scope.model.viewModel.afterView(function () {
              // setup the breadcrumbtrail
              CnSession.setBreadcrumbTrail([
                {
                  title: reqnModel.module.name.plural.ucWords(),
                  go: async function () { await reqnModel.transitionToListState(); },
                },
                {
                  title: scope.model.viewModel.record.identifier,
                  go: async function () {
                    await reqnModel.transitionToViewState({
                      getIdentifier: function () {
                        return ("identifier=" + scope.model.viewModel.record.identifier);
                      },
                    });
                  },
                },
                {
                  title: scope.model.module.name.singular.ucWords(),
                  go: async function () {
                    await scope.model.transitionToViewState(scope.model.viewModel.record);
                  },
                },
              ]);
            });

            scope.$watch("model.viewModel.record.findings", (text) => {
              scope.model.viewModel.charCount.findings = text ? text.length : 0;
            });
            scope.$watch("model.viewModel.record.impact", (text) => {
              scope.model.viewModel.charCount.impact = text ? text.length : 0;
            });
            scope.$watch("model.viewModel.record.opportunities", (text) => {
              scope.model.viewModel.charCount.opportunities = text ? text.length : 0;
            });
            scope.$watch("model.viewModel.record.dissemination", (text) => {
              scope.model.viewModel.charCount.dissemination = text ? text.length : 0;
            });
          },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model)) $scope.model = CnFinalReportModelFactory.root;
            if (angular.isUndefined($scope.liteModel)) $scope.liteModel = CnFinalReportModelFactory.lite;
            cnRecordView.controller[1]($scope);
            $scope.t = function (value) {
              return CnLocalization.translate("finalReport", value, $scope.model.viewModel.record.lang);
            };

            $scope.getHeading = function () {
              var status = null;
              if ("deferred" == $scope.model.viewModel.record.state) {
                status = $scope.model.isRole("applicant", "designate") ? "Action Required" : "Deferred to Applicant";
              } else if ($scope.model.viewModel.record.state) {
                status = $scope.model.viewModel.record.state.ucWords();
              }

              return [
                $scope.t("heading"),
                "-",
                $scope.model.viewModel.record.identifier,
                "version",
                $scope.model.viewModel.record.version,
                null != status ? "(" + status + ")" : "",
              ].join(" ");
            };

            $scope.compareTo = async function (version) {
              $scope.model.viewModel.compareRecord = version;
              $scope.liteModel.viewModel.compareRecord = version;
              $scope.model.setQueryParameter("c", null == version ? undefined : version.version);
              await $scope.model.reloadState(false, false, "replace");
            };
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnFinalReportViewFactory", [
      "CnBaseFormViewFactory",
      "CnOutputModelFactory",
      "CnLocalization",
      "CnHttpFactory",
      "CnModalMessageFactory",
      "CnModalConfirmFactory",
      "CnSession",
      "$state",
      function (
        CnBaseFormViewFactory,
        CnOutputModelFactory,
        CnLocalization,
        CnHttpFactory,
        CnModalMessageFactory,
        CnModalConfirmFactory,
        CnSession,
        $state
      ) {
        var object = function (parentModel, root) {
          CnBaseFormViewFactory.construct(this, "finalReport", parentModel, root);

          angular.extend(this, {
            compareRecord: null,
            versionList: [],
            charCount: {
              findings: 0,
              impact: 0,
              opportunities: 0,
              dissemination: 0,
            },

            tabList: [ "instructions", "part_1", "part_2", "part_3" ],

            onView: async function (force) {
              // reset tab value
              this.setFormTab(this.parentModel.getQueryParameter("t"), false);

              // reset compare version and differences
              this.compareRecord = null;

              await this.$$onView(force);

              // used in the breadcrumb trail
              this.record.version_name = this.record.version;

              if ("lite" != this.parentModel.type) {
                this.updateOutputListLanguage(this.record.lang);
                await this.getVersionList();
              }
            },

            updateOutputListLanguage: function (lang) {
              var columnList = cenozoApp.module("output").columnList;
              columnList.output_type_en.isIncluded = function ($state, model) { return "en" == lang; };
              columnList.output_type_fr.isIncluded = function ($state, model) { return "fr" == lang; };
              columnList.output_type_en.title = CnLocalization.translate("output", "output_type", "en");
              columnList.output_type_fr.title = CnLocalization.translate("output", "output_type", "fr");
              columnList.detail.title = CnLocalization.translate("output", "detail", lang);
              columnList.output_source_count.title = CnLocalization.translate("output", "output_source_count", lang);
            },

            // setup language and tab state parameters
            toggleLanguage: function () {
              this.record.lang = "en" == this.record.lang ? "fr" : "en";
              this.updateOutputListLanguage(this.record.lang);

              return CnHttpFactory.instance({
                path: "reqn/identifier=" + this.record.identifier,
                data: { language: this.record.lang },
              }).patch();
            },

            addOutput: function () {
              CnOutputModelFactory.root.transitionToAddState();
            },

            getDifferences: function (finalReport2) {
              var finalReport1 = this.record;
              var differences = {
                diff: false,
                part_1: {
                  diff: false,
                  achieved_objectives: false,
                  findings: false,
                  thesis_title: false,
                  thesis_status: false,
                },
                part_3: {
                  diff: false,
                  impact: false,
                  opportunities: false,
                  dissemination: false,
                },
              };

              if (null != finalReport2) {
                for (var part in differences) {
                  if (!differences.hasOwnProperty(part)) continue;
                  if ("diff" == part) continue; // used to track overall diff

                  for (var property in differences[part]) {
                    if (!differences[part].hasOwnProperty(property)) continue;

                    // not an array means we have a property to directly check
                    // note: we need to convert empty strings to null to make sure they compare correctly
                    var value1 = "" === finalReport1[property] ? null : finalReport1[property];
                    var value2 = "" === finalReport2[property] ? null : finalReport2[property];
                    if (value1 != value2) {
                      differences.diff = true;
                      differences[part].diff = true;
                      differences[part][property] = true;
                    }
                  }
                }
              }

              return differences;
            },

            getVersionList: async function () {
              var parent = this.parentModel.getParentIdentifier();
              this.versionList = [];
              var response = await CnHttpFactory.instance({
                path: parent.subject + "/" + parent.identifier + "/final_report",
              }).query();

              this.versionList = response.data;

              var compareVersion = this.parentModel.getQueryParameter("c");
              if (angular.isDefined(compareVersion)) {
                this.compareRecord = this.versionList.findByProperty("version", compareVersion);
              }

              // add a null object to the version list so we can turn off comparisons
              if (1 < this.versionList.length) this.versionList.unshift(null);

              // Calculate all differences for all versions (in reverse order so we can find the last agreement version)
              this.versionList.reverse();
              this.versionList.forEach((version) => {
                if (null != version) version.differences = this.getDifferences(version);
              });

              // if no different list was defined then make it an empty list
              if (null == this.agreementDifferenceList) this.agreementDifferenceList = [];

              // put the order of the version list back to normal
              this.versionList.reverse();
            },

            submit: async function () {
              var record = this.record;
              var response = await CnModalConfirmFactory.instance({
                title: this.translate("misc.pleaseConfirm"),
                noText: this.parentModel.isRole("applicant", "designate") ? this.translate("misc.no") : "No",
                yesText: this.parentModel.isRole("applicant", "designate") ? this.translate("misc.yes") : "Yes",
                message: this.translate("misc.submitWarning"),
              }).show();

              if (response) {
                // make sure that certain properties have been defined, one tab at a time
                var requiredTabList = {
                  part_1: ["achieved_objectives", "findings"],
                  part_3: ["impact", "opportunities", "dissemination"],
                };

                if( "graduate" == this.record.waiver ) {
                  requiredTabList.part_1.push("thesis_title");
                  requiredTabList.part_1.push("thesis_status");
                }

                var error = null;
                var errorTab = null;
                for (var tab in requiredTabList) {
                  var firstProperty = null;
                  // only check thesis properties if the reqn has a trainee, otherwise check everything else
                  requiredTabList[tab]
                    .filter((property) =>
                      "part_1" == tab ? (null == property.match(/thesis/) || this.record.trainee_user_id) : true
                    )
                    .forEach((property) => {
                      // check for the property's value
                      if (null === record[property] || "" === record[property]) {
                        var element = cenozo.getFormElement(property);
                        if (element) {
                          element.$error.required = true;
                          cenozo.updateFormElement(element, true);
                          if (null == errorTab) errorTab = tab;
                          if (null == error) {
                            error = {
                              title: this.translate("misc.missingFieldTitle"),
                              message: this.translate("misc.missingFieldMessage"),
                              error: true,
                            };
                          }
                        }
                      }
                    });
                }

                if (null != error) {
                  // if there was an error then display it now
                  if (this.parentModel.isRole("applicant", "designate")) {
                    error.closeText = this.translate("misc.close");
                  }
                  await CnModalMessageFactory.instance(error).show();
                  await this.setFormTab(errorTab);
                  return;
                }

                // now check to make sure this version is different from the last (the first is always different)
                var response = await CnHttpFactory.instance({
                  path: this.parentModel.getServiceResourcePath(),
                  data: { select: { column: "has_changed" } },
                }).get();

                var proceed = false;
                if (response.data.has_changed) {
                  proceed = true;
                } else {
                  // no changes made so warn the user before proceeding
                  proceed = await CnModalConfirmFactory.instance({
                    title: this.translate("misc.pleaseConfirm"),
                    noText: this.translate("misc.no"),
                    yesText: this.translate("misc.yes"),
                    message: this.translate("misc.noChangesMessage"),
                  }).show();
                }

                // changes have been made, so submit now
                if (proceed) {
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
    cenozo.providers.factory("CnFinalReportModelFactory", [
      "CnBaseFormModelFactory",
      "CnFinalReportListFactory",
      "CnFinalReportViewFactory",
      "CnLocalization",
      function (
        CnBaseFormModelFactory,
        CnFinalReportListFactory,
        CnFinalReportViewFactory,
        CnLocalization
      ) {
        var object = function (type) {
          CnBaseFormModelFactory.construct(
            this,
            "finalReport",
            type,
            CnFinalReportListFactory,
            CnFinalReportViewFactory,
            module
          );

          angular.extend(this, {
            getMetadata: async function() {
              await this.$$getMetadata();

              // create generic yes/no enum
              const misc = CnLocalization.lookupData.finalReport.misc;
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
              var phase = this.viewModel.record.phase ? this.viewModel.record.phase : "";
              var state = this.viewModel.record.state ? this.viewModel.record.state : "";
              var stageType = this.viewModel.record.stage_type ? this.viewModel.record.stage_type : "";

              // only edit when in finalization and not a destruction stage
              if (!this.$$getEditEnabled() || "finalization" != phase || null != stageType.match(/Destruction/)) {
                return false;
              }

              if (this.isRole("applicant", "designate")) {
                return "deferred" == state;
              } else if (this.isRole("administrator")) {
                return true;
              } else if (this.isRole("communication")) {
                return "Communications Review" == stageType;
              } else if (this.isRole("dao")) {
                return "DCC Review" == stageType;
              }

              return false;
            },
          });
        };

        return {
          root: new object("root"),
          lite: new object("lite"),
          instance: function () {
            return new object();
          },
        };
      },
    ]);
  },
});
