cenozoApp.defineModule({
  name: "manuscript_version",
  dependencies: ["manuscript_attachment"],
  models: ["list", "view"],
  create: (module) => {
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
        datetime: {
          title: "Date & Time",
          type: "datetime",
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
      authors: { type: "text" },
      datetime: { type: "text" },
      journal: { type: "text" },
      clsa_title: { type: "boolean" },
      clsa_title_justification: { type: "text" },
      clsa_keyword: { type: "boolean" },
      clsa_keyword_justification: { type: "text" },
      clsa_reference: { type: "boolean" },
      clsa_reference_justification: { type: "text" },
      genomics: { type: "boolean" },
      genomics_justification: { type: "text" },
      acknowledgment: { type: "text" },
      dataset_version: { type: "boolean" },
      seroprevalence: { type: "boolean" },
      covid: { type: "boolean" },
      disclaimer: { type: "boolean" },
      statement: { type: "boolean" },
      website: { type: "boolean" },
      objectives: { type: "text" },
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
            scope.isDAO = function () { return scope.model.isRole("dao"); };
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
            $scope.t = function (value) {
              return CnLocalization.translate(
                "manuscriptReport",
                value,
                $scope.model.viewModel.record.lang
              );
            };

            $scope.getHeading = function () {
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
            };
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnManuscriptVersionViewFactory", [
      "CnBaseFormViewFactory",
      "CnHttpFactory",
      "CnModalMessageFactory",
      "CnModalConfirmFactory",
      "CnModalDatetimeFactory",
      "CnSession",
      "$state",
      function (
        CnBaseFormViewFactory,
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
            charCount: {
              objectives: 0,
            },

            isLoading: false,

            tabList: [ "instructions", "part_1", "part_2", "part_3", "part_4" ],

            onView: async function (force) {
              // reset tab value
              this.setFormTab(this.parentModel.getQueryParameter("t"), false);

              // reset compare version and differences
              this.compareRecord = null;

              await this.$$onView(force);

              // get a list of all attachments
              this.isLoading = true;
              this.attachmentList = [];
              try {
                const response = await CnHttpFactory.instance({
                  path: "manuscript/" + this.record.manuscript_id + '/manuscript_attachment',
                  data: { select: { column: ["id", "name"] } },
                }).query();

                // track when patching attachments
                this.attachmentList = response.data.map( row => angular.extend(row, { isPatching: false }) );
              } finally {
                this.isLoading = false;
              }
            },

            upateAttachmentListLanguage: function (lang) {
              var columnList = cenozoApp.module("manuscript_attachment").columnList;
              columnList.name.title = CnLocalization.translate("manuscriptReport", "name", lang);
            },

            toggleLanguage: function () {
              this.record.lang = "en" == this.record.lang ? "fr" : "en";
              this.updateAttachmentListLanguage(this.record.lang);

              return CnHttpFactory.instance({
                path: "reqn/identifier=" + this.record.identifier,
                data: { language: this.record.lang },
              }).patch();
            },

            addAttachment: function () {
              // TODO: do we have to redirect?  Why not just a directly uploaod
              CnManuscriptAttachmentModelFactory.root.transitionToAddState();
            },

            getDifferences: function (manReport2) {
              var manReport2 = this.record;
              var differences = {
                diff: false,
                part_2: {
                  diff: false,
                  authors: false,
                  datetime: false,
                  journal: false
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
                  acknowledgment: false,
                  dataset_version: false,
                  seroprevalence: false,
                  covid: false,
                  disclaimer: false,
                  statement: false,
                  website: false,
                  objectives: false,
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
    cenozo.providers.factory("CnManuscriptVersionModelFactory", [
      "CnBaseFormModelFactory",
      "CnManuscriptVersionListFactory",
      "CnManuscriptVersionViewFactory",
      function (
        CnBaseFormModelFactory,
        CnManuscriptVersionListFactory,
        CnManuscriptVersionViewFactory
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
