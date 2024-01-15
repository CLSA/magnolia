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
          CnBaseFormViewFactory.construct(this, "destructionReport", parentModel, root);

          angular.extend(this, {
            isLoading: false,

            tabList: [ "data_destroy" ],

            onView: async function (force) {
              await this.$$onView(force);

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

            selectDataDestroyDatetime: async function(dataDestroy) {
              if (this.parentModel.getEditEnabled()) {
                const response = await CnModalDatetimeFactory.instance({
                  title: "Select Date & Time of Destruction",
                  date: dataDestroy.datetime ? dataDestroy.datetime : moment(),
                  maxDate: "now",
                  pickerType: "datetime",
                  emptyAllowed: true,
                }).show();

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
