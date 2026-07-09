"use strict";

var cenozo = angular.module("cenozo");

cenozo.controller("HeaderCtrl", [
  "$scope",
  "CnBaseHeader",
  async function ($scope, CnBaseHeader) {
    // copy all properties from the base header
    await CnBaseHeader.construct($scope);
  },
]);

/* ############################################################################################## */
cenozo.directive("cnViewInputWithDifferences", function () {
  return {
    templateUrl: cenozoApp.getFileUrl(
      "magnolia",
      "view-input-with-differences.tpl.html"
    ),
    restrict: "E",
    scope: {
      model: "=",
      difference: "=",
      input: "=",
      noHelpIndicator: "=",
      noCols: "=",
    },
    controller: [
      "$scope",
      function ($scope) {
        $scope.directive = "cnViewInputWithDifferences";
      },
    ],
  };
});

/* ############################################################################################## */
cenozo.directive("cnDeferralNote", function () {
  return {
    templateUrl: cenozoApp.getFileUrl("magnolia", "deferral-note.tpl.html"),
    restrict: "E",
    scope: { page: "@" },
    controller: [
      "$scope",
      function ($scope) {
        angular.extend($scope, {
          directive: "cnDeferralNote",
          input: {
            key: "deferral_note_" + $scope.page,
            title: "Note to Applicant",
            type: "text",
          },
        });
      },
    ],
  };
});

/* ############################################################################################## */
cenozo.factory("CnBaseFormViewFactory", [
  "CnBaseViewFactory",
  "CnLocalization",
  "CnReqnHelper",
  "CnManuscriptHelper",
  "CnHttpFactory",
  function (
    CnBaseViewFactory,
    CnLocalization,
    CnReqnHelper,
    CnManuscriptHelper,
    CnHttpFactory
  ){
    return {
      construct: function (object, formType, parentModel, root) {
        // formType: application, finalReport, destructionReport, manuscriptSubmission
        CnBaseViewFactory.construct(object, parentModel, root);

        // extend the base $$onView function (see below)
        object.baseOnView = object.$$onView;

        angular.extend(object, {
          translate: function (value) {
            return CnLocalization.translate(formType, value, this.record.lang);
          },

          show: function (subject) {
            let phase = this.record.phase ? this.record.phase : "";
            let stageType = this.record.stage_type ? this.record.stage_type : "";

            // do not show submit button if the form is no longer active
            if ("submit" == subject) {
              if ("application" == formType) {
                // do not allow the reqn to be submitted when in the finalization phase
                if ("finalization" == phase) return false;
              } else if ("finalReport" == formType) {
                // do not allow the final report to be submitted when in the destruction phase
                if (stageType.match(/Destruction/)) return false;
              }
            } else if ("application" == subject) {
              return "application" != formType;
            } else if ("final_report" == subject) {
              return "finalReport" != formType && ("finalization" == phase || "Complete" == stageType);
            } else if ("destruction_report" == subject) {
              return "destructionReport" != formType && ["Data Destruction", "Complete"].includes(stageType);
            }

            return (
              "manuscriptSubmission" == formType ?
              CnManuscriptHelper.showAction(subject, this.record) :
              CnReqnHelper.showAction(subject, this.record)
            );
          },

          toggleLanguage: function () {
            this.record.lang = "en" == this.record.lang ? "fr" : "en";
            return CnHttpFactory.instance({
              path: "reqn/identifier=" + this.record.identifier,
              data: { language: this.record.lang },
            }).patch();
          },

          formList: [],
          formTab: "",
          tabList: [],
          setFormTab: async function (newTab, transition) {
            if (angular.isUndefined(transition)) transition = true;

            // find the tab section
            var selectedTab = null;
            this.tabList.some((tab) => {
              if (newTab == tab) {
                selectedTab = tab;
                return true;
              }
            });

            // if the tab wasn't found then use the first tab
            if (null == selectedTab) selectedTab = this.tabList[0];

            this.formTab = selectedTab;
            this.parentModel.setQueryParameter("t", selectedTab);
            if (transition) await this.parentModel.reloadState(false, false, "replace");

            // update all textarea sizes
            angular.element("textarea[cn-elastic]").trigger("elastic");
          },

          nextTab: async function (reverse) {
            if (angular.isUndefined(reverse)) reverse = false;
            var currentTabSectionIndex = this.tabList.indexOf(this.formTab);
            if (null != currentTabSectionIndex) {
              var tab = this.tabList[currentTabSectionIndex + (reverse ? -1 : 1)];
              if (angular.isDefined(tab)) await this.setFormTab(tab);
            }
          },

          transitionTo: async function (subject) {
            // "application" is an alias for "reqn_version"
            if ("application" == subject) subject = "reqn_version";

            // reqn uses the identifier
            let identifier = null;
            if ("reqn" == subject) {
              identifier = "identifier=" + this.record.identifier;
            } else if ("manuscript" == subject) {
              // manuscript uses manuscript_id
              identifier = this.record["manuscript_id"];
            } else if (
              "reqn_version" == subject &&
              "manuscript_version" == this.parentModel.module.subject.snake
            ) {
              // transitioning to the reqn_version from a manuscript_version requires using the identifier
              identifier = "identifier=" + this.record.identifier;
            } else {
              // the rest use current_<subject>_id
              identifier = this.record["current_" + subject + "_id"]
            }

            await this.parentModel.transitionToParentViewState(subject, identifier);
          },

          downloadForm: async function () {
            await CnReqnHelper.download(
              formType.camelToSnake(),
              this.record.getIdentifier()
            );
          },

          $$onView: async function (force) {
            await object.baseOnView(force);

            if ("lite" != this.parentModel.type) {
              // setup the form's deferral notes
              let deferralObject = {};

              // remove the current form-type from the form list
              this.formList = [
                { name: "application", title: "application" },
                { name: "final_report", title: "finalReport" },
                { name: "destruction_report", title: "destructionReport" },
              ].filter(form => this.show(form.name));

              // create an object containing all possible deferral notes for this form
              deferralObject = this.tabList.reduce((obj,tab) => {
                obj["deferral_note_"+tab] = null;
                return obj;
              }, {});

              angular.extend(this.record, deferralObject);
              angular.extend(this.backupRecord, deferralObject);

              const httpObj = "manuscriptSubmission" == formType ? {
                path: "manuscript/" + this.record.manuscript_id + "/manuscript_deferral_note",
                data: {
                  modifier: { order: "page" },
                  select: { column: ["page", "note"] }
                }
              } : {
                path: "reqn/identifier=" + this.record.identifier + "/deferral_note",
                data: {
                  modifier: {
                    where: { column: "form", operator: "=", value: formType.camelToSnake() },
                    order: "page",
                  },
                  select: { column: ["page", "note"] }
                }
              };

              const response = await CnHttpFactory.instance(httpObj).query();
              response.data.forEach(item => {
                // add the note to the record (for patching the value)
                this.record["deferral_note_"+item.page] = item.note;
                this.backupRecord["deferral_note_"+item.page] = item.note;
              });
            }
          },

          onPatch: async function (data) {
            var property = Object.keys(data)[0];
            if (!this.parentModel.getEditEnabled()) {
              throw new Error("Calling onPatch() but edit is not enabled.");
            }

            if (null == property.match(/^deferral_note/)) {
              await this.$$onPatch(data);
            } else {
              // make sure to send patches to deferral notes
              var self = this;
              const page = property.replace( /^deferral_note_/, "" );
              const basePathParts =
                "manuscriptSubmission" == formType ?
                ["manuscript", this.record.manuscript_id, "manuscript_deferral_note"] :
                ["reqn", "identifier=" + this.record.identifier, "deferral_note"];

              // re-read the deferral note before making changes to it
              let deferralNote = null;
              try {
                let params = "page=" + page;
                if ("manuscriptSubmission" != formType) params = "form=" + formType.camelToSnake() + ";" + params;
                const response = await CnHttpFactory.instance({
                  path: basePathParts.concat(params).join("/"),
                  onError: function (error) {
                    // ignore 404 errors, it just means there is no deferral note
                    if (404 != error.status) self.onPatchError(error);
                  }
                }).get();
                deferralNote = response.data;
              } catch (error) {
                // handled by onError above
              }

              // error function to use when deleting, posting or patching the deferral record
              const onError = function (error) { self.onPatchError(error); };

              // if setting the note to an empty string then delete it
              if (!data[property]) {
                if (null != deferralNote) {
                  let path = "deferral_note/" + deferralNote.id;
                  if ("manuscriptSubmission" == formType) path = "manuscript_" + path;
                  await CnHttpFactory.instance({ path: path, onError: onError }).delete();
                }
              } else {
                // if the note doesn't exist then we need to create it
                if (null == deferralNote) {
                  const httpData = { page: page, note: data[property] };
                  if ("manuscriptSubmission" != formType) httpData.form = formType.camelToSnake();

                  await CnHttpFactory.instance({
                    path: basePathParts.join("/"),
                    data: httpData,
                    onError: onError,
                  }).post();
                } else { // otherwise we just need to patch the existing record
                  await CnHttpFactory.instance({
                    path:
                      ("manuscriptSubmission" == formType ? "manuscript_" : "") +
                      "deferral_note/" + deferralNote.id,
                    data: { note: data[property] },
                    onError: onError,
                  }).patch();
                }
              }
            }
          },

        });

      },
    };
  },
]);

/* ############################################################################################## */
cenozo.factory("CnBaseFormModelFactory", [
  "CnBaseModelFactory",
  "CnSession",
  "$state",
  function (CnBaseModelFactory, CnSession, $state){
    return {
      construct: function (object, type, listFactory, viewFactory, module) {
        CnBaseModelFactory.construct(object, module);

        object.type = type;
        if ("lite" != object.type) object.listModel = listFactory.instance(object);

        angular.extend(object, {
          viewModel: viewFactory.instance(object, "root" == object.type),

          inputList: {},

          setupBreadcrumbTrail: function () {
            var trail = [];

            if (this.isRole("applicant", "designate")) {
              trail = [
                { title: this.module.name.singular.ucWords() },
                { title: this.viewModel.record.identifier },
              ];
            } else {
              var self = this;
              trail = [
                {
                  title: "Requisitions",
                  go: async function () { await $state.go("reqn.list"); },
                },
                {
                  title: this.viewModel.record.identifier,
                  go: async function () {
                    await $state.go(
                      "reqn.view",
                      { identifier: "identifier=" + self.viewModel.record.identifier }
                    );
                  },
                },
                {
                  title:
                    this.module.name.singular.ucWords() +
                    " " + this.viewModel.record.version_name,
                },
              ];
            }

            CnSession.setBreadcrumbTrail(trail);
          },
        });

        // make the input lists from all groups more accessible
        module.inputGroupList.forEach((group) =>
          Object.assign(object.inputList, group.inputList)
        );
      },
    };
  }
]);

/* ############################################################################################## */
cenozo.service("CnModalNoticeListFactory", [
  "CnModalMessageFactory",
  "$uibModal",
  "$window",
  "$filter",
  function (CnModalMessageFactory, $uibModal, $window, $filter) {
    var object = function (params) {
      angular.extend(this, {
        title: "Title",
        noticeList: [],
      });
      angular.extend(this, params);

      angular.extend(this, {
        printMessage: function () {
          var printWindow = $window.open(
            "",
            "_blank",
            "width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no"
          );
          if (null == printWindow) {
            CnModalMessageFactory.instance({
              title: "Permission Required",
              message:
                "Your web browser is not allowing this site to open pop-up windows. " +
                "In order to download your notices you must allow pop-up windows in your browser’s settings.",
              error: true,
            }).show();
          } else {
            printWindow.document.open();
            var body = '<html><body onload="window.print()">';
            this.noticeList.forEach((notice) => {
              body +=
                "<h3>" +
                $filter("cnDatetime")(notice.datetime, "date") +
                ": " +
                notice.title +
                "</h3>" +
                "<div>" +
                $filter("cnNewlines")(notice.description) +
                "</div>";
            });
            body += "</body></html>";

            printWindow.document.write(body);
            printWindow.document.close();
          }
        },

        show: function () {
          var self = this;
          this.modal = $uibModal.open({
            backdrop: "static",
            keyboard: !this.block,
            modalFade: true,
            templateUrl: cenozoApp.getFileUrl(
              "magnolia",
              "modal-notice-list.tpl.html"
            ),
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.model = self;
                $scope.close = function () {
                  $uibModalInstance.close(false);
                };
              },
            ],
          });

          return this.modal.result;
        },

        close: function () {
          if (angular.isDefined(this.modal)) this.modal.close(false);
        },
      });
    };

    return {
      instance: function (params) {
        return new object(angular.isUndefined(params) ? {} : params);
      },
    };
  },
]);

/* ############################################################################################## */
cenozo.service("CnModalSubmitLegacyFactory", [
  "$uibModal",
  function ($uibModal) {
    var object = function (params) {
      angular.extend(this, params);

      angular.extend(this, {
        show: function () {
          var self = this;
          return $uibModal.open({
            backdrop: "static",
            keyboard: true,
            modalFade: true,
            templateUrl: cenozoApp.getFileUrl(
              "magnolia",
              "modal-submit-legacy.tpl.html"
            ),
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.model = self;
                $scope.stage_type = "Active";
                $scope.ok = function () {
                  $uibModalInstance.close($scope.stage_type);
                };
                $scope.cancel = function () {
                  $uibModalInstance.close(null);
                };
              },
            ],
          }).result;
        },
      });
    };

    return {
      instance: function (params) {
        return new object(angular.isUndefined(params) ? {} : params);
      },
    };
  },
]);

