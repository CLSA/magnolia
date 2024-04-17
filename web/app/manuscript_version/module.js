cenozoApp.defineModule({
  name: "manuscript_version",
  dependencies: ["manuscript_attachment"],
  models: ["list", "view"],
  create: (module) => {
    var attachmentModule = cenozoApp.module("manuscript_attachment");

    angular.extend(module, {
      identifier: {
        parent: {
          subject: "manuscript",
          column: "manuscript.id",
        },
      },
      name: {
        singular: "version",
        plural: "versions",
        possessive: "version's",
      },
      columnList: {
        version: {
          title: "Version",
          type: "rank",
        },
        date: {
          title: "Date",
          type: "date",
        },
      },
      defaultOrder: {
        column: "manuscript_version.version",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      identifier: {
        column: "reqn.identifier",
        title: "Identifier",
        type: "string",
      },

      title: {
        column: "manuscript.title",
        title: "Title",
        type: "string",
      },

      // the following are for the form and will not appear in the view
      version: { type: "string" },
      current_manuscript_version_id: { column: "manuscript_version.id", type: "string" },
      trainee_user_id: { column: "reqn.trainee_user_id", type: "string" },
      designate_user_id: { column: "reqn.designate_user_id", type: "string" },
      deferred: { column: "manuscript.deferred", type: "boolean" },
      stage_type: { column: "manuscript_stage_type.name", type: "string" },
      phase: { column: "manuscript_stage_type.phase", type: "string" },
      lang: { column: "language.code", type: "string" },
      authors: { type: "string" },
      date: { type: "date" },
      journal: { type: "string" },
      objectives: { type: "text" },
      clsa_title: { type: "boolean" },
      clsa_title_justification: { type: "text" },
      clsa_keyword: { type: "boolean" },
      clsa_keyword_justification: { type: "text" },
      clsa_reference: { type: "boolean" },
      clsa_reference_justification: { type: "text" },
      has_genomics_data: { type: "boolean" },
      has_seroprevalence_data: { type: "boolean" },
      has_covid_data: { type: "boolean" },
      genomics: { type: "boolean" },
      genomics_justification: { type: "text" },
      acknowledgment: { type: "boolean" },
      dataset_version: { type: "boolean" },
      seroprevalence: { type: "boolean" },
      covid: { type: "boolean" },
      disclaimer: { type: "boolean" },
      statement: { type: "boolean" },
      website: { type: "boolean" },
      indigenous: { type: "boolean" },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnManuscriptVersionView", [
      "CnManuscriptVersionModelFactory",
      "cnRecordViewDirective",
      "CnManuscriptModelFactory",
      "CnLocalization",
      "CnSession",
      function (
        CnManuscriptVersionModelFactory,
        cnRecordViewDirective,
        CnManuscriptModelFactory,
        CnLocalization,
        CnSession
      ) {
        // used to piggy-back on the basic view controller's functionality
        var cnRecordView = cnRecordViewDirective[0];
        var manuscriptModel = CnManuscriptModelFactory.instance();

        return {
          templateUrl: module.getFileUrl("view.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          link: function (scope, element, attrs) {
            cnRecordView.link(scope, element, attrs);

            angular.extend(scope, {
              isAddingAttachment: false,
              isDeletingAttachment: [],
              isDAO: function () { return scope.model.isRole("dao"); },
            });

            scope.model.viewModel.afterView(function () {
              // setup the breadcrumbtrail
              CnSession.setBreadcrumbTrail([
                {
                  title: manuscriptModel.module.name.plural.ucWords(),
                  go: async function () {
                    await manuscriptModel.transitionToListState();
                  },
                },
                {
                  title: scope.model.viewModel.record.title,
                  go: async function () {
                    await manuscriptModel.transitionToViewState({
                      getIdentifier: function () {
                        return scope.model.viewModel.record.id;
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

            scope.$watch("model.viewModel.record.objectives", (text) => {
              scope.model.viewModel.charCount.objectives = text ? text.length : 0;
            });

            scope.model.viewModel.onView();
          },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model)) $scope.model = CnManuscriptVersionModelFactory.root;
            cnRecordView.controller[1]($scope);

            // attachment resources
            var attachmentAddModel = $scope.model.viewModel.attachmentModel.addModel;

            angular.extend($scope, {
              t: function (value) {
                return CnLocalization.translate(
                  "manuscriptReport",
                  value,
                  $scope.model.viewModel.record.lang
                );
              },

              getHeading: function () {
                var status = null;
                if ($scope.model.viewModel.record.deferred) {
                  status = $scope.model.isRole("applicant", "designate")
                    ? "Action Required"
                    : "Deferred to Applicant";
                }

                return [
                  $scope.t("heading"), "-", $scope.model.viewModel.record.title,
                  "version", $scope.model.viewModel.record.version,
                  null != status ? "(" + status + ")" : "",
                ].join(" ");
              },

              addAttachment: async function () {
                if ($scope.model.viewModel.attachmentModel.getAddEnabled()) {
                  // get the data property's form element and remove any conflict errors, then see if it's invalid
                  var currentElement = cenozo.getFormElement('data');
                  angular.extend(
                    currentElement.$error,
                    { conflict: false, required: null === currentElement.$viewValue }
                  );
                  cenozo.updateFormElement(currentElement);

                  if (currentElement.$invalid) {
                    // dirty all inputs so we can find the problem
                    cenozo.forEachFormElement("part_1Form", (element) => { element.$dirty = true; });
                  } else {
                    try {
                      $scope.isAddingAttachment = true;

                      // automatically set the filename
                      await attachmentAddModel.onAdd({
                        name: attachmentAddModel.fileList.findByProperty("key", "data").getFilename()
                      });

                      // reset the form
                      document.querySelector("#part_1Form").reset();
                      currentElement.$viewValue = null;

                      await $scope.model.viewModel.getAttachmentList();
                    } finally {
                      $scope.isAddingAttachment = false;
                    }
                  }
                }
              },

              removeAttachment: async function (id) {
                if ($scope.model.viewModel.attachmentModel.getDeleteEnabled()) {
                  if (!$scope.isDeletingAttachment.includes(id)) $scope.isDeletingAttachment.push(id);
                  var index = $scope.isDeletingAttachment.indexOf(id);
                  await $scope.model.viewModel.removeAttachment(id);
                  if (0 <= index) $scope.isDeletingAttachment.splice(index, 1);
                }
              },

            });
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnManuscriptVersionViewFactory", [
      "CnBaseFormViewFactory",
      "CnManuscriptAttachmentModelFactory",
      "CnHttpFactory",
      "CnModalMessageFactory",
      "CnModalConfirmFactory",
      "CnModalDatetimeFactory",
      "CnSession",
      "$state",
      function (
        CnBaseFormViewFactory,
        CnManuscriptAttachmentModelFactory,
        CnHttpFactory,
        CnModalMessageFactory,
        CnModalConfirmFactory,
        CnModalDatetimeFactory,
        CnSession,
        $state
      ) {
        var object = function (parentModel, root) {
          CnBaseFormViewFactory.construct(this, "manuscriptReport", parentModel, root);

          angular.extend(this, {
            compareRecord: null,
            versionList: [],
            attachmentList: [],
            charCount: { objectives: 0 },
            attachmentModel: CnManuscriptAttachmentModelFactory.instance(),

            isLoading: false,

            tabList: [ "instructions", "part_1", "part_2", "part_3", "part_4" ],

            onView: async function (force) {
              // reset tab value
              this.setFormTab(this.parentModel.getQueryParameter("t"), false);

              // reset compare version and differences
              this.compareRecord = null;

              await this.$$onView(force);

              // get a list of all attachments
              await this.getAttachmentList();
            },

            onPatch: async function (data) {
              await this.$$onPatch(data);

              // remove justifications if no longer needed
              if (angular.isDefined(data.clsa_title) && data.clsa_title) {
                this.record.clsa_title_justification = "";
              }
              if (angular.isDefined(data.clsa_keyword) && data.clsa_keyword) {
                this.record.clsa_keyword_justification = "";
              }
              if (angular.isDefined(data.clsa_reference) && data.clsa_reference) {
                this.record.clsa_reference_justification = "";
              }
              if (angular.isDefined(data.genomics) && data.genomics) {
                this.record.genomics_justification = "";
              }
            },

            toggleLanguage: function () {
              this.record.lang = "en" == this.record.lang ? "fr" : "en";
              return CnHttpFactory.instance({
                path: "reqn/identifier=" + this.record.identifier,
                data: { language: this.record.lang },
              }).patch();
            },

            getDifferences: function (manReport2) {
              var manReport2 = this.record;
              var differences = {
                diff: false,
                part_2: {
                  diff: false,
                  authors: false,
                  date: false,
                  journal: false,
                  objectives: false,
                },
                part_3: {
                  diff: false,
                  clsa_title: false,
                  clsa_title_justification: false,
                  clsa_keyword: false,
                  clsa_keyword_justification: false,
                  clsa_reference: false,
                  clsa_reference_justification: false,
                  genomics: false,
                  genomics_justification: false,
                },
                part_4: {
                  diff: false,
                  acknowledgment: false,
                  dataset_version: false,
                  seroprevalence: false,
                  covid: false,
                  disclaimer: false,
                  statement: false,
                  website: false,
                  indigenous: false,
                },
              };

              if (null != manReport2) {
                for (var part in differences) {
                  if (!differences.hasOwnProperty(part)) continue;
                  if ("diff" == part) continue; // used to track overall diff

                  for (var property in differences[part]) {
                    if (!differences[part].hasOwnProperty(property)) continue;

                    // not an array means we have a property to directly check
                    // note: we need to convert empty strings to null to make sure they compare correctly
                    var value1 = "" === manReport1[property] ? null : manReport1[property];
                    var value2 = "" === manReport2[property] ? null : manReport2[property];
                    if (value1 != value2) {
                      differences.diff = true;
                      differences[part].diff = true;
                      differences[part][property] = true;
                    }
                  }
                }
              }
            },

            submit: async function () {
              var record = this.record;
              var response = await CnModalConfirmFactory.instance({
                title: this.translate("misc.pleaseConfirm"),
                noText: this.parentModel.isRole("applicant", "designate") ? this.translate("misc.no") : "No",
                yesText: this.parentModel.isRole("applicant", "designate") ? this.translate("misc.yes") : "Yes",
                message: this.translate("misc.submitWarning"),
              }).show();
              if (!response) return;

              // make sure there is at least one attachment
              if (0 == this.attachmentList.length) {
              }

              var requiredTabList = {
                part_1: ["attachment_list"],
                part_2: ["authors", "journal", "objectives"],
                part_3: [
                  "clsa_title",
                  "clsa_title_justification",
                  "clsa_keyword",
                  "clsa_keyword_justification",
                  "clsa_reference",
                  "clsa_reference_justification",
                  "genomics",
                  "genomics_justification",
                ],
                part_4: [
                  "acknowledgment",
                  "dataset_version",
                  "seroprevalence",
                  "covid",
                  "disclaimer",
                  "statement",
                  "website",
                  "indigenous",
                ]
              };

              var error = null;
              var errorTab = null;

              for (var tab in requiredTabList) {
                requiredTabList[tab].filter((property) => {
                  if ("part_3" == tab) {
                    // only check some fields if the reqn has them selected
                    if ("genomics" == property) return this.record.has_genomics_data;
                    // only check justifications if the parent property is false
                    else if ("clsa_title_justification" == property) return false === this.record.clsa_title;
                    else if ("clsa_keyword_justification" == property) return false === this.record.clsa_keyword;
                    else if ("clsa_reference_justification" == property) return false === this.record.clsa_reference;
                    else if ("genomics_justification" == property)
                      return this.record.has_genomics_data && false === this.record.genomics;
                  } else if ("part_4" == tab) {
                    // only check some fields if the reqn has them selected
                    if ("seroprevalence" == property) return this.record.has_seroprevalence_data;
                    else if ("covid" == property) return this.record.has_covid_data;
                  }

                  // check everthing else
                  return true;
                }).forEach(property => {
                  if ("attachment_list" == property) {
                    if (0 == this.attachmentList.length) {
                      if (null == errorTab) errorTab = tab;
                      if (null == error) {
                        error = {
                          title: this.translate("misc.missingAttachmentTitle"),
                          message: this.translate("misc.missingAttachmentMessage"),
                          error: true,
                        };
                      }
                    }
                  } else if (null === this.record[property] || "" === this.record[property]) {
                    // check for the property's value
                    var element = cenozo.getFormElement(property);
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
                });
              }

              // if there was an error then display it and do not proceed
              if (null != error) {
                if (this.parentModel.isRole("applicant", "designate"))
                  error.closeText = this.translate("misc.close");
                await CnModalMessageFactory.instance(error).show();
                await this.setFormTab(errorTab);
                return;
              }

              // now check that this version is different from the last (the first is always different)
              var response = await CnHttpFactory.instance({
                path: this.parentModel.getServiceResourcePath(),
                data: { select: { column: "has_changed" } },
              }).get();

              // warn the user when no changes have been made
              if (!response.data.has_changed) {
                const response = await CnModalConfirmFactory.instance({
                  title: this.translate("misc.pleaseConfirm"),
                  noText: this.translate("misc.no"),
                  yesText: this.translate("misc.yes"),
                  message: this.translate("misc.noChangesMessage"),
                }).show();

                // don't proceed if they user has changed their mind
                if (!response) return;
              }
              
              var parent = this.parentModel.getParentIdentifier();
              await CnHttpFactory.instance({
                path: parent.subject + "/" + parent.id + "?action=submit",
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
            },

            getAttachmentList: async function () {
              var response = await CnHttpFactory.instance({
                path: ["manuscript", this.record.manuscript_id, 'manuscript_attachment'].join("/"),
                data: {
                  select: { column: ["id", "name", "size"] },
                  modifier: { order: "id", limit: 1000 },
                },
              }).query();

              this.attachmentList = response.data;
            },

            downloadAttachment: async function (id) {
              const response = await CnHttpFactory.instance({
                path: ["manuscript", this.record.manuscript_id, 'manuscript_attachment', id].join("/"),
              }).get();
              saveAs(cenozo.convertBase64ToBlob(response.data.data), response.data.name);
            },

            removeAttachment: async function (id) {
              await CnHttpFactory.instance({
                path: ["manuscript", this.record.manuscript_id, 'manuscript_attachment', id].join("/"),
              }).delete();
              await this.getAttachmentList();
            },

          });

          // handle conflict errors differently in the attachment's add model
          this.attachmentModel.addModel.onAddError = function(response) {
            if (409 == response.status) {
              // report which inputs are included in the conflict
              response.data.forEach((item) => {
                const scope = cenozo.getScopeByQuerySelector("#part_1Form [name=innerForm]");
                if (scope) {
                  const element = scope.innerForm.name;
                  if (element) {
                    element.$error.conflict = true;
                    cenozo.updateFormElement(element, true);
                  }
                }
              });
            } else {
              CnModalMessageFactory.httpError(response);
            }
          };

          // setup the manuscript-attachment's service collection path based on this version's parent
          const self = this;
          this.attachmentModel.getServiceCollectionPath = function (ignoreParent) {
            return ['manuscript', self.record.manuscript_id, 'manuscript_attachment'].join("/");
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
    cenozo.providers.factory("CnManuscriptVersionModelFactory", [
      "CnBaseFormModelFactory",
      "CnManuscriptVersionListFactory",
      "CnManuscriptVersionViewFactory",
      "CnLocalization",
      function (
        CnBaseFormModelFactory,
        CnManuscriptVersionListFactory,
        CnManuscriptVersionViewFactory,
        CnLocalization
      ) {
        var object = function (type) {
          CnBaseFormModelFactory.construct(
            this,
            type,
            CnManuscriptVersionListFactory,
            CnManuscriptVersionViewFactory,
            module
          );

          angular.extend(this, {
            getEditEnabled: function () {
              if (this.isRole("applicant", "designate")) {
                return true === this.viewModel.record.deferred;
              } else if (this.isRole("administrator", "dao")) {
                return true;
              }

              return false;
            },

            getMetadata: async function () {
              const misc = CnLocalization.lookupData.manuscriptReport.misc;
              await this.$$getMetadata();

              if ("root" == this.type) {
                angular.extend( this.metadata, {
                  yesNoEnumList: {
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
                  },
                  yesNAEnumList: {
                    en: [
                      { value: "", name: misc.choose.en },
                      { value: true, name: misc.yes.en },
                      { value: false, name: misc.na.en },
                    ],
                    fr: [
                      { value: "", name: misc.choose.fr },
                      { value: true, name: misc.yes.fr },
                      { value: false, name: misc.na.fr },
                    ],
                  }
                });
              }
            },
          });
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
