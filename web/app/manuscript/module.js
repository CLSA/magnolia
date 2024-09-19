cenozoApp.defineModule({
  name: "manuscript",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "reqn",
          column: "reqn.identifier",
        },
      },
      name: {
        singular: "manuscript",
        plural: "manuscripts",
        possessive: "manuscript's",
      },
      columnList: {
        identifier: {
          column: "reqn.identifier",
          title: "Identifier",
        },
        title: {
          column: "manuscript.title",
          title: "Title",
        },
        status: {
          column: "manuscript_stage_type.status",
          title: "Status",
          isIncluded: function ($state, model) {
            return model.isRole("applicant", "designate");
          },
        },
        deferred: {
          title: "Deferred",
          type: "boolean",
          isIncluded: function ($state, model) {
            return !model.isRole("applicant", "designate");
          },
        },
        deferred_days: {
          title: "Days Deferred",
          type: "number",
          isIncluded: function ($state, model) {
            return !model.isRole("applicant", "designate");
          },
          help: "The number of days since the manuscript was deferred (empty if the manuscript isn't deferred)",
        },
        manuscript_stage_type: {
          column: "manuscript_stage_type.name",
          title: "Stage",
          type: "string",
          isIncluded: function ($state, model) {
            return !model.isRole("applicant", "designate");
          },
        },
        phase: {
          column: "manuscript_stage_type.phase",
          type: "hidden",
        },
        manuscript_version_id: {
          column: "manuscript_version.id",
          type: "hidden",
        },
      },
      defaultOrder: {
        column: "manuscript.title",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      manuscript_stage_type: {
        title: "Current Stage",
        column: "manuscript_stage_type.name",
        type: "string",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "dao", "readonly") ? "add" : true;
        },
      },
      deferred: {
        title: "Deferred",
        type: "boolean",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "dao", "readonly") ? "add" : true;
        },
      },
      deferred_date: {
        title: "Deferred On",
        type: "date",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "dao", "readonly") ? "add" : true;
        },
      },
      title: {
        title: "Title",
        type: "string",
      },
      suggested_revisions: {
        title: "Suggested Revisions",
        type: "boolean",
        isExcluded: function ($state, model) {
          // show the suggested revisions checkbox to admins when in the decision made stage
          return (
            !model.isRole("administrator") ||
            angular.isUndefined(model.viewModel.record.manuscript_stage_type) ||
            "Decision Made" != model.viewModel.record.manuscript_stage_type ||
            angular.isUndefined(model.viewModel.record.next_manuscript_stage_type) ||
            "Not Approved" == model.viewModel.record.next_manuscript_stage_type
          );
        },
      },
      note: {
        title: "Administrative Notes",
        type: "text",
        isExcluded: function ($state, model) {
          return !model.isRole("administrator", "dao", "readonly");
        },
      },

      current_manuscript_version_id: {
        column: "manuscript_version.id",
        type: "string",
        isExcluded: true,
      },
      next_manuscript_stage_type: { type: "string", isExcluded: true },
      phase: { column: "manuscript_stage_type.phase", type: "string", isExcluded: true },
      status: { column: "manuscript_stage_type.status", type: "string", isExcluded: true },
      lang: { type: "string", column: "language.code", isExcluded: true },
    });

    module.addExtraOperation("view", {
      title: "View Report",
      operation: async function ($state, model) {
        await $state.go(
          "manuscript_version.view",
          { identifier: model.viewModel.record.current_manuscript_version_id }
        );
      },
    });

    module.addExtraOperationGroup("view", {
      title: "Action",
      operations: [
        {
          title: "Defer to Applicant",
          classes: "btn-warning",
          isIncluded: function ($state, model) { return model.viewModel.show("defer"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("defer"); },
          operation: function ($state, model) { model.viewModel.defer(); },
        },
        {
          title: "Reverse",
          classes: "btn-warning",
          isIncluded: function ($state, model) { return model.viewModel.show("reverse"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("reverse"); },
          operation: function ($state, model) { model.viewModel.reverse(); },
        },
      ],
    });

    module.addExtraOperation("view", {
      title: "Proceed",
      classes: "btn-success",
      isIncluded: function ($state, model) { return model.viewModel.show("proceed"); },
      isDisabled: function ($state, model) { return !model.viewModel.enabled("proceed"); },
      operation: function ($state, model) { model.viewModel.proceed(); },
    });

    module.addExtraOperationGroup("view", {
      title: "Download",
      operations: [
        {
          title: "Manuscript Submission",
          operation: async function ($state, model) {
            await model.viewModel.downloadManuscriptReport();
          },
        },
        {
          title: "Notices",
          operation: async function ($state, model) {
            await model.viewModel.displayNotices();
          },
        },
        {
          title: "Reviews",
          operation: async function ($state, model) {
            await model.viewModel.downloadReviews();
          },
        },
      ],
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnManuscriptAddFactory", [
      "CnBaseAddFactory",
      "CnSession",
      "$state",
      function (CnBaseAddFactory, CnSession, $state) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);

          // immediately view the user record after it has been created
          this.transitionOnSave = function (record) {
            CnSession.workingTransition(async function () {
              await $state.go("manuscript_version.view", { identifier: "manuscript_id=" + record.id });
            });
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
    cenozo.providers.factory("CnManuscriptViewFactory", [
      "CnBaseViewFactory",
      "CnManuscriptHelper",
      "CnHttpFactory",
      "CnModalConfirmFactory",
      "CnModalNoticeListFactory",
      function (
        CnBaseViewFactory,
        CnManuscriptHelper,
        CnHttpFactory,
        CnModalConfirmFactory,
        CnModalNoticeListFactory
      ) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root, "manuscript_stage");

          angular.extend(this, {
            show: function (subject) {
              return CnManuscriptHelper.showAction(subject, this.record);
            },
            downloadManuscriptReport: async function () {
              await CnManuscriptHelper.download(
                this.record.current_manuscript_version_id
              );
            },
            downloadReviews: async function () {
              await CnHttpFactory.instance({
                path:
                  this.parentModel.getServiceResourcePath() + "?file=reviews",
                format: "txt",
              }).file();
            },

            onView: async function (force) {
              // update the column languages in case they were changed while viewing a report
              await this.$$onView(force);

              if (angular.isDefined(this.manuscriptNoticeModel)) {
                this.manuscriptNoticeModel.columnList.viewed_by_trainee_user.isIncluded =
                  null == this.record.trainee_user_id
                    ? function () { return false; }
                    : function () { return true; };
                this.manuscriptNoticeModel.columnList.viewed_by_designate_user.isIncluded =
                  null == this.record.designate_user_id
                    ? function () { return false; }
                    : function () { return true; };
              }
            },

            enabled: function (subject) {
              if (["defer", "reverse"].includes(subject)) {
                return true;
              } else if ("proceed" == subject) {
                return false === this.record.deferred && null != this.record.next_manuscript_stage_type;
              } else return false;
            },

            reloadAll: async function (modelList) {
              await Promise.all(
                modelList.reduce(
                  (promiseList, modelName) => {
                    if (angular.isDefined(this[modelName + "Model"]))
                      promiseList.push(
                        this[modelName + "Model"].listModel.onList(true)
                      );
                    return promiseList;
                  },
                  [this.onView()]
                )
              );
            },

            reverse: async function () {
              var message =
                "Are you sure you wish to reverse to the " +
                this.parentModel.module.name.singular +
                " to the previous stage?";
              var response = await CnModalConfirmFactory.instance({
                message: message,
              }).show();

              if (response) {
                await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceResourcePath() +
                    "?action=reverse",
                }).patch();
                await this.reloadAll(["manuscriptReview", "manuscriptStage", "manuscriptNotification"]);
              }
            },

            proceed: async function (stageType) {
              var message =
                "Are you sure you wish to move this " +
                this.parentModel.module.name.singular +
                ' to the "' +
                (angular.isDefined(stageType) ? stageType : this.record.next_manuscript_stage_type) +
                '" stage?';

              // check to see if there are any active deferral notes for the active form
              var response = await CnHttpFactory.instance({
                path: this.parentModel.getServiceResourcePath() + '/manuscript_deferral_note'
              }).count();
              const deferralNotes = parseInt(response.headers("Total"));

              if (this.parentModel.isRole("administrator", "dao") && 0 < deferralNotes ) {
                message +=
                  "\n\nWARNING: There are deferral notes present, you may wish to remove them before proceeding.";
              }

              var response = await CnModalConfirmFactory.instance({
                message: message,
              }).show();

              if (response) {
                var queryString = "?action=next_stage";
                if (angular.isDefined(stageType))
                  queryString += "&manuscript_stage_type=" + stageType;
                await CnHttpFactory.instance({
                  path: this.parentModel.getServiceResourcePath() + queryString,
                }).patch();
                await this.reloadAll(["manuscriptReview", "manuscriptStage", "manuscriptNotification"]);
              }
            },

            defer: async function () {
              // check to see if there are any active deferral notes for the active form
              var response = await CnHttpFactory.instance({
                path: this.parentModel.getServiceResourcePath() + '/manuscript_deferral_note'
              }).count();
              const deferralNotes = parseInt(response.headers("Total"));

              var message =
                "Are you sure you wish to defer to the applicant?  " +
                "A notification will be sent indicating that an action is required by the applicant.";
              if (0 == deferralNotes) {
                message +=
                  "\n\nWARNING: there are currently no deferral notes to instruct the applicant why " +
                  "their attention is required.";
              }

              var response = await CnModalConfirmFactory.instance({
                message: message,
              }).show();
              if (response) {
                await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceResourcePath() + "?action=defer",
                }).patch();
                this.record.deferred = true;
                this.record.deferred_date = moment().format("YYYY-MM-DD");
                this.updateFormattedRecord("deferred_date", "date");
                await this.reloadAll(["manuscriptVersion", "notification"]);
              }
            },

            displayNotices: async function () {
              var noticeList = [];
              var response = await CnHttpFactory.instance({
                path: this.parentModel.getServiceResourcePath() + "/manuscript_notice",
                data: { modifier: { order: { datetime: true } } },
              }).query();

              CnModalNoticeListFactory.instance({
                title: "Notice List",
                noticeList: response.data,
              }).printMessage();
            },

            getChildTitle: function (child) {
              return "stage" == child.subject.snake
                ? "Stage History"
                : this.$$getChildTitle(child);
            },
          });

          async function init(object) {
            await object.deferred.promise;
            if (angular.isDefined(object.stageModel))
              object.stageModel.listModel.heading = "Stage History";
          }

          init(this);
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnManuscriptModelFactory", [
      "CnBaseModelFactory",
      "CnManuscriptAddFactory",
      "CnManuscriptListFactory",
      "CnManuscriptViewFactory",
      "$state",
      function (
        CnBaseModelFactory,
        CnManuscriptAddFactory,
        CnManuscriptListFactory,
        CnManuscriptViewFactory,
        $state
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnManuscriptAddFactory.instance(this);
          this.listModel = CnManuscriptListFactory.instance(this);
          this.viewModel = CnManuscriptViewFactory.instance(this, root);

          angular.extend(this, {
            // override the collection path so that applicants can view their manuscripts from the home screen
            getServiceCollectionPath: function () {
              // ignore the parent if it is the root state
              return this.$$getServiceCollectionPath("root" == this.getSubjectFromState());
            },

            getAddEnabled: function () {
              return (
                this.$$getAddEnabled() && (
                  // only allow applicants/designates to add manuscripts from the reqn_version
                  !this.isRole("applicant", "designate") ||
                  "reqn_version" == this.getSubjectFromState()
                )
              );
            },

            getEditEnabled: function () {
              var phase = this.viewModel.record.phase ? this.viewModel.record.phase : "";
              return (
                this.$$getEditEnabled() && (
                  this.isRole("applicant", "designate")
                    ? "new" == phase || (true === this.viewModel.record.deferred && "review" == phase)
                    : this.isRole("administrator", "dao")
                )
              );
            },

            getDeleteEnabled: function () {
              return (
                this.$$getDeleteEnabled() &&
                angular.isDefined(this.viewModel.record) &&
                "new" == this.viewModel.record.phase
              );
            },

            // override transitionToViewState (used when application views a manuscript)
            transitionToViewState: async function (record) {
              if (this.isRole("applicant", "designate")) {
                await $state.go(
                  "manuscript_version.view",
                  { identifier: "manuscript_id=" + record.getIdentifier() }
                );
              } else {
                await this.$$transitionToViewState(record);
              }
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