/* ############################################################################################## */
cenozo.service("CnModalUploadAgreementFactory", [
  "CnSession",
  "CnHttpFactory",
  "CnModalDatetimeFactory",
  "$uibModal",
  function (CnSession, CnHttpFactory, CnModalDatetimeFactory, $uibModal) {
    var object = function (params) {
      angular.extend(this, params);

      this.show = function () {
        return $uibModal.open({
          backdrop: "static",
          keyboard: true,
          modalFade: true,
          templateUrl: cenozoApp.getFileUrl(
            "magnolia",
            "modal-upload-agreement.tpl.html"
          ),
          controller: [
            "$scope",
            "$uibModalInstance",
            function ($scope, $uibModalInstance) {
              angular.extend($scope, {
                filename: null,
                startDate: null,
                startDateFormatted: null,
                endDate: null,
                endDateFormatted: null,

                file: {
                  key: "agreement_filename",
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

                    // upload the file
                    try {
                      obj.uploading = true;
                      await CnHttpFactory.instance({
                        path: path + "?file=agreement_filename",
                        data: obj.file,
                        format: "unknown",
                      }).patch();
                    } finally {
                      obj.uploading = false;
                    }
                  },
                },

                selectDatetime: async function (input) {
                  var response = await CnModalDatetimeFactory.instance({
                    title: "startDate" == input ? "Start Date" : "End Date",
                    date: $scope[input],
                    pickerType: "date",
                    emptyAllowed: false,
                    minDate: "endDate" == input ? $scope.startDate : null,
                    maxDate: "startDate" == input ? $scope.endDate : null,
                  }).show();

                  if (false !== response) {
                    $scope[input] = response;
                    $scope[input + "Formatted"] = CnSession.formatValue(
                      response,
                      "date",
                      true
                    );
                  }
                },

                ok: function () {
                  $uibModalInstance.close({
                    file: $scope.file,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate,
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

/* ############################################################################################## */
cenozo.service("CnReqnHelper", [
  "CnLocalization",
  "CnSession",
  "CnHttpFactory",
  "CnModalConfirmFactory",
  "$state",
  function (CnLocalization, CnSession, CnHttpFactory, CnModalConfirmFactory, $state) {
    var object = {
      promise: null,

      translate: function (address, language) {
        // always use the application subject
        return CnLocalization.translate("application", address, language);
      },

      showAction: function (subject, record) {
        let role = CnSession.role.name;
        let phase = record.phase ? record.phase : "";
        let state = record.state ? record.state : "";
        let stageType = record.stage_type ? record.stage_type : "";
        let isChairStage = stageType.includes("DSAC");
        let isECStage = stageType.includes("EC");
        let isCommunicationStage = stageType.includes("Communication");
        let isDAOStage = [
          "Feasibility Review", "Decision Made", "Agreement", "Data Release", "DCC Review", "Pre Data Destruction"
        ].includes(stageType);

        if ("submit" == subject) {
          return (
            ["applicant", "designate", "administrator", "typist"].includes(role) &&
            ("new" == phase || "deferred" == state)
          );
        } else if ("view" == subject) {
          return !["applicant", "designate"].includes(role);
        } else if ("abandon" == subject) {
          return "." == record.amendment
            ? // non-amendment process
              ["administrator", "applicant", "designate"].includes(role) &&
                "deferred" == state &&
                "review" == phase
            : // amendment process
              ["administrator", "applicant", "designate"].includes(role) &&
                "Admin Review" == stageType;
        } else if ("delete" == subject) {
          return "new" == phase;
        } else if ("defer" == subject) {
          return (
            !["abandoned", "inactive", "deferred"].includes(state) && (
              (
                "administrator" == role &&
                ["review", "active", "finalization"].includes(phase) &&
                "Pre Data Destruction" != stageType
              ) || (
                "dao" == role &&
                ( isDAOStage || "Data Destruction" == stageType ) &&
                "Pre Data Destruction" != stageType
              ) || (
                "communication" == role &&
                "Communications Review" == stageType
              )
            )
          );
        } else if ("amend" == subject) {
          return (
            ["administrator", "applicant", "designate", "typist"].includes(
              role
            ) &&
            !["abandoned", "deferred"].includes(state) &&
            "active" == phase &&
            !["Report Required", "Data Destruction"].includes(stageType)
          );
        } else if ("deactivate" == subject) {
          return (
            "administrator" == role &&
            !["abandoned", "inactive"].includes(state) &&
            ["review", "active"].includes(phase)
          );
        } else if ("incomplete" == subject) {
          return (
            "administrator" == role &&
            "." == record.amendment &&
            (
              "review" == phase ||
              ["Agreement", "Data Release"].includes(stageType)
            )
          );
        } else if ("withdraw" == subject) {
          return "administrator" == role && "active" == phase;
        } else if ("reactivate" == subject) {
          return (
            "administrator" == role && ["abandoned", "inactive"].includes(state)
          );
        } else if ("recreate" == subject) {
          return "administrator" == role && "complete" == phase;
        } else if ("reverse" == subject) {
          return (
            // don't allow if inactive or abandoned
            !["inactive","abandoned"].includes(state) &&
            "new" != phase && // don't allow if new (there's no stage to reverse to)
            !("." != record.amendment && "Admin Review" == stageType) && // use abandon for this instead
            "administrator" == role // only admins can reverse stages
          );
        } else if ("proceed" == subject) {
          return (
            "complete" != phase &&
            "Report Required" != stageType && (
              ("administrator" == role && "new" != phase) ||
              ("dao" == role && isDAOStage) ||
              ("chair" == role && isChairStage) ||
              ("ec" == role && isECStage) ||
              ("communication" == role && isCommunicationStage)
            ) && !this.showAction("amendment proceed", record)
          );
        } else if ("reject" == subject) {
          return (
            "DSAC Selection" == stageType &&
            ["administrator", "chair"].includes(role)
          );
        } else if ("compare" == subject) {
          return true;
        } else if ("amendment proceed" == subject) {
          return (
            "." != record.amendment &&
            [
              "Admin Review",
              "Feasibility Review",
              "Decision Made",
              "Agreement",
            ].includes(stageType) &&
            (
              "administrator" == role ||
              ("dao" == role && isDAOStage)
            )
          );
        } else if ("amendment feasibility review" == subject) {
          return "Admin Review" == stageType;
        } else if ("amendment dsac review" == subject) {
          return "Feasibility Review" == stageType;
        } else if ("amendment decision made" == subject) {
          return ["Admin Review", "Feasibility Review"].includes(stageType);
        } else if ("amendment agreement" == subject) {
          return "Decision Made" == stageType;
        } else if ("amendment data release" == subject) {
          return ["Decision Made", "Agreement"].includes(stageType);
        } else if ("amendment active" == subject) {
          return ["Decision Made", "Agreement"].includes(stageType);
        } else return false;
      },

      abandon: async function (reqnIdentifier, amendment, language) {
        var message = "";
        if (amendment) {
          if (["applicant", "designate"].includes(CnSession.role.name)) {
            message = this.translate("misc.abandonAmendmentWarning", language);
          } else {
            message =
              "Are you sure you want to abandon the amendment?" +
              "\n\nThe amendment process will be discontinued and the requisition will be returned back to its previous status.";
          }
        } else {
          if (["applicant", "designate"].includes(CnSession.role.name)) {
            message = this.translate("misc.abandonWarning", language);
          } else {
            message =
              "Are you sure you wish to abandon the requisition?" +
              "\n\nThe applicant will no longer have access to the requisition and the review process will " +
              "be discontinued. It is possible to re-activate the requisition at a later time.";
          }
        }
        var response = await CnModalConfirmFactory.instance({
          title: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.pleaseConfirm", language)
            : "Please Confirm",
          noText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.no", language)
            : "No",
          yesText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.yes", language)
            : "Yes",
          message: message,
        }).show();

        if (response) {
          await CnHttpFactory.instance({
            path: "reqn/" + reqnIdentifier + "?action=abandon",
          }).patch();
          return true;
        }

        return false;
      },

      delete: async function (record) {
        var response = await CnModalConfirmFactory.instance({
          title: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.pleaseConfirm", record.lang)
            : "Please Confirm",
          noText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.no", record.lang)
            : "No",
          yesText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.yes", record.lang)
            : "Yes",
          message: this.translate("misc.deleteWarning", record.lang),
        }).show();

        if (response) {
          await CnHttpFactory.instance({ path: "reqn/identifier=" + record.identifier }).delete();
          await $state.go(["applicant", "designate"].includes(CnSession.role.name) ? "root.home" : "reqn.list");
        }
      },

      download: async function (subject, id) {
        var http = {
          path:
            "final_report" == subject ? "final_report/" + id :
            "destruction_report" == subject ? "destruction_report/" + id :
            "manuscript_submission" == subject ? "manuscript_version/" + id :
            "reqn_version/" + id + "?file=" + subject,
          format:
            ["final_report", "destruction_report", "manuscript_submission"].includes(subject) ? "pdf" :
            "data_option_list" == subject ? "csv" :
            "unknown",
        };
        await CnHttpFactory.instance(http).file();
      },
    };

    return object;
  },
]);

/* ############################################################################################## */
cenozo.service("CnManuscriptHelper", [
  "CnLocalization",
  "CnSession",
  "CnHttpFactory",
  "CnModalConfirmFactory",
  "$state",
  function (CnLocalization, CnSession, CnHttpFactory, CnModalConfirmFactory, $state) {
    var object = {
      promise: null,

      translate: function (address, language) {
        // always use the manuscript subject
        return CnLocalization.translate("manuscriptSubmission", address, language);
      },

      showAction: function (subject, record) {
        let role = CnSession.role.name;
        let phase = record.phase ? record.phase : "";
        let deferred = true === record.deferred;
        let stageType = record.manuscript_stage_type ? record.manuscript_stage_type : "";

        if ("submit" == subject) {
          return (
            ["applicant", "designate", "administrator"].includes(role) &&
            ("new" == phase || deferred)
          );
        } else if ("view" == subject) {
          return !["applicant", "designate"].includes(role);
        } else if ("delete" == subject) {
          return "new" == phase;
        } else if ("defer" == subject) {
          return (
            !deferred && (
              ("administrator" == role && "review" == phase) ||
              ("dao" == role && "DAO Review" == stageType)
            )
          );
        } else if ("reverse" == subject) {
          return "new" != phase && "administrator" == role;
        } else if ("proceed" == subject) {
          return (
            "complete" != phase && (
              ("administrator" == role && "new" != phase) ||
              ("dao" == role && "DAO Review" == stageType)
            )
          );
        } else if ("compare" == subject) {
          return true;
        } else return false;
      },

      delete: async function (record) {
        var response = await CnModalConfirmFactory.instance({
          title: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.pleaseConfirm", record.lang)
            : "Please Confirm",
          noText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.no", record.lang)
            : "No",
          yesText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("misc.yes", record.lang)
            : "Yes",
          message: this.translate("misc.deleteWarning", record.lang),
        }).show();

        if (response) {
          await CnHttpFactory.instance({ path: "manuscript/" + record.manuscript_id }).delete();
          await $state.go(
            ["applicant", "designate"].includes(CnSession.role.name) ? "reqn_version.view" : "reqn.view",
            { identifier: "identifier=" + record.identifier }
          );
        }
      },

      download: async function (id) {
        var http = {
          path: "manuscript_version/" + id,
          format: "pdf"
        };
        await CnHttpFactory.instance(http).file();
      },
    };

    return object;
  },
]);

/* ############################################################################################## */
cenozo.service("CnLocalization", [
  "CnHttpFactory",
  function (CnHttpFactory) {
    var object = {
      translate: function (subject, address, language) {
        // return an empty string if the language isn't valid
        if (!["en", "fr"].includes(language)) return "";

        var addressParts = address.split(".");

        function get(array, index) {
          if (angular.isUndefined(array)) return "ERROR";
          if (angular.isUndefined(index)) index = 0;
          var part = addressParts[index];
          return angular.isUndefined(array[part]) ? "ERROR"
            : angular.isDefined(array[part][language]) ? array[part][language]
            : get(array[part], index + 1);
        }

        return get(this.lookupData[subject]);
      },

      lookupData: {
        application: {
          heading: {
            en: "Data Request Application",
            fr: "Demande d’accès aux données",
          },
          instructions: {
            tab: { en: "Instructions", fr: "Consignes" },
            title: {
              en: "Instructions for completing an application",
              fr: "Consignes pour remplir une demande",
            },
            text1: {
              en: 'Please note that the CLSA <strong>only accepts applications for data that are available at the time of submission</strong>.  To know what data are currently available, please consult the <a href="https://www.clsa-elcv.ca/resource-types/data-availability-table/" target="data_availability">CLSA Data Availability Table</a> which is regularly updated as data become available.  Applications proposing the use of data that are not available at the time of submission will not be considered for review, and you will need to reapply once those data become available.',
              fr: 'Veuillez noter que l’ÉLCV <strong>accepte les demandes uniquement pour les données disponibles au moment de la soumission</strong>. Pour connaître les données disponibles actuellement, consultez le <a href="https://www.clsa-elcv.ca/fr-ca/resource-types/data-availability-table/" target="data_availability">tableau de disponibilité des données de l’ÉLCV</a>, qui est mis à jour régulièrement à mesure que de nouvelles données deviennent disponibles. Les demandes proposant l’utilisation de données qui ne sont pas disponibles au moment de la soumission ne seront pas examinées, et il faudra présenter une nouvelle demande dès que ces données seront disponibles.',
            },
            text2: {
              en: 'Please consult the CLSA website for instructions, policies, and procedures for CLSA data access: <a href="https://www.clsa-elcv.ca/data-access" target="clsa">www.clsa-elcv.ca/data-access</a> and get informed about the Tips for preparing a CLSA Data Access Application. Applicants are also encouraged to review the pertinent sections of the relevant CLSA protocol(s), Data Collection Tools and Physical Assessments in advance of completing the application. Additional information on the variables in the CLSA dataset is on the <a href="https://datapreview.clsa-elcv.ca/" target="dpp">CLSA Data Preview Portal</a>.',
              fr: 'Veuillez consulter les consignes, les politiques et la procédure de demande d’accès aux données sur le site Web de l’ÉLCV : <a href="https://www.clsa-elcv.ca/fr-ca/data-access/" target="clsa">www.clsa-elcv.ca/fr-ca/data-access</a> et informez-vous sur les conseils pour préparer une demande d’accès aux données de l’ÉLCV. Nous encourageons les demandeurs à consulter les sections pertinentes du protocole de l’ÉLCV (en anglais seulement), les outils de collecte de données et les tests physiques avant de remplir une demande d’accès. Des informations supplémentaires sur les variables contenues dans l’ensemble de données de l’ÉLCV sont disponibles sur le <a href="https://datapreview.clsa-elcv.ca/" target="dpp">Portail de données de l’ÉLCV</a>.',
            },
            text3: {
              en: 'Consult us for any questions regarding your application at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez nous transmettre toute question relative aux demandes d’accès aux données de l’ÉLCV en écrivant à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
            },
            text4: {
              en: "The application is composed of 2 parts:<ul><li>Part 1: General Project Information</li><li>Part 2: Data Checklist</li></ul>",
              fr: "La demande est séparée en duex parties :<ul><li>1<sup>re</sup> partie : Renseignements généraux</li><li>2<sup>e</sup> partie : Sélection des données</li></ul>",
            },
            text5: {
              en: 'Additional information or instructions are available anywhere that the <b class="invert">ⓘ</b> symbol appears. Hover your mouse cursor over the text to see the additional details.',
              fr: 'Des informations ou des instructions supplémentaires sont disponibles partout où le symbole <b class="invert">ⓘ</b> apparaît. Passez le curseur sur le texte pour voir les informations supplémentaires.',
            },
            text6: {
              en: "Please ensure that you have completed <strong>all of the sections of the application</strong> form that are relevant to your application. Incomplete applications may result in processing delays or refusal of your application.",
              fr: "Assurez-vous de bien remplir <strong>toutes les sections pertinentes du formulaire de demande d’accès</strong>. Les demandes incomplètes pourront causer un retard dans le traitement de votre demande ou entraîner un refus.",
            },
          },
          amendment: {
            tab: { en: "Amendment", fr: "Modification" },
            title: {
              en: "Amendment Details",
              fr: "Détails de la modification",
            },
            text1: {
              en: "Amendment requests will be reviewed as they are received. Amendments must NOT be operationalized until the amendment has been approved.",
              fr: "Les demandes de modification seront évalués au fur et à mesure qu’ils seront reçus. Vous DEVEZ attendre l’autorisation avant d’effectuer les modifications demandées.",
            },
            text2: {
              en: 'All requests will be reviewed by the CLSA. If the change is deemed to be significant, the request will be forwarded to the Chair of the CLSA Data and Biospecimen Access Committee (DSAC) who may request a new application be submitted for review and approval. Certain changes may require an amendment to your CLSA Access Agreement.  If you require a change to the title of your project please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: "Toutes les demandes seront révisées par l’ÉLCV. Si les changements apportés sont jugés majeurs, la demande sera envoyée au président du Comité chargé de l’accès aux données et aux échantillons biologiques qui pourrait exiger qu’une nouvelle demande d’accès soit soumise et approuvée. Certains changements peuvent nécessiter une modification de votre Entente d’accès de l’ÉLCV.  Si vous souhaitez modifier le titre de votre projet, veuillez contacter access@clsa-elcv.ca.",
            },
            text3: {
              en: "Please indicate the purpose of your amendment request. (Check ALL that apply):",
              fr: "Veuillez indiquer le motif de votre demande de modification (cochez toutes les cases qui s’appliquent) :",
            },
            atLeastOne: {
              en: "You must select at least one reason for your amendment request.",
              fr: "Vous devez sélectionner au moins un motif pour votre demande de modification.",
            },
            newUser: {
              en: "Please provide the name of the new primary applicant",
              fr: "Veuillez fournir le nom du nouveau demandeur principal",
            },
            newTraineeUser: {
              en: "Please provide the name of the new trainee",
              fr: "Veuillez fournir le nom du nouveau stagiaire",
            },
            newUserNotice: {
              en: "Changing the primary applicant, once approved, will remove your access to this application and transfer ownership to the new applicant.\n\nAre you sure you wish to proceed?",
              fr: "Une fois approuvé, le changement de demandeur principal supprimera votre accès à cette demande et la propriété du compte sera transférée au nouveau demandeur.\n\nÊtes-vous sûr(e) de vouloir continuer?",
            },
            newPrimaryIsTraineeNotice: {
              en: "The applicant you have selected is a trainee.  Please select a new applicant which does not have a supervisor.",
              fr: "Le demandeur que vous avez sélectionné est un stagiaire. Veuillez sélectionner un nouveau demandeur qui n’a pas de superviseur.",
            },
            newTraineeIsPrimaryNotice: {
              en: "The trainee you have selected is not a trainee.  Please select a new trainee which has a supervisor.",
              fr: "Le stagiaire que vous avez sélectionné n’est pas un stagiaire. Veuillez sélectionner un nouveau stagiaire doté d’un superviseur.",
            },
            additionalFee1: {
              en: "An additional cost of ",
              fr: "Un coût supplémentaire de ",
            },
            additionalFee2: {
              en: " will be applied to this amendment.\n\nDo you acknowledge and wish to proceed with this amendment?",
              fr: " sera appliqué à cette modification.\n\nAcceptez-vous et souhaitez-vous procéder à cette modification?",
            },
            justification: {
              en: "Justification (<strong>maximum 5000 characters</strong>)",
              fr: "Justification (<strong>maximum 5000 caractères</strong>)",
            },
          },
          part1: {
            tab: { en: "Part 1", fr: "1<sup>re</sup> partie" },
            title: {
              en: "Part 1 of 2: General Project Information",
              fr: "Partie 1 de 2 : Renseignements généraux",
            },
            applicant: {
              tab: { en: "Applicant", fr: "Demandeur" },
              text1: {
                en: '<strong>Primary Applicant</strong>: The primary applicant will be the contact person for the CLSA Access Agreement as well as for the data release and any relevant updates.  The primary applicant must hold an eligible appointment (continuing or term appointment) at an eligible institution (that is able to uphold the conditions of the data access agreement, administer grant funds, and provide Research Ethics Board approval).  Please indicate whether you are an early career researcher, based on CIHR’s definition (<a href="https://cihr-irsc.gc.ca/e/34190.html#r14" target="early_career">https://cihr-irsc.gc.ca/e/34190.html#r14</a>). We are collecting this information for the CLSA’s reporting purposes.',
                fr: '<strong>Demandeur principal</strong> : Le demandeur principal sera la personne-ressource pour l’Entente d’accès de l’ÉLCV, ainsi que pour la transmission des données et toute mise à jour pertinente.  Le demandeur principal doit occuper un poste admissible (à titre continu ou pour une durée déterminée) dans un établissement admissible qui est en mesure de respecter les conditions de l’Entente d’accès aux données, d’administrer les fonds de la subvention et de fournir l’approbation du comité d’éthique de la recherche. Veuillez préciser si vous êtes chercheuse ou chercheur en début de carrière conformément à la définition des IRSC (<a href="https://cihr-irsc.gc.ca/f/34190.html#c11" target="early_career">https://cihr-irsc.gc.ca/f/34190.html#c11</a>). Nous recueillons cette information en vue de la production des rapports de l’ÉLCV.',
              },
              text2: {
                en: 'If you are an Early Career Researcher, you may be eligible to apply for the Dr. Susan Kirkland Early Career Researcher Data Access Award. If you wish to apply, once you have submitted your data access application, email <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a> and include the project ID (e.g., 2610XXX) and the required application materials attached. Please visit <a href="https://www.clsa-elcv.ca/susan-kirkland-ecr-award/" target="susan_kirkland_ecr_award">https://www.clsa-elcv.ca/susan-kirkland-ecr-award/</a> for more information.',
                fr: 'Si vous êtes chercheuse ou chercheur en début de carrière, vous êtes peut-être admissible au prix Professeure Susan Kirkland d’accès aux données à une chercheuse ou un chercheur en début de carrière. Si vous souhaitez poser votre candidature, écrivez à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a> après avoir déposé votre demande d’accès aux données, précisez le numéro de projet (p. ex., 2610XXX) et incluez les documents de candidature requis. Consultez la page <a href="https://www.clsa-elcv.ca/fr-ca/susan-kirkland-ecr-award/" target="susan_kirkland_ecr_award">https://www.clsa-elcv.ca/fr-ca/susan-kirkland-ecr-award/</a> pour en savoir plus.',
              },
              text3: {
                en: "<strong>Fee Waivers</strong>: Please see below to select the fee waiver.",
                fr: "<strong>Exonération des frais</strong> : Sélectionnez l’exonération des frais ci-dessous.",
              },
              applicant_name: { en: "Name", fr: "Nom" },
              applicant_position: { en: "Position", fr: "Poste" },
              applicant_early_career: { en: "Are you an early career researcher?", fr: "Êtes-vous chercheuse ou chercheur en début de carrière?" },
              applicant_affiliation: {
                en: "Institution (department, research institute or hospital)",
                fr: "Établissement (département, institut de recherche ou hôpital)",
              },
              applicant_country_id: {
                en: "Institution Country",
                fr: "Pays de l’établissement",
              },
              applicant_address: {
                en: "Mailing Address",
                fr: "Adresse de correspondance",
              },
              applicant_phone: { en: "Phone", fr: "Téléphone" },
              applicant_email: { en: "E-mail", fr: "Courriel" },
              text4: {
                en: "Complete this section if this is a Trainee application (Master’s, PhD and Postdoctoral Fellow).",
                fr: "Remplissez cette section si la demande est pour un étudiant (Maîtrise, Ph. D.) ou un chercheur postdoctoral.",
              },
              trainee_name: { en: "Name", fr: "Nom" },
              trainee_program: {
                en: "Degree and Program of Study",
                fr: "Grade et programme d’étude",
              },
              trainee_level: {
                en: "Level of trainee program",
                fr: "Niveau du programme de stage",
              },
              trainee_institution: {
                en: "Institution of Enrollment",
                fr: "Établissement d’étude",
              },
              trainee_country_id: {
                en: "Institution Country",
                fr: "Pays de l’établissement",
              },
              trainee_address: {
                en: "Current Mailing Address",
                fr: "Adresse de correspondance actuelle",
              },
              trainee_phone: { en: "Phone", fr: "Téléphone" },
              trainee_email: { en: "E-mail", fr: "Courriel" },
              text5: {
                en: "Confirm whether the CLSA dataset requested will be for the sole use of the trainee project, i.e., the graduate student’s thesis research or the postdoctoral or clinical fellow’s research project.",
                fr: "Veuillez confirmer si l’ensemble de données de l’ÉLCV réclamé est destiné à l’usage exclusif de la thèse, du mémoire ou du projet de recherche postdoctoral ou clinique du stagiaire.",
              },
              trainee_project: {
                en: "Trainee Project Only",
                fr: "Projet réservé aux stagiaires",
              },
              text6: {
                en: 'Graduate students (Masters or PhD) who wish to obtain the CLSA data for the sole purpose of their thesis, and postdoctoral or clinical fellows (limit 1 waiver per fellowship) who wish to obtain the CLSA data for the sole purpose of their postdoctoral or clinical fellowship project, who are enrolled at Canadian institutions for their graduate degree, postdoc, or clinical fellowship, can apply for a fee waiver. Canadian trainees working outside Canada but funded through a Canadian source are also eligible for a fee waiver (if applicable, please e-mail <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>). Research conducted as part of a CIHR Catalyst Grant is not eligible for a CLSA Data Access Trainee Fee Waiver.',
                fr: 'Les étudiantes et étudiants aux deuxième et troisième cycles (maîtrise ou doctorat) inscrits dans un établissement canadien qui destinent les données de l’ÉLCV à l’usage exclusif de leur thèse, de leur mémoire ou de leur projet de recherche postdoctoral ou clinique peuvent demander une exonération des droits (limite d’une par stage de perfectionnement). Les stagiaires canadiens qui travaillent hors du Canada, mais qui sont financés par une source canadienne, sont également admissibles à une exonération des droits (ils doivent alors écrire à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>). Les recherches réalisées dans le cadre d’une subvention Catalyseur des IRSC ne sont pas admissibles à l’exonération des droits d’accès aux données de l’ÉLCV.',
              },
              waiver: {
                en: "Fee Waiver",
                fr: "Exemption de frais",
              },
            },
            project_team: {
              tab: { en: "Project Team", fr: "Équipe de projet" },
              text: {
                en: "All Co-Applicants and Other Personnel must be listed below. Please indicate whether the person is a trainee for the CLSA’s reporting purposes. You must inform your collaborators that you have included them on this application. Please note that changes to the project team, including change of Primary Applicant and addition or removal of Co-Applicants and Support Personnel <strong>require an amendment</strong>. To submit an Amendment request, please click on \"Create Amendment\" in the upper-right corner of your screen and follow the instructions.",
                fr: "Tous les codemandeurs et les membres du personnel de soutien doivent être identifiés ci-dessous. Veuillez préciser si la personne est stagiaire afin que l’information puisse être incluse dans les rapports de l’ÉLCV. Vous devez informer vos collaborateurs que vous les avez inclus dans cette demande. Veuillez noter que tout changement à l’équipe de projet y compris un changement de demandeur principal et l’ajout ou le retrait d’un codemandeur ou d’un membre du personnel de soutien <strong>nécessite une modification</strong>. Pour soumettre une demande de modification, veuillez cliquer sur « Créer une modification » dans le coin supérieur droit de votre écran et suivre les instructions.",
              },
              noCoapplicants: {
                en: "No co-applicants have been added.",
                fr: "Aucun codemandeur n’a été ajouté.",
              },
              name: { en: "Name", fr: "Nom" },
              position: { en: "Position", fr: "Poste" },
              affiliation: { en: "Institution", fr: "Établissement" },
              country: { en: "Country", fr: "Pays" },
              email: { en: "E-mail", fr: "Courriel" },
              role: { en: "Role", fr: "Rôle" },
              trainee: { en: "Trainee", fr: "Stagiaire" },
              access: {
                en: "Requires Access to Data",
                fr: "Doit avoir accès aux données",
              },
              addCoapplicant: {
                en: "Add Co-Applicant",
                fr: "Ajouter codemandeurs",
              },
              coapplicantAgreementText: {
                en: "All Co-Applicants and Support Personnel being added to the project, who will require direct access to the CLSA data, must sign the co-applicant agreement form (download button below) and agree to comply with the conditions outlined in Articles 2.1 and 2.3 of the CLSA Access Agreement.",
                fr: "Tous les codemandeurs et le personnel de soutien ajoutés au projet qui auront besoin d’un accès direct aux données de l’ÉLCV doivent signer le formulaire d’entente de codemandeur (lien de téléchargement ci-dessous) et accepter de se conformer aux conditions énoncées aux articles 2.1 et 2.3 de l’Entente d’accès de l’ÉLCV.",
              },
              coapplicantAgreementButton: {
                en: "Download Co-Applicant Agreement Form Template",
                fr: "Télécharger le modèle de formulaire d’entente de codemandeur",
              },
              coapplicantAgreement: {
                en: "Changes to co-applicants agreement",
                fr: "Modifications à apporter à l’entente de codemandeur",
              },
              crossInstitutionWarning: {
                en: "Please note that the primary applicant's institution does not allow sharing data with co-applicants belonging to other institutions.\n\nIf you choose to proceed then you are confirming that the new co-applicant's institution is not excluded by this restriction.  Please note that this does not apply to co-applicants that do not require access to the application's data.\n\nDo you acknowledge and wish to proceed?",
                fr: "Veuillez noter que l'institution du demandeur principal ou de la demandeuse principale n'autorise pas le partage de données avec les co-demandeur·ses travaillant dans d'autres institutions.\n\nSi vous choisissez de continuer, vous confirmez que l'institution du/de la co-demandeur·se à ajouter n'est pas exclue par cette restriction. Veuillez noter que cela ne s'applique pas aux co-demandeur·ses qui n'ont pas besoin d'accéder aux données visées par la demande.\n\nAcceptez-vous et souhaitez-vous procéder?",
              },
            },
            timeline: {
              tab: { en: "Timeline", fr: "Échéancier" },
              text1: {
                en: "What is the anticipated time frame for this proposed project? In planning for your project, please consider in your time frame <strong>at least ",
                fr: "Quel est l’échéancier prévu du projet proposé? Lors de la planification de votre projet, veuillez prévoir <strong>au moins ",
              },
              text2: {
                en: " months from the application submission deadline</strong> to the time you receive your dataset.",
                fr: " mois à compter de la date limite de soumission</strong> de votre candidature pour recevoir votre ensemble de données.",
              },
              text3: {
                en: "Project duration: The length of time you propose to use the CLSA data for analysis. You may choose 2 or 3 years.",
                fr: "Durée du projet : la durée pendant laquelle vous proposez d’utiliser les données de l’ÉLCV à des fins d’analyse. Vous pouvez choisir entre 2 ou 3 ans.",
              },
              text4: {
                en: "Agreement duration: An approved project will have an additional two years beyond the project duration to complete all work, and to disseminate the results in the form of manuscripts or presentations, as noted within the CLSA Access Agreement.",
                fr: "Durée de l’entente : un projet approuvé disposera de deux années supplémentaires au-delà de la durée du projet pour achever tous les travaux et diffuser les résultats sous la forme de manuscrits et de présentations, tel qu’indiqué dans l’entente d’accès aux données de l’ÉLCV.",
              },
              deadline: {
                en: "Application submission deadline",
                fr: "Date limite de soumission",
              },
              start_date: {
                en: "Anticipated start date",
                fr: "Date prévue de début",
              },
              duration: {
                en: "Proposed project duration",
                fr: "Durée proposée du projet",
              },
            },
            description: {
              tab: { en: "Description", fr: "Description" },
              text1: {
                en: "<strong>Failure to provide adequate detail to assess feasibility will result in rejection of the application.</strong> Please adhere to character count limits.",
                fr: "<strong>Si l’information pour évaluer la faisabilité du projet n’est pas assez détaillée, la demande sera rejetée.</strong> Veuillez respecter les limites de caractères.",
              },
              title: { en: "Project Title", fr: "Titre du projet" },
              keywords: { en: "Keywords", fr: "Mots clés" },
              keywords_text: {
                en: "Please provide 3-5 keywords describing your project.",
                fr: "Veuillez fournir 3 à 5 mots clés décrivant votre projet.",
              },
              text2: {
                en: "Please provide a lay language summary of your project (<strong>maximum 1000 characters</strong>) suitable for posting on the CLSA website if your application is approved.",
                fr: "Veuillez fournir un résumé non scientifique de votre projet (<strong>maximum 1000 caractères</strong>) pouvant être publié sur le site Web de l’ÉLCV si votre demande est approuvée.",
              },
              lay_summary: { en: "Lay Summary", fr: "Résumé non scientifique" },
              lay_summary_text: {
                en: "Please provide a lay language summary of your project (<strong>maximum 1000 characters</strong>) suitable for posting on the CLSA website if your application is approved. Please ensure that the lay summary provides a stand-alone, informative description of your project.",
                fr: "Veuillez fournir un résumé non scientifique de votre projet (<strong>maximum 1000 caractères</strong>) pouvant être publié sur le site Web de l’ÉLCV si votre demande est approuvée. Assurez-vous de fournir un résumé détaillé et complet de votre projet.",
              },
              text3: {
                en: "Please provide a description of the proposed project. The proposal should be informative and specific and <strong>no more than 4500 characters per section. Non-compliant applications will be returned.</strong>",
                fr: "Veuillez fournir une description du projet proposé. La proposition doit être informative et précise sans dépasser 4500 caractères par section. Les demandes non conformes seront renvoyées au demandeur.",
              },
              background: {
                en: "Background and Study Relevance",
                fr: "Contexte et pertinence de l’étude",
              },
              objectives: {
                en: "Study Objectives and/or Hypotheses",
                fr: "Objectifs et/ou hypothèses de l’étude",
              },
              methodology: {
                en: "Study Design and Methodology",
                fr: "Modèle d’étude et méthodologie",
              },
              amendment_justification_summary: {
                en: "Amendment Justification Summary",
                fr: "Résumé de la justification de la modification",
              },
              methodology_text: {
                en: "The study design and methodology including an overview of the variables requested for the project. In no more than half a page, describe the inclusion and exclusion criteria for participants to be included in your study (e.g., age, sex, etc.).",
                fr: "Modèle d’étude et méthodologie comprenant un survol de la liste de variables demandés. Sans dépasser une demi-page, décrivez les critères d’inclusion et d’exclusion des participants qui seront inclus dans votre étude (p. ex. âge, sexe, etc.).",
              },
              analysis: { en: "Data Analysis", fr: "Analyse de données" },
              analysis_text: {
                en: "Brief description of the data analysis proposed (this section should include justification for the sample size requested). Requests for small subsets of the study participants must be justified.",
                fr: "Brève description de l’analyse de données proposée (cette section devrait inclure la justification de la taille d’échantillon demandée). Les demandes de petits sous-groupes de participants doivent être justifiées.",
              },
              text4: {
                en: "Please include a list of the most relevant references (maximum ",
                fr: "Veuillez présenter une liste des références les plus pertinentes (maximum ",
              },
              text5: {
                en: ")",
                fr: ")",
              },
              number: { en: "Number", fr: "Numéro" },
              reference: { en: "Reference", fr: "Référence" },
              noReferences: {
                en: "No references have been added.",
                fr: "Aucune référence n’a été ajoutée.",
              },
              addReference: { en: "Add Reference", fr: "Ajouter référence" },
            },
            scientific_review: {
              tab: { en: "Scientific Review", fr: "Évaluation scientifique" },
              text: {
                en: 'Evidence of peer reviewed funding will be considered evidence of scientific review. If you have selected "yes, the project received approval for funding", please upload proof of funding notification. If there are no plans to submit an application for financial support for this project, please provide alternate evidence of peer review (e.g., internal departmental review, thesis protocol defense, etc.), if available.',
                fr: "Les preuves de financement accordé après examen par les pairs seront considérées comme preuves d’examen scientifique. Si vous avez sélectionné « Oui, le financement pour le projet a été approuvé », veuillez télécharger l’attestation de financement. Si vous ne prévoyez pas de soumettre une demande de soutien financier pour ce projet, veuillez fournir une autre preuve d’examen par les pairs (par exemple, examen interne du département, défense du protocole de thèse, etc.), si disponible.",
              },
              peer_review: {
                en: "Has the project been scientifically reviewed?",
                fr: "Le projet a-t-il fait l’objet d’un examen scientifique?",
              },
              peer_review_filename: {
                en: "Digital copy of proof of peer review",
                fr: "Copie numérique de la preuve de l’examen par les pairs",
              },
              funding: {
                en: "Has the project received approval for funding?",
                fr: "Le financement pour le projet a-t-il approuvé?",
              },
              funding_agency: {
                en: "Funding agency",
                fr: "L’Organisme de financement",
              },
              grant_number: {
                en: "Grant Number",
                fr: "Numéro de la subvention",
              },
              letter: {
                en: "Digital copy of funding letter",
                fr: "Copie numérique de la lettre de financement",
              },
            },
            ethics: {
              tab: { en: "Ethics", fr: "Éthique" },
              text: {
                en: "Please note that ethics approval is NOT required at the time of this application, but <strong>no data will be released until proof of ethics approval has been received by the CLSA.</strong>",
                fr: "Notez que l’approbation éthique n’est PAS requise à cette étape de la demande, mais <strong>aucune donnée ne seront transmis avant que l’ÉLCV ait reçu une preuve d’approbation éthique.</strong>",
              },
              approvalListNote: {
                en: "Updated ethics approval documents can be added to your requisition <strong>without the need to create a new amendment</strong>.  Simply click the Add button below to upload the document.",
                fr: "Vous pouvez mettre à jour les documents d’approbation éthique relatifs à votre demande <strong>sans créer un nouvel amendement</strong>. Il suffit de cliquer sur le bouton « Ajouter » ci-dessous pour téléverser le document.",
              },
              ethics: {
                en: "Has this project received ethics approval?",
                fr: "Ce projet a-t-il reçu une approbation éthique?",
              },
              letter: {
                en: "Digital copy of ethics approval letter or proof of exemption",
                fr: "Copie numérique de la lettre d’approbation ou une lettre d’exemption de la part du Comité d’éthique",
              },
              expiration: {
                en: "Expiration date of approval",
                fr: "Date limite d’autorisation",
              },
              response: {
                en: "Expected date of response",
                fr: "Date approximative de la réponse",
              },
            },
          },
          part2: {
            tab: { en: "Part 2", fr: "2<sup>e</sup> partie" },
            title: {
              en: "Part 2 of 2: Data Checklist",
              fr: "Partie 2 de 2 : Sélection des données",
            },
            notes: {
              tab: { en: "Notes", fr: "Remarques" },
              text1: {
                en: "Please mark the sections containing the modules in the CLSA dataset that you are requesting.",
                fr: "Veuillez sélectionner chaque module de l’ensemble de données de l’ÉLCV que vous demandez, et ce, pour chacune des vagues (départ et/ou 1er suivi) de collecte de données qui vous intéresse.",
              },
              text2: {
                en: "<strong>Included in all datasets</strong><ul><li>Sampling weights</li></ul>",
                fr: "<strong>Inclus dans tous les ensembles de données</strong><ul><li>Poids d’échantillonnage</li></ul>",
              },
              text3: {
                en: "<strong>Not included in datasets</strong><ul><li>Identifiable information collected (e.g. name, contact information, date of birth, health insurance number, and full postal code)</li></ul>",
                fr: "<strong>Exclus des ensembles de données</strong><ul><li>Informations d’identification recueillies (p. ex. nom, coordonnées, date de naissance, numéro d’assurance maladie et code postal complet)</li></ul>",
              },
              text4: {
                en: 'For more information on these data, consult the <a href="https://www.clsa-elcv.ca/resource-types/data-availability-table/" target="data_availability">CLSA Data Availability Table</a> on our website.',
                fr: 'Pour en savoir plus sur ces données, consultez le <a href="https://www.clsa-elcv.ca/fr-ca/resource-types/data-availability-table/" target="data_availability">tableau de disponibilité des données de l’ÉLCV</a> sur notre site Web.',
              },
            },
            cohort: {
              tab: {
                en: "Cohort & Longitudinal Analyses",
                fr: "Analyses de cohorte et longitudinales",
              },
              text1: {
                en: 'Please select the cohort (Tracking and/or Comprehensive - YOU MUST SELECT "YES" FOR AT LEAST ONE COHORT) for which you are requesting data:',
                fr: "Veuillez sélectionner la cohorte (surveillance et/ou globale) pour laquelle vous demandez des données (VOUS DEVEZ SÉLECTIONNER AU MOINS UNE COHORTE) :",
              },
              text2: {
                en: "You will be able to make your selection of the wave of data collection within the Data Checklist.",
                fr: "Vous pourrez sélectionner la vague de collecte de données dans le tableau de sélection de données.",
              },
              tracking: {
                en: "Tracking Cohort (Telephone Interview)",
                fr: "Évaluation de surveillance (Entrevue téléphonique)",
              },
              trackingHelp: {
                en: "Participants providing data through telephone interviews only. No physical assessment data, medications data or biomarker data are available for this cohort. For further information on what data are available for the Tracking Cohort, consult the CLSA Data Availability Table on our website.",
                fr: "Cohorte de surveillance (entrevue téléphonique) : Les participants de cette cohorte fournissent des données uniquement via une entrevue téléphonique. Aucune donnée sur les tests physiques, les médicaments ou les biomarqueurs n’est disponible pour cette cohorte. Pour plus d’informations sur les données disponibles pour la cohorte de surveillance, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.",
              },
              comprehensive: {
                en: "Comprehensive Cohort (In-home Interview & DCS visit)",
                fr: "Évaluation globale (Entrevue à domicile et au site)",
              },
              comprehensiveHelp: {
                en: "Participants providing data through an In-home interview and during a visit to a Data Collection Site. Physical assessment, medications and biomarker data are available for this cohort only. For further information on what data are available for the Tracking Cohort, consult the CLSA Data Availability Table on our website.",
                fr: "Cohorte globale (entrevue à domicile et visite à un Site de collecte de données) : Les participants de cette cohorte fournissent des données via une entrevue à domicile et une visite à un Site de collecte de données. Les tests physiques, les médicaments et les données sur les biomarqueurs sont disponibles pour cette cohorte uniquement. Pour plus d’informations sur les données disponibles pour la cohorte globale, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.",
              },
              bothCohortNotice: {
                en: 'Please be sure to fully explain in "Part 1 - Description" section of your application, how you will use the data from both the Tracking and Comprehensive cohorts in your analyses, accounting for the differences in the data available for each cohort. For further information on what data are available for the Tracking and Comprehensive Cohort, consult the CLSA Data Availability Table on our website.',
                fr: "À la « Partie 1 - Description » de votre demande d’accès, assurez-vous de bien expliquer comment les données des cohortes globale et de surveillance seront utilisées dans vos analyses, en tenant compte des différences entre les données disponibles pour chaque cohorte. Pour plus d’informations sur les données disponibles pour la cohorte de surveillance et la cohorte globale, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.",
              },
              longitudinal: {
                en: "Is this project part of longitudinal or integrative analyses involving previously approved project using CLSA data?",
                fr: "Ce projet fait-il partie d’analyses longitudinales ou intégratives en lien avec un projet utilisant les données de l’ELCV déjà approuvé?",
              },
              last_identifier: {
                en: "Please enter the application number of the related CLSA approved project",
                fr: "Veuillez entrer le numéro de demande du projet connexe approuvé par l’ÉLCV.",
              },
            },
            indigenous: {
              tab: {
                en: "Indigenous Identifiers",
                fr: "Identificateurs autochtones",
              },
              text1: {
                en: 'Please note that as per <a href="https://ethics.gc.ca/eng/policy-politique_tcps2-eptc2_2022.html" target="indigenous">>Chapter 9: Research Involving the First Nations, Inuit and Métis Peoples of Canada of the Tri-Council Policy Statement: Ethical Conduct for Research Involving Humans</a>, projects that include Indigenous identifiers will undergo an additional review to ensure that meaningful and respectful engagement with relevant Indigenous Peoples is integrated throughout the project.',
                fr: 'Veuillez noter que, conformément au <a href="https://ethics.gc.ca/eng/policy-politique_tcps2-eptc2_2022.html" target="indigenous">chapitre 9 : Recherche impliquant les Premières Nations, les Inuits ou les Métis du Canada de l’Énoncé de politique des trois Conseils : Éthique de la recherche avec des êtres humains</a>, les projets qui incluent des identificateurs autochtones feront l’objet d’un examen supplémentaire pour s’assurer que la collaboration respectueuse avec les peuples autochtones concernés est intégrée tout au long du projet.',
              },
              indigenous_first_nation: {
                en: "Does your proposed project include the use of First Nations self-identifiers?",
                fr: "Le projet que vous proposez comprend-il l’utilisation de l’auto-identification Premières Nations?",
              },
              indigenous_metis: {
                en: "Does your proposed project include the use of Métis self-identifiers?",
                fr: "Le projet que vous proposez comprend-il l’utilisation de l’auto-identification Métis?",
              },
              indigenous_inuit: {
                en: "Does your proposed project include the use of Inuit self-identifiers?",
                fr: "Le projet que vous proposez comprend-il l’utilisation de l’auto-identification Inuit?",
              },
              indigenous_description: {
                en: "Please include a description on how you intend to use Indigenous identifiers in your analyses and how you are involving Indigenous organizations, people and governing bodies in your project.",
                fr: "Veuillez inclure une description de la façon dont vous avez l’intention d’utiliser les identificateurs autochtones dans vos analyses et de la façon dont les organisations, les personnes et les organes directeurs autochtones collaborent à votre projet.",
              },
              indigenous_filename: {
                en: "Please attach a letter of support or other documents to prove engagement.",
                fr: "Veuillez joindre une lettre de soutien ou d’autres documents pour démontrer l’engagement.",
              },
            },
          },
          manuscripts: {
            tab: { en: "Manuscripts", fr: "Manuscrits" },
            title: {
              en: "Manuscript Submission",
              fr: "Soumission du manuscrit",
            },
            text1: {
              en: "All publications must be in accordance with the CLSA Access Agreement and the Publication and Promotion Policy.  The goal of the CLSA review is to ensure that participants cannot be identified in publications, and that results are presented in a scientifically accurate manner in relation to the CLSA design and data collection methods. The manuscript will also be checked to ensure that the research presented matches the objectives of the approved project. This review is not a substitute for peer review.",
              fr: "Toutes les publications doivent respecter l’Entente d’accès aux données et la Politique de publication et de promotion de l’ÉLCV. La révision de l’ÉLCV vise à s’assurer que les participants ne pourront pas être identifiés dans les publications et que la présentation des résultats respecte l’exactitude scientifique des méthodologies de conception et de collecte de données de l’ÉLCV. Le manuscrit sera également vérifié pour s’assurer que la recherche présentée correspond aux objectifs du projet approuvé. Cette révision ne remplace pas celle d’un comité de lecture.",
            },
            text2: {
              en: "Final drafts of all manuscripts (including submissions for pre-prints), reports, reviews, and other proposed primary publications describing research using CLSA data and/or biospecimens must be submitted to the CLSA, by the Primary Applicant, for review at least 15 working days prior to the anticipated submission.",
              fr: "Le demandeur principal doit soumettre à l’ÉLCV la version finale de tous les manuscrits (y compris les soumissions en vue d’une préimpression), les rapports, les analyses et les autres publications primaires proposées qui décrivent des recherches réalisées à l’aide des données ou des échantillons biologiques de l’ÉLCV, en vue de leur révision au moins 15 jours ouvrables avant la soumission anticipée.",
            },
            text3: {
              en: 'If starting a new submission, enter the title of your manuscript and press "Add Manuscript".  Choose the one that you are submitting from the list of manuscripts below and follow all instructions.',
              fr: 'Si vous commencez une nouvelle soumission, inscrivez le titre de votre manuscrit et appuyez sur « Ajouter un manuscrit ». Choisissez celui que vous soumettez dans la liste de manuscrits ci-dessous et respectez toutes les directives.',
            },
            manuscript: {
              addManuscript: {
                en: "Add Manuscript",
                fr: "Ajouter un manuscrit",
              },
              title: {
                en: "Title",
                fr: "Titre"
              },
              status: {
                en: "Status",
                fr: "État",
              },
            },
          },
          amendments: {
            tab: { en: "Amendments", fr: "Modifications" },
            title: {
              en: "Summary of Amendments",
              fr: "Résumé des modification",
            },
            amendment: { en: "Amendment", fr: "Modification" },
          },
          misc: {
            no: { en: "No", fr: "Non" },
            yes: { en: "Yes", fr: "Oui" },
            close: { en: "Close", fr: "Ferme" },
            none: { en: "none", fr: "aucun" },
            add: { en: "Add", fr: "Ajouter" },
            ok: { en: "OK", fr: "OK" },
            cancel: { en: "Cancel", fr: "Annuler" },
            choose: { en: "(choose)", fr: "(choisir)" },
            exempt: { en: "exempt", fr: "exempt(e)" },
            requested: { en: "requested", fr: "demandé" },
            calculating: { en: "Calculating", fr: "Calcul en cours" },
            prevButton: {
              en: "Return to the previous section",
              fr: "Retourner à la section précédente",
            },
            nextButton: {
              en: "Proceed to the next section",
              fr: "Passez à la section suivante",
            },
            pleaseConfirm: { en: "Please confirm", fr: "Veuillez confirmer" },
            pleaseNote: { en: "Please Note", fr: "Notez bien" },
            totalFee: { en: "Total fees", fr: "Total des frais" },
            remove: { en: "Remove", fr: "Supprimer" },
            chars: { en: "characters", fr: "caractères" },
            comments: { en: "Comments", fr: "Commentaires" },
            coapplicant: { en: "Co-Applicant", fr: "Codemandeur" },
            delete: { en: "Delete", fr: "Effacer" },
            download: { en: "Download", fr: "Télécharger" },
            compare: { en: "Compare", fr: "Comparer" },
            comparingWithVersion: { en: "Comparing with Version", fr: "Compare avec Version" },
            dataChecklist: {
              en: "Data Checklist",
              fr: "Sélection des données",
            },
            applicationAndDataChecklist: {
              en: "Application + Data Checklist",
              fr: "Soumission + sélection des données",
            },
            dataSharing: {
              en: "Data Sharing Agreement",
              fr: "Entente de partage de données",
            },
            notices: { en: "Notices", fr: "Notifications" },
            studyData: { en: "Study Data", fr: "Données d’étude" },
            switchForm: { en: "Switch Form", fr: "Changer de formulaire" },
            application: { en: "Application", fr: "Soumission" },
            finalReport: { en: "Final Report", fr: "Rapport final" },
            destructionReport: { en: "Data Destruction Report", fr: "Rapport de destruction de données" },
            study: {
              clsa: { en: "CLSA", fr: "ÉLCV" },
              covid_19_questionnaire: {
                en: "COVID-19, Questionnaire",
                fr: "COVID-19, questionnaire",
              },
              covid_19_antibody: {
                en: "COVID-19, Antibody",
                fr: "COVID-19, anticorps",
              },
              covid_19_dbs: { en: "COVID-19, DBS", fr: "COVID-19, DBS" },
              covid_19_brain: {
                en: "COVID-19, Brain",
                fr: "COVID-19, cerveau",
              },
            },
            studyPhase: {
              bl: { en: "Baseline", fr: "départ" },
              f1: { en: "Follow-up 1", fr: "1er suivi" },
              f2: { en: "Follow-up 2", fr: "2e suivi" },
              f3: { en: "Follow-up 3", fr: "3e suivi" },
              f4: { en: "Follow-up 4", fr: "4e suivi" },
              f5: { en: "Follow-up 5", fr: "5e suivi" },
              f6: { en: "Follow-up 6", fr: "6e suivi" },
            },
            data_sharing: {
              en: "Completed copy of CANUE Data Use and Sharing via Third Party Agreement",
              fr: "Copie complété de l’Entente de partage et d’utilisation des données via une tierce partie autorisée de CANUE",
            },
            file: { en: "File", fr: "Fichier" },
            expirationDate: { en: "Expiration Date", fr: "Date limite" },
            addEthicsApproval: {
              en: "Add Ethics Approval",
              fr: "Ajouter une lettre d’approbation éthique",
            },
            finalReportRequiredWarning: {
              en: "This application’s final report is required, would you like to view it now?",
              fr: "Il faut fournir un rapport final pour cette demande, souhaitez-vous l’afficher maintenant?",
            },
            destructionReportRequiredWarning: {
              en: "This application’s data destruction report is required, would you like to view it now?",
              fr: "Il faut fournir un rapport de destruction de données pour cette demande, souhaitez-vous l’afficher maintenant?",
            },
            costCombined: {
              en: "A combined fee will be applied for these study-phases when requested at the same time.",
              fr: "Des frais combinés sont exigés pour ces phases d’étude lorsqu’elles sont demandées en même temps.",
            },
            amend: { en: "Create Amendment", fr: "Effectuer une modification" },
            amendWarning: {
              en: "Are you sure you wish to create an amendment?\n\nThe application form will be re-opened and you will be able to make and submit changes.",
              fr: "Êtes-vous sûr de vouloir effectuer une modification? Le formulaire de demande sera rouvert. Vous pourrez alors apporter des modifications et les soumettre.",
            },
            missingReferencesTitle: {
              en: "Missing References",
              fr: "Références manquantes",
            },
            missingReferencesMessage: {
              en: "You must provide references (at the bottom of the \"Description\" section) before submitting your application.",
              fr: "Vous devez fournir des références (au bas de la section « Description ») avant de soumettre votre demande d’accès.",
            },
            confirmNoCoapplicants: {
              en: "Are you sure that you wish to submit the application without including any co-applicants?\n\nIf you wish to add co-applicants to the project team, then please click \"No\" so that you may provide them before submitting your application.  Otherwise, clicking \"Yes\" will submit your application without any co-applicants.",
              fr: "Souhaitez-vous soumettre la demande sans aucun co-demandeur ou co-demandeuse? Si vous souhaitez ajouter des co-demandeurs ou co-demandeuses à l’équipe de projet, veuillez cliquer sur « Non » afin de pouvoir les ajouter avant de soumettre la demande. Sinon, cliquez sur « Oui » pour soumettre la demande sans co-demandeur ou co-demandeuse.",
            },
            missingCoapplicantCountryMessage: {
              en: "You must include the country of all co-applicants.",
              fr: "Vous devez indiquer le pays de tous les codemandeurs.",
            },
            submit: { en: "Submit", fr: "Soumettre" },
            submitTitle: {
              en: "Application Submitted",
              fr: "Demande soumise",
            },
            submitMessage: {
              en: "You have successfully submitted your CLSA Data Request Application and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données de l’ÉLCV a bien été soumise. Elle sera maintenant évaluée. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            traineeSubmitTitle: {
              en: "Application Submitted for Supervisor Approval",
              fr: "Demande envoyée au superviseur pour approbation",
            },
            traineeSubmitMessage: {
              en: "You have successfully submitted your CLSA Data Request Application and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons de l’ÉLCV a été soumise avec succès. Votre superviseur recevra une demande d’approbation par courriel. Elle sera maintenant évaluée. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            designateSubmitTitle: {
              en: "Application Submitted for Primary Applicant Approval",
              fr: "Soumission de la demande pour approbation par le demandeur principal",
            },
            designateSubmitMessage: {
              en: "You have successfully submitted the CLSA Data Request Application on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données de l’ÉLCV a été soumise avec succès au nom du demandeur principal. Celui-ci recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin, puis lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour voir l’état de votre demande. Pour connaître les délais prévus pour la réception de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            resubmitTitle: {
              en: "Application Resubmitted",
              fr: "Demande resoumise",
            },
            resubmitMessage: {
              en: "You have successfully resubmitted your CLSA Data Request Application. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données de l’ÉLCV a bien été resoumise. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            traineeResubmitTitle: {
              en: "Application Resubmitted for Supervisor Approval",
              fr: "Demande envoyée à nouveau au superviseur pour approbation",
            },
            traineeResubmitMessage: {
              en: "You have successfully resubmitted your CLSA Data Request Application and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons de l’ÉLCV a été resoumise avec succès. Votre superviseur recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            designateResubmitTitle: {
              en: "Application Resubmitted for Primary Applicant Approval",
              fr: "Nouvelle soumission de la demande pour approbation par le demandeur principal",
            },
            designateResubmitMessage: {
              en: "You have successfully resubmitted the CLSA Data Request Application on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données de l’ÉLCV a été resoumise avec succès au nom du demandeur principal. Celui-ci recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin, puis lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour voir l’état de votre demande. Pour connaître les délais prévus pour la réception de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            submitWarning: {
              en: "Are you sure that all changes are complete and the application is ready to be submitted?",
              fr: "Êtes-vous sûr(e) d’avoir apporté tous les changements souhaités à la demande d’accès et qu’elle est prête à être soumise?",
            },
            missingFieldTitle: {
              en: "Missing mandatory field",
              fr: "Champ obligatoire manquant",
            },
            missingFieldMessage: {
              en: "There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.",
              fr: "Des champs obligatoires sont manquants. Vous serez redirigé vers l’endroit où se trouvent les champs incomplets. Veuillez soumettre la demande d’accès à nouveau quand tous les champs obligatoires auront été remplis.",
            },
            agreementExpiredTitle: {
              en: "Agreement Expired",
              fr: "Entente expirée",
            },
            agreementExpiredMessage: {
              en: "Your CLSA Access Agreement for this application has expired. The Approved User’s right to publish pursuant to Section 8 of the agreement has ended. If you require an extension to the agreement to complete analysis or to publish your results please request an extension by creating an amendment.",
              fr: "Votre Entente d'accès aux données de l’ÉLCV pour cette demande est expirée. Le droit de publication de l’utilisatrice ou l'utilisateur autorisé conformément à l'article 8 de l'Entente a pris fin. Si vous avez besoin d'une prolongation pour terminer l'analyse ou la publication de vos résultats, veuillez créer une demande de modification.",
            },
            invalidNewPrimaryTitle: {
              en: "Invalid applicant",
              fr: "Demandeur incorrect",
            },
            invalidNewPrimaryMessage: {
              en: "It is not possible to change the primary applicant to the user you have selected because their role in the system is not that of an applicant.  Please try selecting a different user.",
              fr: "Il n’est pas possible de remplacer le demandeur principal par l’utilisateur que vous avez sélectionné, car cet utilisateur n’a pas le rôle de demandeur. Veuillez essayer de sélectionner un autre utilisateur.",
            },
            invalidNewTraineeTitle: {
              en: "Invalid trainee",
              fr: "Stagiaire invalide",
            },
            invalidNewTraineeMessage: {
              en: "It is not possible to change the trainee to the user you have selected because their role in the system is not that of an applicant.  Please try selecting a different user.",
              fr: "Il est impossible de changer le stagiaire par l’utilisateur que vous avez sélectionné parce que son rôle dans le système n’est pas celui d’un demandeur. Veuillez tenter de sélectionner un autre utilisateur.",
            },
            invalidStartDateTitle: {
              en: "Invalid start date",
              fr: "Date de début non valide",
            },
            invalidStartDateMessage: {
              en: "The start date you have provided is not acceptable. You will now be redirected to where the start date field can be found. Please try re-submitting once the start date has been corrected.",
              fr: "La date de début indiquée n’est pas acceptable. Vous serez redirigé à l’endroit où se trouve le champ de date de début. Veuillez essayer de soumettre à nouveau une fois la date de début corrigée.",
            },
            noCohortSelectedTitle: {
              en: "No cohort selected",
              fr: "Aucune cohorte sélectionnée",
            },
            noCohortSelectedMessage: {
              en: 'You must select "YES" for at least one cohort.',
              fr: "Vous devez sélectionner au moins une cohorte.",
            },
            noChangesMessage: {
              en: "You have not made any changes to the form since your last submission.  Are you sure you wish to proceed?",
              fr: "Vous n’avez apporté aucune modification au formulaire depuis votre dernière soumission. Êtes-vous sûr(e) de vouloir continuer?",
            },
            deleteWarning: {
              en: "Are you sure you want to delete the application?\n\nThis will permanently destroy all details you have provided. Once this is done there will be no way to restore the application!",
              fr: "Êtes-vous sûr(e) de vouloir supprimer la demande d’accès?\n\nToutes les informations fournies seront détruites et il vous sera impossible de les restaurer!",
            },
            abandon: { en: "Abandon", fr: "Abandonner" },
            abandonWarning: {
              en: "Are you sure you want to abandon the application?\n\nYou will no longer have access to the application and the review process will be discontinued.",
              fr: "Êtes-vous sûr(e) de vouloir abandonner la demande d’accès?\n\nVous n’y aurez plus accès et le processus d’évaluation sera interrompu.",
            },
            abandonAmendmentWarning: {
              en: "Are you sure you want to abandon the amendment?\n\nThe amendment process will be discontinued and your application will be returned back to its previous status.",
              fr: "Êtes-vous sûr de vouloir abandonner la modification? Le processus de modification sera interrompu et votre demande sera renvoyée à son statut précédent.",
            },
            emailText: {
              en: "You must provide an institutional email. Public email accounts such as @gmail.com are not allowed.",
              fr: "Vous devez fournir un courriel institutionnel. Les comptes de messagerie publics tels que @gmail.com ne sont pas autorisés.",
            },
            levelUndergraduate: { en: "Undergraduate", fr: "Premier cycle universitaire" },
            levelMasters: { en: "Master’s", fr: "Maîtrise" },
            levelPhd: { en: "PhD", fr: "Doctorat" },
            levelPostdoc: { en: "Postdoctoral Fellow", fr: "Stage postdoctoral" },
            levelClinical: { en: "Clinical Fellow", fr: "Stage clinique" },
            levelOther: { en: "Other", fr: "Autre" },
            duration2Years: { en: "2 Years", fr: "2 ans" },
            duration3Years: { en: "3 Years", fr: "3 années" },
            duration2p1Years: { en: "2 Years + 1 Additional Year", fr: "2 ans + 1 année supplémentaire" },
            duration2p2Years: { en: "2 Years + 2 Additional Years", fr: "2 ans + 2 années supplémentaires" },
            duration2p3Years: { en: "2 Years + 3 Additional Years", fr: "2 ans + 3 années supplémentaires" },
            duration3p1Years: { en: "3 Years + 1 Additional Year", fr: "3 ans + 1 année supplémentaire" },
            duration3p2Years: { en: "3 Years + 2 Additional Years", fr: "3 ans + 2 années supplémentaires" },
            duration3p3Years: { en: "3 Years + 3 Additional Years", fr: "3 ans + 3 années supplémentaires" },
            clickToSelect: {
              en: "(click to select)",
              fr: "(cliquez pour sélectionner)",
            },
            dataExpired: {
              en: 'The data for this requisition is no longer available. Please send a request to <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a> in order to re-activate the download link.',
              fr: 'Les données de cette demande ne sont plus disponibles. Veuillez envoyer une demande à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a> afin de réactiver le lien de téléchargement.',
            },
          },
        },
        manuscriptSubmission: {
          heading: {
            en: "CLSA Manuscript Submission",
            fr: "Soumission du manuscrit de l’ÉLCV",
          },
          instructions: {
            tab: { en: "Instructions", fr: "Consignes" },
            title: {
              en: "Completing the CLSA Manuscript Submission",
              fr: "Terminer la soumission du manuscrit de l’ÉLCV",
            },
            text1: {
              en: 'Please consult the CLSA website for detailed information on the CLSA, <a href="https://www.clsa-elcv.ca/data-access" target="data_access">https://www.clsa-elcv.ca/data-access</a>. Applicants are encouraged to review the CLSA Publication and Promotion Policy available at <a href="https://www.clsa-elcv.ca/resource-types/publication-policy-for-data-users" target="publication_policy">https://www.clsa-elcv.ca/resource-types/publication-policy-for-data-users</a> to ensure you have the most updated information.  Consult us for any questions regarding your application at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez consulter le site Web de l’ÉLCV pour obtenir de l’information détaillée sur l’ÉLCV, <a href="https://www.clsa-elcv.ca/fr-ca/data-access" target="data_access">https://www.clsa-elcv.ca/fr-ca/data-access</a>. Les demandeurs sont invités à réviser la Politique de publication et de promotion de l’ÉLCV, à l’adresse <a href="https://www.clsa-elcv.ca/fr-ca/resource-types/publication-policy-for-data-users" target="publication_policy">https://www.clsa-elcv.ca/fr-ca/resource-types/publication-policy-for-data-users</a> pour vous assurer de détenir l’information la plus à jour. Consultez-nous si vous avez des questions au sujet de votre demande, à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
            },
            text2: {
              en: "Please be sure to complete all sections:<ol><li>Manuscript attachments</li><li>Manuscript overview</li><li>Requirements as per Publication Policy (Page 1)</li><li>Requirements as per Publication Policy (Page 2)</li></ol>",
              fr: "Veuillez vous assurer de remplir toutes les sections :<ol><li>pièces jointes du manuscrit </li><li>aperçu du manuscrit </li><li>exigences de la Politique de publication (page 1)</li><li>exigences de la Politique de publication (page 2)</li></ol>",
            },
            text3: {
              en: "Please ensure that you have completed all of the sections of the form that are relevant to your manuscript submission.  Incomplete submissions may result in processing delays.",
              fr: "Veuillez vous assurer d’avoir rempli toutes les sections du formulaire relatives à la soumission du manuscrit. Les soumissions incomplètes peuvent être associées à des retards de traitement.",
            },
          },
          part_1: {
            tab: { en: "Part 1", fr: "1<sup>em</sup> partie" },
            title: { en: "Manuscript Attachments", fr: "Pièces jointes du manuscrit" },
            description: {
              en: "Please upload the manuscript along with any other relevant files.",
              fr: "Veuillez télécharger le manuscrit et tous les autres fichiers pertinents.",
            },
            addAttachment: {
              en: "Upload Attachment",
              fr: "Téléverser la pièce jointe.",
            },
            pleaseWait: {
              en: "Please wait...",
              fr: "Veuillez attendre...",
            },
            noAttachments: {
              en: "No attachments have been added.",
              fr: "Aucune pièce jointe n’a été ajoutée.",
            },
            filename: {
              en: "Filename",
              fr: "Nom de fichier",
            },
            size: {
              en: "Size",
              fr: "Taille",
            },
          },
          part_2: {
            tab: { en: "Part 2", fr: "2<sup>e</sup> partie" },
            title: { en: "Manuscript Overview", fr: "Aperçu du manuscrit" },
            authors: { en: "Authors", fr: "Auteurs" },
            authors_check: {
              en: "Confirm requirement has been met",
              fr: "Confirmer que l’exigence a été satisfaite",
            },
            date: { en: "Date", fr: "Date" },
            journal: { en: "Target Journal", fr: "Revue scientifique ciblée" },
            authors_description: {
              en: "The CLSA Publication Policy requires that all authors on a manuscript who have accessed the CLSA data have signed Schedule F and are listed under the Project Team in Magnolia. Please verify that this requirement has been met for this manuscript.",
              fr: "Selon la Politique de publication de l’ÉLCV, tous les auteurs d’un manuscrit qui ont accès aux données de l’ÉLCV ont signé l’annexe F et figurent dans la liste de l’équipe du projet du logiciel Magnolia. Veuillez vous assurer que cette exigence est satisfaite à l’égard de ce manuscrit.",
            },
            objectives_description_1: {
              en: "Results presented in the manuscript must be in accordance with the research objectives of the approved project. Authors are asked to identify and state below which specific objectives in the approved application relate to this manuscript.",
              fr: "Les résultats présentés dans le manuscrit doivent respecter les objectifs de recherche du projet approuvé. Les auteurs sont invités à indiquer et à déclarer ci-dessous quels objectifs particuliers de la demande approuvée correspondent à ce manuscrit.",
            },
            objectives_description_2: {
              en: 'CLSA design features (inclusion/exclusion, sampling strategy, data collection procedures, etc.) if included in the manuscript, must be described accurately. Please refer to the relevant CLSA Protocol, available for download under the <a href="https://www.clsa-elcv.ca/resource-types/protocols/" target="researcher_resources">Researcher Resources</a> section of our website.',
              fr: 'Les caractéristiques de conception de l’ÉLCV (inclusion/exclusion, stratégie de prélèvements, démarches de collecte de données, etc.), si elles sont incluses dans le manuscrit, doivent être décrites avec précision. Veuillez consulter le protocole approprié de l’ÉLCV, qui peut être téléchargé à partir de la section <a href="https://www.clsa-elcv.ca/fr-ca/resource-types/protocols/" target="researcher_resources">de ressources des chercheurs </a> de notre site Web.',
            },
            objectives: {
              en: "Objective(s) related to this manuscript (<strong>maximum 1500 characters</strong>)",
              fr: "Objectifs liés à ce manuscrit (<strong>maximum de 1 500 caractères </strong>)",
            },
          },
          part_3: {
            tab: { en: "Part 3", fr: "3<sup>e</sup> partie" },
            title: {
              en: "Requirements as per the CLSA Publication and Promotion Policy",
              fr: "Exigences de la Politique de publication et de promotion de l’ÉLCV",
            },
            clsa_title_description: {
              en: "The abbreviation ‘CLSA’ must be included in the title of the manuscript, or the name of the platform fully spelled out as ‘Canadian Longitudinal Study on Aging’ may also be used.",
              fr: "L’abréviation « ÉLCV » doit faire partie du titre du manuscrit; le nom de la plateforme écrit au long, « Étude longitudinale canadienne sur le vieillissement », peut également être utilisé.",
            },
            clsa_title: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            clsa_title_justification: {
              en: "Please provide a justification for why this requirement could not be met.",
              fr: "Veuillez justifier pourquoi cette exigence n’a pas pu être satisfaite.",
            },
            clsa_keyword_description: {
              en: "Abbreviation ‘CLSA’ must be included as a keyword in the manuscript.",
              fr: "L’abréviation « ÉLCV » doit être l’un des mots-clés du manuscrit.",
            },
            clsa_keyword: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            clsa_keyword_justification: {
              en: "Please provide a justification for why this requirement could not be met.",
              fr: "Veuillez justifier pourquoi cette exigence n’a pas pu être satisfaite.",
            },
            clsa_reference_description: {
              en: "The following article must be referenced:",
              fr: "L'article suivant doit faire partie des références :",
            },
            clsa_reference_ref: {
              en: " Raina P, Wolfson C., Kirkland S, Griffith L.E., Balion C., Cossette B., Dionne I., Hofer S., Hogan D., van den Heuvel E.R., Liu-Ambrose T., Menec V., Mugford G., Patterson C., Payette H., Richards B., Shannon H., Sheets D., Taler V., Thompson M., Tuokko H., Wister A., Wu C., Young L. (2019) Cohort profile: The Canadian Longitudinal Study on Aging (CLSA). International Journal of Epidemiology, Volume 48, Issue 6, 1752-1753j, https://doi.org/10.1093/ije/dyz173",
              fr: " Raina P, Wolfson C., Kirkland S, Griffith L.E., Balion C., Cossette B., Dionne I., Hofer S., Hogan D., van den Heuvel E.R., Liu-Ambrose T., Menec V., Mugford G., Patterson C., Payette H., Richards B., Shannon H., Sheets D., Taler V., Thompson M., Tuokko H., Wister A., Wu C., Young L. (2019) Cohort profile: The Canadian Longitudinal Study on Aging (CLSA). International Journal of Epidemiology, Volume 48, Issue 6, 1752-1753j, https://doi.org/10.1093/ije/dyz173",
            },
            clsa_reference: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            clsa_reference_number: {
              en: "Please indicate the page or citation number:",
              fr: "Veuillez préciser la page ou le numéro de citation :",
            },
            clsa_reference_justification: {
              en: "Please provide a justification for why this requirement could not be met.",
              fr: "Veuillez justifier pourquoi cette exigence n’a pas pu être satisfaite.",
            },
            genomics_description: {
              en: "The article below must be referenced if the study was conducted using CLSA Genomic data.",
              fr: "L’article suivant doit faire partie des références si l’étude a été réalisée à l’aide des données génomiques de l’ÉLCV.",
            },
            genomics_ref: {
              en: "Forgetta V, Li R, Darmond-Zwaig C, et al. Cohort profile: genomic data for 26 622 individuals from the Canadian Longitudinal Study on Aging (CLSA)BMJ Open 2022;12:e059021. doi: 10.1136/bmjopen-2021-059021 https://bmjopen.bmj.com/content/12/3/e059021",
              fr: "Forgetta V, Li R, Darmond-Zwaig C, et al. Cohort profile: genomic data for 26 622 individuals from the Canadian Longitudinal Study on Aging (CLSA)BMJ Open 2022;12:e059021. doi: 10.1136/bmjopen-2021-059021 https://bmjopen.bmj.com/content/12/3/e059021",
            },
            genomics: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            genomics_number: {
              en: "Please indicate the page or citation number:",
              fr: "Veuillez préciser la page ou le numéro de citation :",
            },
          },
          part_4: {
            tab: { en: "Part 4", fr: "4<sup>e</sup> partie" },
            title: {
              en: "Requirements as per the CLSA Publication and Promotion Policy",
              fr: "Exigences de la Politique de publication et de promotion de l’ÉLCV",
            },
            acknowledgment_description: {
              en: "The approved acknowledgment statement must be included:",
              fr: "La mention approuvée doit être incluse :",
            },
            acknowledgment_example1: {
              en: "This research was made possible using the data/biospecimens collected by the Canadian Longitudinal Study on Aging (CLSA). Funding for the Canadian Longitudinal Study on Aging (CLSA) is provided by the Government of Canada through the Canadian Institutes of Health Research (CIHR) under grant reference: LSA 94473 and the Canada Foundation for Innovation, as well as the following provinces, Newfoundland, Nova Scotia, Quebec, Ontario, Manitoba, Alberta, and British Columbia. This research has been conducted using <b>(DETERMINE LIST OF DATA VERSIONS FROM LIST BELOW)</b> under Application ID ",
              fr: "Cette recherche est rendue possible grâce aux données ou aux échantillons biologiques recueillis par l’Étude longitudinale canadienne sur le vieillissement (ÉLCV). Le financement de l’Étude longitudinale canadienne sur le vieillissement (ÉLCV) est assuré par le gouvernement du Canada par l’entremise des Instituts de recherche en santé du Canada (IRSC), numéro de référence LSA 94473, la Fondation canadienne pour l’innovation et les provinces suivantes : Terre-Neuve, Nouvelle-Écosse, Québec, Ontario, Manitoba, Alberta et Colombie-Britannique. Cette recherche a été réalisée à l’aide de <b>(DÉTERMINER LA LISTE DES VERSIONS DE DONNÉES À PARTIR DE LA LISTE SUIVANTE)</b>, numéro de demande ",
            },
            acknowledgment_example2: {
              en: ". The CLSA is led by Drs. Parminder Raina, Christina Wolfson and Susan Kirkland.  The time and commitment of the participants to the CLSA study platform is gratefully acknowledged, without whom this research would not be possible.",
              fr: ". L’ÉLCV est dirigée par les professeurs Parminder Raina, Christina Wolfson et Susan Kirkland.  Nous remercions chaleureusement les participants et participantes, sans qui cette recherche ne serait pas possible, pour leur temps et leur engagement envers la plateforme de l’ÉLCV.",
            },
            no_data_versions: {
              en: "There are no data versions associated with your application.",
              fr: "Aucune version de données n’est associée à votre demande.",
            },
            data_version_list_1: {
              en: "These are the data versions that you received:",
              fr: "Voici les versions de données que vous avez reçues :",
            },
            data_version_list_2: {
              en: "Please include the data versions that were used in the preparation of this manuscript.",
              fr: "Veuillez inclure les versions de données utilisées pour préparer ce manuscrit.",
            },
            acknowledgment: {
              en: "Please provide the full acknowledgement statement as it appears in the manuscript:",
              fr: "Veuillez fournir la mention complète qui figure dans le manuscrit :",
            },
            dataset_version_description: {
              en: "Please note that in any publications you should always refer to the appropriate dataset version number. If new sample weights were used with an earlier dataset version than Baseline Tracking (TRM) version 3.6 and Baseline Comprehensive (COM) version 4.2, please make sure you mention that you are using the CLSA Sample Weights Version 1.2.",
              fr: "Nous tenons à souligner que, quelle que soit la publication, vous devez toujours vous reporter au numéro de version d’ensemble de données approprié. Si de nouveaux poids d’échantillonnage étaient utilisés dans une version d’ensemble de données antérieure à la version de surveillance initiale (TRM) 3.6 et à la version initiale de la cohorte globale (COM) 4.2, assurez-vous de préciser que vous utilisez la version 1.2 du poids d’échantillonnage de l’ÉLCV.",
            },
            dataset_version: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            trainee_description: {
              en: "The following must be included in your manuscript:",
              fr: "L’information suivante doit être intégrée à votre manuscrit : ",
            },
            trainee_example: {
              en: "was the recipient of a CLSA Data Access Trainee Fee Waiver",
              fr: "a reçu une exonération des droits d’accès aux données de l’ÉLCV.",
            },
            trainee: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            seroprevalence_description: {
              en: "The following must be included in your manuscript:",
              fr: "Ce qui suit doit être inclus dans votre manuscrit :",
            },
            seroprevalence_example: {
              en: "This project was supported by funding from the Government of Canada, through the COVID-19 Immunity Task Force.",
              fr: "Ce projet a été soutenu par un financement du Gouvernement du Canada, par le biais du Secrétariat du groupe de travail sur l'immunité COVID-19.",
            },
            seroprevalence: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            covid_description: {
              en: "The following must be included in your manuscript:",
              fr: "Ce qui suit doit être inclus dans votre manuscrit :",
            },
            covid_example: {
              en: "Funding for support of the CLSA COVID-19 questionnaire-based study is provided by the Juravinski Research Institute, Faculty of Health Sciences, McMaster University, the Provost Fund from McMaster University, the McMaster Institute for Research on Aging, the Public Health Agency of Canada/CIHR grant reference CMO 174125 and the government of Nova Scotia.",
              fr: "Le financement du questionnaire de l’ÉLCV sur la COVID-19 est assuré par l’Institut de recherche Juravinski, la Faculté des sciences de la santé de l’Université McMaster, le Fonds du doyen de l’Université McMaster, l’Institut de recherche sur le vieillissement de l’Université McMaster, la subvention CMO 174125 de l’Agence de la santé publique du Canada et des IRSC et le gouvernement de la Nouvelle-Écosse.",
            },
            covid: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            disclaimer_description: {
              en: "The following must be included in your manuscript:",
              fr: "Ce qui suit doit être inclus dans votre manuscrit :",
            },
            disclaimer_example: {
              en: "The opinions expressed in this manuscript are the author's own and do not necessarily reflect the views of the Canadian Longitudinal Study on Aging.",
              fr: "Les opinions exprimées dans ce manuscrit sont celles des auteurs et ne reflètent pas nécessairement les points de vue de l’Étude longitudinale canadienne sur le vieillissement.",
            },
            disclaimer: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            disclaimer_justification: {
              en: "Please provide a justification for why this requirement could not be met.",
              fr: "Veuillez justifier pourquoi cette exigence n’a pas pu être satisfaite.",
            },
            statement_description: {
              en: "The following must be included in your manuscript:",
              fr: "Ce qui suit doit être inclus dans votre manuscrit :",
            },
            statement_example: {
              en: "Data are available from the Canadian Longitudinal Study on Aging (www.clsa-elcv.ca) for researchers who meet the criteria for access to de-identified CLSA data.",
              fr: "Les données de l’Étude longitudinale canadienne sur le vieillissement (www.clsa-elcv.ca) sont mises à la disposition des chercheurs qui respectent les critères d’accès aux données anonymisées de l’ÉLCV.",
            },
            statement: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            statement_justification: {
              en: "Please provide a justification for why this requirement could not be met.",
              fr: "Veuillez justifier pourquoi cette exigence n’a pas pu être satisfaite.",
            },
            conditions_description: {
              en: 'Please ensure that the Supplementary Conditions of Use, as described in Appendix 2 (page 6) of the <a href="https://www.clsa-elcv.ca/resource-types/publication-policy-for-data-users/" target="conditions">CLSA Publication and Promotion Policy</a>, are respected for certain scales, tests and measures included in the CLSA datasets.',
              fr: 'Veuillez vous assurer que les conditions supplémentaires d’utilisation, décrites à l’annexe 2 (page 6) de la <a href="https://www.clsa-elcv.ca/fr-ca/resource-types/publication-policy-for-data-users/" target="conditions">Politique de publication et de promotion de l’ÉLCV</a>, sont respectées à l’égard de certaines échelles, de certains tests et de certaines mesures inclus dans l’ensemble de données de l’ÉLCV.',
            },
            conditions: {
              en: "Has this requirement been met?",
              fr: "Cette exigence est-elle satisfaite?",
            },
            indigenous_description: {
              en: "Underrepresented Groups",
              fr: "Groupes sous-représentés",
            },
            indigenous: {
              en: "Were Indigenous self-identifiers used in any analysis described in this manuscript?",
              fr: "Les auto-identificateurs de l’identité autochtone ont-ils été utilisés dans une analyse du manuscrit?",
            },
          },
          misc: {
            na: {
              en: "Not applicable to this manuscript",
              fr: "Non applicable à ce manuscrit",
            },
            nr: {
              en: "Not required by the target journal",
              fr: "Non requis par la revue scientifique ciblée",
            },
            pleaseConfirm: { en: "Please confirm", fr: "Veuillez confirmer" },
            none: { en: "none", fr: "aucun" },
            no: { en: "No", fr: "Non" },
            yes: { en: "Yes", fr: "Oui" },
            close: { en: "Close", fr: "Ferme" },
            choose: { en: "(choose)", fr: "(choisir)" },
            chars: { en: "characters", fr: "caractères" },
            remove: { en: "Remove", fr: "Supprimer" },
            delete: { en: "Delete", fr: "Effacer" },
            download: { en: "Download", fr: "Télécharger" },
            compare: { en: "Compare", fr: "Comparer" },
            comparingWithVersion: { en: "Comparing with Version", fr: "Compare avec Version" },
            submit: { en: "Submit", fr: "Soumettre" },
            manuscriptSubmission: {
              en: "Manuscript Submission",
              fr: "Soumission du manuscrit",
            },
            notices: { en: "Notices", fr: "Notifications" },
            viewApplication: { en: "View Application", fr: "Voir la demande" },
            noChangesMessage: {
              en: "You have not made any changes to the report since your last submission.  Are you sure you wish to proceed?",
              fr: "Vous n’avez apporté aucune modification au rapport depuis votre dernière soumission. Êtes-vous sûr de vouloir continuer?",
            },
            deleteWarning: {
              en: "Are you sure you want to delete the manuscript review?\n\nThis will permanently destroy all details you have provided. Once this is done there will be no way to restore the manuscript review!",
              fr: "Êtes-vous certain de vouloir supprimer la révision du manuscrit?\n\nCette mesure détruira toute l’information que vous avez fournie. Une fois cette mesure prise, il ne sera plus possible de rétablir la révision du manuscrit!",
            },
            prevButton: {
              en: "Return to the previous section",
              fr: "Retourner à la section précédente",
            },
            nextButton: {
              en: "Proceed to the next section",
              fr: "Passez à la section suivante",
            },
            submitTitle: {
              en: "Manuscript Submitted",
              fr: "Manuscrit soumis",
            },
            submitMessage: {
              en: "You have successfully submitted your Manuscript Submission and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Vous avez soumis votre manuscrit, qui sera maintenant révisé. Vous recevrez un courriel contenant des directives supplémentaires si nous avons besoin de votre attention ou après avoir terminé le processus. Vous pouvez aller dans le logiciel Magnolia en ligne en tout temps pour visualiser l’état de votre rapport.",
            },
            traineeSubmitTitle: {
              en: "Manuscript Submitted for Supervisor Approval",
              fr: "Manuscrit soumis en vue de son approbation par le superviseur",
            },
            traineeSubmitMessage: {
              en: "You have successfully submitted your Manuscript Submission and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Vous avez bien soumis votre manuscrit, et votre superviseur recevra un courriel lui demandant son approbation. Vous recevrez un courriel contenant des directives supplémentaires si nous avons besoin de votre attention ou après avoir terminé le processus. Vous pouvez aller dans le logiciel Magnolia en ligne en tout temps pour visualiser l’état de votre rapport.",
            },
            designateSubmitTitle: {
              en: "Manuscript Submitted for Primary Applicant Approval",
              fr: "Manuscrit soumis en vue de l’approbation du demandeur principal",
            },
            designateSubmitMessage: {
              en: "You have successfully submitted the Manuscript Submission on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Vous avez soumis votre manuscrit pour le compte du demandeur principal, qui recevra un courriel lui demandant son approbation. Vous recevrez un courriel contenant des directives supplémentaires si nous avons besoin de votre attention ou après avoir terminé le processus. Vous pouvez aller dans le logiciel Magnolia en ligne en tout temps pour visualiser l’état de votre rapport.",
            },
            agreementExpiredTitle: {
              en: "Agreement Expired",
              fr: "Entente expirée",
            },
            agreementExpiredMessage: {
              en: "Your CLSA Access Agreement for this application has expired. The Approved User’s right to publish pursuant to Section 8 of the agreement has ended. If you require an extension to the agreement to complete analysis or to publish your results please request an extension by creating an amendment.",
              fr: "Votre Entente d'accès aux données de l’ÉLCV pour cette demande est expirée. Le droit de publication de l’utilisatrice ou l'utilisateur autorisé conformément à l'article 8 de l'Entente a pris fin. Si vous avez besoin d'une prolongation pour terminer l'analyse ou la publication de vos résultats, veuillez créer une demande de modification.",
            },
            missingAttachmentTitle: {
              en: "Missing Attachment",
              fr: "Pièce jointe manquante",
            },
            missingAttachmentMessage: {
              en: "There are no attachments.  You will now be redirected to where your manuscript can be attached to the report.  Please try re-submitted once all relevant attachments have been uploaded.",
              fr: "Il n’y a pas de pièce jointe. Vous serez dirigé vers la page où vous pourrez joindre le manuscrit au rapport. Veuillez tenter de le soumettre de nouveau lorsque toutes les pièces jointes appropriées auront été téléversées.",
            },
            submitWarning: {
              en: "Are you sure that all changes are complete and the report is ready to be submitted?",
              fr: "Êtes-vous sûr d’avoir apporté toutes les modifications souhaitées et de vouloir soumettre le rapport?",
            },
            missingFieldTitle: {
              en: "Missing mandatory field",
              fr: "Champ obligatoire manquant",
            },
            missingFieldMessage: {
              en: "There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.",
              fr: "Des champs obligatoires sont manquants. Vous serez redirigé vers l’endroit où se trouvent les champs incomplets. Veuillez soumettre la demande d’accès à nouveau quand tous les champs obligatoires auront été remplis.",
            },
          }
        },
        finalReport: {
          heading: {
            en: "CLSA Approved User Research Final Report",
            fr: "Rapport final de la recherche pour les utilisateurs autorisés par l’ÉLCV",
          },
          instructions: {
            tab: { en: "Instructions", fr: "Consignes" },
            title: {
              en: "Completing the CLSA Approved User Final Report",
              fr: "Remplir le rapport final pour les utilisateurs autorisés de l’ÉLCV",
            },
            text1: {
              en: "The information reported in this report allows the CLSA to assess what progress has been made toward accomplishing the objectives set out in the initial application and the impact of the project towards the advancement of knowledge.",
              fr: "Les informations transmises dans ce rapport permettent à l’ÉLCV d’évaluer les progrès effectués qui mènent à l’atteinte des objectifs définis dans la demande initiale, et de mesurer l’impact du projet sur l’avancement des connaissances.",
            },
            text2: {
              en: "The Final Report must be submitted at the end of the project, 1 year after the Effective Date of the CLSA Access Agreement for projects with a 1-year term and 2 years after the Effective Date of the CLSA Access Agreement for projects with a 2-year term. The Final Report must be submitted within 60 days after the end date of the CLSA Access Agreement.",
              fr: "Le rapport final doit être envoyé à la fin du projet, un an après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée d’un ans ou deux ans après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée de deux ans. Le rapport final doit être soumis dans les 60 jours suivant la fin de l’Entente d’accès de l’ÉLCV.",
            },
            text3: {
              en: "Please ensure that you have completed <strong>all of the sections of the Final Report</strong>. Please attach additional pages if necessary, clearly noting which section your are expanding upon.",
              fr: "Assurez-vous de bien remplir <strong>toutes les sections du rapport</strong>. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.",
            },
            text4: {
              en: 'Consult us for any questions regarding the final report at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez adresser toute question relative au rapport final à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
            },
          },
          part_1: {
            tab: { en: "Part 1", fr: "1<sup>re</sup> partie" },
            a: {
              achieved_objectives: {
                en: "Were you able to achieve the objectives stated in the approved application?",
                fr: "Avez-vous été en mesure d’atteindre les objectifs énoncés dans la demande approuvée?",
              },
              findings: {
                en: "Please provide a lay summary of the key findings to be posted on the CLSA website (1500 characters).",
                fr: "Veuillez fournir un résumé non scientifique des principaux résultats qui sera publié sur le site Web de l’ÉLCV (1 500 caractères).",
              },
              noFindings: {
                en: "Please provide an explanation why the objectives were not achieved (1500 characters).",
                fr: "Veuillez expliquer pourquoi les objectifs n’ont pas été atteints (1500 caractères).",
              },
            },
            b: {
              question: {
                en: "Graduate thesis details",
                fr: "Informations sur la these",
              },
              text: {
                en: "Since this is a trainee project that has been granted a fee waiver, you must complete the information below. (Any publications must be reported in the next section)",
                fr: "Comme il s’agit d’un projet de stagiaire auquel une exonération des frais a été accordée, vous devez remplir les informations ci-dessous. (Toute publication doit être rapportée à la section suivante)",
              },
              thesis_title: {
                en: "Thesis title (if graduate student trainee)",
                fr: "Titre de la thèse (s’il s’agit d’un étudiant aux cycles supérieurs)",
              },
              thesis_status: {
                en: "Thesis status (Proposal in preparation, thesis in progress, submitted, approved)",
                fr: "État de la thèse (Proposition en cours de préparation, thèse en cours d’écriture, thèse déposée, thèse approuvée)",
              },
            },
          },
          part_2: {
            tab: { en: "Part 2", fr: "2<sup>e</sup> partie" },
            question: {
              en: "What has the project produced?",
              fr: "Qu’est-ce que votre projet a produit?",
            },
            text: {
              en: "List any products resulting from the project during the reporting period. Please provide references where available, and for peer-reviewed publications please specify if ‘in press’, ‘submitted’ or ‘published’. If you have not yet done so, please provide a copy of peer-reviewed publications to the CLSA when submitting this report.",
              fr: "Énumérer les produits qui ont été développés dans le cadre de votre projet pendant la période en question. Veuillez fournir les références lorsqu’elles sont disponibles. Pour les articles évalués par des pairs, veuillez spécifier s’ils sont « sous presse », « soumis » ou « publiés ». Si ce n’est pas déjà fait, veuillez fournir une copie des articles évalués par des pairs à l’ÉLCV en soumettant ce rapport.",
            },
            addOutput: { en: "Add Output", fr: "Ajouter une réalisation" },
          },
          part_3: {
            tab: { en: "Part 3", fr: "3<sup>e</sup> partie" },
            a: {
              question: {
                en: "What is the impact of the project?",
                fr: "Quel est l’impact du projet?",
              },
              text: {
                en: "Describe distinctive contributions, major accomplishments, innovations, successes, or any change in practice or behavior that has come about as a result of the project (1500 characters).",
                fr: "Décrivez les contributions marquantes, les réalisations, innovations, succès importants ou les changements dans la pratique ou les comportements qui ont émergé des conclusions de votre projet (1500 caractères).",
              },
            },
            b: {
              question: {
                en: "What opportunities for training and professional development has the project provided?",
                fr: "Quelles occasions de formation et de perfectionnement professionnel votre projet a-t-il offert?",
              },
              text: {
                en: "List any opportunities for training (i.e. student research assistants) and professional development (i.e. HQP development opportunities, lectures, courses) that the project has provided (1500 characters).",
                fr: "Énumérez toutes les occasions de formation et de perfectionnement professionnel que votre projet a offertes (1500 caractères).",
              },
            },
            c: {
              question: {
                en: "How have the results been disseminated to communities of interest?",
                fr: "Comment avez-vous diffusé les résultats aux groupes d’intérêt?",
              },
              text: {
                en: "Describe any knowledge translation and outreach activities that have been undertaken (1500 characters).",
                fr: "Décrivez toutes les activités d’application des connaissances et de sensibilisation qui ont été réalisées (1500 caractères).",
              },
            },
          },
          misc: {
            no: { en: "No", fr: "Non" },
            yes: { en: "Yes", fr: "Oui" },
            close: { en: "Close", fr: "Ferme" },
            none: { en: "none", fr: "aucun" },
            choose: { en: "(choose)", fr: "(choisir)" },
            remove: { en: "Remove", fr: "Supprimer" },
            chars: { en: "characters", fr: "caractères" },
            prevButton: {
              en: "Return to the previous section",
              fr: "Retourner à la section précédente",
            },
            nextButton: {
              en: "Proceed to the next section",
              fr: "Passez à la section suivante",
            },
            download: { en: "Download", fr: "Télécharger" },
            switchForm: { en: "Switch Form", fr: "Changer de formulaire" },
            application: { en: "Application", fr: "Soumission" },
            finalReport: { en: "Final Report", fr: "Rapport final" },
            destructionReport: { en: "Data Destruction Report", fr: "Rapport de destruction de données" },
            compare: { en: "Compare", fr: "Comparer" },
            comparingWithVersion: { en: "Comparing with Version", fr: "Compare avec Version" },
            submit: { en: "Submit", fr: "Soumettre" },
            pleaseConfirm: { en: "Please confirm", fr: "Veuillez confirmer" },
            submitTitle: {
              en: "Final Report Submitted",
              fr: "Rapport final soumise",
            },
            submitMessage: {
              en: "You have successfully submitted your Final Report and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été soumis avec succès. Il sera maintenant examiné. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            traineeSubmitTitle: {
              en: "Final Report Submitted for Supervisor Approval",
              fr: "Rapport final soumis au superviseur pour approbation",
            },
            traineeSubmitMessage: {
              en: "You have successfully submitted your Final Report and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été soumis avec succès. Votre superviseur recevra un courriel lui demandant son approbation. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            designateSubmitTitle: {
              en: "Final Report Submitted for Primary Applicant Approval",
              fr: "Soumission du rapport final pour approbation par le demandeur principal",
            },
            designateSubmitMessage: {
              en: "You have successfully submitted the Final Report on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été soumis avec succès au nom du demandeur principal. Celui-ci recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin, puis lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            submitWarning: {
              en: "Are you sure that all changes are complete and the report is ready to be submitted?",
              fr: "Êtes-vous sûr d’avoir apporté toutes les modifications souhaitées et de vouloir soumettre le rapport?",
            },
            missingFieldTitle: {
              en: "Missing mandatory field",
              fr: "Champ obligatoire manquant",
            },
            missingFieldMessage: {
              en: "There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.",
              fr: "Des champs obligatoires sont manquants. Vous allez maintenant être redirigé vers les champs incomplets. Veuillez réessayer lorsque tous les champs obligatoires auront été remplis.",
            },
            noChangesMessage: {
              en: "You have not made any changes to the report since your last submission.  Are you sure you wish to proceed?",
              fr: "Vous n’avez apporté aucune modification au rapport depuis votre dernière soumission. Êtes-vous sûr de vouloir continuer?",
            },
          },
        },
        destructionReport: {
          heading: {
            en: "CLSA Approved User Research Data Destruction Report",
            fr: "Rapport de destruction des données de recherche des utilisateur·trices approuvé·es par l’ÉLCV",
          },
          title: {
            en: "Completing the CLSA Approved User Data Destruction Report",
            fr: "Remplir le rapport de destruction des données de recherche des utilisateur·trices approuvé·es par l’ÉLCV",
          },
          text1: {
            en: "The Approved User must complete the data destruction information and submit to McMaster one year following the termination of the CLSA Access Agreement.  All electronic storage media used in the processing of the Information, including all back-up and transportable media must be sanitized or destroyed on completion of their use.",
            fr: "L’utilisateur ou utilisatrice approuvé·e doit remplir le rapport de destruction des données et le soumettre à l’Université McMaster un an après la résiliation de l’Entente d’accès aux données de l’ÉLCV. L’ensemble des supports de stockage électroniques utilisés pour l’analyse des informations, y compris tous les supports de sauvegarde et de transport, doivent être nettoyés ou détruits à la fin de leur utilisation.",
          },
          text2: {
            en: "Complete this section and submit, please note that once completed this is your attestation that this data has been properly destroyed as per the CLSA Access Agreement.",
            fr: "Remplissez cette section et soumettez-la. Veuillez noter qu’une fois soumise, elle constitue votre attestation que ces données ont été correctement détruites, conformément à l’Entente d’accès aux données de l’ÉLCV.",
          },
          misc: {
            download: { en: "Download", fr: "Télécharger" },
            switchForm: { en: "Switch Form", fr: "Changer de formulaire" },
            application: { en: "Application", fr: "Soumission" },
            finalReport: { en: "Final Report", fr: "Rapport final" },
            destructionReport: { en: "Data Destruction Report", fr: "Rapport de destruction de données" },
            submit: { en: "Submit", fr: "Soumettre" },
            pleaseConfirm: { en: "Please confirm", fr: "Veuillez confirmer" },
            no: { en: "No", fr: "Non" },
            yes: { en: "Yes", fr: "Oui" },
            close: { en: "Close", fr: "Ferme" },
            submitWarning: {
              en: "Are you sure that all changes are complete and the report is ready to be submitted?",
              fr: "Êtes-vous sûr d’avoir apporté toutes les modifications souhaitées et de vouloir soumettre le rapport?",
            },
            submitTitle: {
              en: "Data Destruction Report Submitted",
              fr: "Rapport de destruction de données soumis",
            },
            submitMessage: {
              en: "You have successfully submitted your Destruction Report and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport de destruction a bien été soumis et sera révisé. Vous recevrez un courriel une fois le processus de révision terminé ou, si votre attention est requise, avec des instructions supplémentaires. Vous pouvez consulter l’état du rapport à tout moment en ligne via Magnolia.",
            },
            traineeSubmitTitle: {
              en: "Data Destruction Report Submitted for Supervisor Approval",
              fr: "Rapport de destruction des données soumis pour approbation du/de la superviseur·e",
            },
            traineeSubmitMessage: {
              en: "You have successfully submitted your Destruction Report and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport de destruction a bien été soumis. Votre superviseur·e recevra une demande d’approbation par courriel. Vous recevrez un courriel une fois le processus de révision terminé ou, si votre attention est requise, avec des instructions supplémentaires. Vous pouvez consulter l’état du rapport à tout moment en ligne via Magnolia.",
            },
            designateSubmitTitle: {
              en: "Data Destruction Report Submitted for Primary Applicant Approval",
              fr: "Rapport de destruction des données soumis pour approbation du/de la demandeur·se principal·e",
            },
            designateSubmitMessage: {
              en: "You have successfully submitted the Destruction Report on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport de destruction a bien été soumis au nom du/de la demandeur·se principal·e. Il/Elle recevra une demande d’approbation par courriel. Vous recevrez un courriel une fois le processus de révision terminé ou, si votre attention est requise, avec des instructions supplémentaires. Vous pouvez consulter l’état du rapport à tout moment en ligne via Magnolia.",
            },
          },
        },
        output: {
          add: { en: "Add", fr: "Ajouter" },
          output_type: { en: "Output Type", fr: "Type de réalisation" },
          detail: { en: "Details", fr: "Informations" },
          attachment: { en: "Attachment", fr: "Pièce jointe" },
          url: { en: "URL", fr: "URL" },
          addOutputSource: { en: "Add Source", fr: "Ajouter une source" },
          outputSourceListHeading: {
            en: "Source List",
            fr: "Liste des sources",
          },
          output_source_count: { en: "Sources", fr: "Sources" },
          createOutput: { en: "Create Output", fr: "Créer une réalisation" },
          createOutputSource: {
            en: "Create Output Source",
            fr: "Créer une source pour une réalisation",
          },
          viewFinalReport: {
            en: "View Final Report",
            fr: "Afficher le rapport final",
          },
          viewOutput: { en: "View Output", fr: "Afficher la réalisation" },
          outputDetails: {
            en: "Output Details",
            fr: "Informations sur la réalisation",
          },
          outputSourceDetails: {
            en: "Output Source Details",
            fr: "Informations sur la source de la réalisation",
          },
          save: { en: "Save", fr: "Sauvegarder" },
          cancel: { en: "Cancel", fr: "Annuler" },
          delete: { en: "Delete", fr: "Effacer" },
          choose: { en: "(choose)", fr: "(choisir)" },
          newOutputSourceTitle: { en: "Please Note", fr: "Notez bien" },
          newOutputSourceMessage: {
            en: "You must provide either a file or URL",
            fr: "Vous devez fournir un fichier ou une URL",
          },
        },
      },
    };

    async function init(obj) {
      // fill in dynamic content
      obj.promise = CnHttpFactory.instance({
        path: "data_category",
        data: {
          select: { column: ["name_en", "name_fr"] },
          modifier: { order: "rank", limit: 1000 },
        },
      }).query();

      var response = await obj.promise;
      response.data.forEach((category) => {
        const tabName = category.name_en.toLowerCase().replace(/[- ]/g, "_");
        obj.lookupData.application.part2[tabName] = { tab: { en: category.name_en, fr: category.name_fr } };
      });
    }

    init(object);

    return object;
  },
]);
