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
      state: { column: "manuscript.state", type: "string" },
      stage_type: { column: "stage_type.name", type: "string" },
      phase: { column: "stage_type.phase", type: "string" },
      lang: { column: "language.code", type: "string" },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnManuscriptVersionView", [
      "CnManuscriptVersionModelFactory",
      "cnRecordViewDirective",
      "CnReqnModelFactory",
      "CnLocalization",
      "CnSession",
      function (
        CnManuscriptVersionModelFactory,
        cnRecordViewDirective,
        CnReqnModelFactory,
        CnLocalization,
        CnSession
      ) {
        // used to piggy-back on the basic view controller's functionality
        var cnRecordView = cnRecordViewDirective[0];
        var manuscriptModel = CnReqnModelFactory.instance();

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
              if ("deferred" == $scope.model.viewModel.record.state) {
                status = $scope.model.isRole("applicant", "designate")
                  ? "Action Required"
                  : "Deferred to Applicant";
              } else if ($scope.model.viewModel.record.state) {
                status = $scope.model.viewModel.record.state.ucWords();
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
            isLoading: false,

            tabList: [ "manuscript_attachment" ],

            onView: async function (force) {
              await this.$$onView(force);

              // get a list of all attachments
              this.isLoading = true;
              this.attachmentList = [];
              try {
                const response = await CnHttpFactory.instance({
                  path: "manuscript/" + this.record.id + '/manuscript_attachment',
                  data: { select: { column: ["id", "name", "datetime"] } },
                }).query();

                this.attachmentList = response.data.map( row => {
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
            "manuscriptReport",
            type,
            CnManuscriptVersionListFactory,
            CnManuscriptVersionViewFactory,
            module
          );

          angular.extend(this, {
            getEditEnabled: function () {
              var stageType = this.viewModel.record.stage_type ? this.viewModel.record.stage_type : "";
              var state = this.viewModel.record.state ? this.viewModel.record.state : "";

              if (this.isRole("applicant", "designate")) {
                return "deferred" == state;
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
