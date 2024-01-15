cenozoApp.defineModule({
  name: "reqn",
  dependencies: ["output"],
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: { column: "identifier" },
      name: {
        singular: "requisition",
        plural: "requisitions",
        possessive: "requisition's",
      },
      columnList: {
        identifier: {
          title: "Identifier",
        },
        language: {
          title: "Language",
          column: "language.code",
          isIncluded: function ($state, model) {
            return (
              !model.isRole("applicant", "designate") &&
              "data_sharing" != model.getActionFromState()
            );
          },
        },
        legacy: {
          title: "Legacy",
          type: "boolean",
          isIncluded: function ($state, model) {
            return (
              !model.isRole("applicant", "designate", "typist") &&
              "data_sharing" != model.getActionFromState()
            );
          },
        },
        reqn_type: {
          column: "reqn_type.name",
          title: "Type",
        },
        user_full_name: {
          title: "Owner",
          isIncluded: function ($state, model) {
            return !model.isRole("applicant", "designate");
          },
        },
        trainee_full_name: {
          title: "Trainee",
        },
        designate_full_name: {
          title: "Designate",
        },
        deadline: {
          column: "deadline.name",
          title: "Deadline",
          isIncluded: function ($state, model) {
            return !model.isRole("typist");
          },
        },
        amendment_version: {
          title: "Version",
          isIncluded: function ($state, model) {
            return (
              !model.isRole("applicant", "designate", "typist") &&
              "data_sharing" != model.getActionFromState()
            );
          },
        },
        ethics_expiry: {
          column: "ethics_approval.date",
          title: "Ethics Expiry",
          type: "date",
          isIncluded: function ($state, model) {
            return (
              !model.isRole("typist") &&
              "data_sharing" != model.getActionFromState()
            );
          },
        },
        agreement_start_date: {
          column: "reqn_version.agreement_start_date",
          title: "Agreement Start",
          type: "date",
          isIncluded: function ($state, model) {
            return (
              model.isRole("applicant", "designate") &&
              "data_sharing" != model.getActionFromState()
            );
          },
        },
        agreement_end_date: {
          column: "reqn_version.agreement_end_date",
          title: "Agreement End",
          type: "date",
          isIncluded: function ($state, model) {
            return (
              model.isRole("applicant", "designate") &&
              "data_sharing" != model.getActionFromState()
            );
          },
        },
        status: {
          column: "stage_type.status",
          title: "Status",
          isIncluded: function ($state, model) {
            return (
              model.isRole("applicant", "designate") &&
              "data_sharing" != model.getActionFromState()
            );
          },
        },
        state: {
          title: "On Hold",
          type: "string",
          isIncluded: function ($state, model) {
            return (
              !model.isRole("applicant", "designate", "typist") &&
              "data_sharing" != model.getActionFromState()
            );
          },
          help: "The reason the requisition is on hold (empty if the requisition hasn't been held up)",
        },
        state_days: {
          title: "Days On Hold",
          type: "number",
          isIncluded: function ($state, model) {
            return (
              !model.isRole("applicant", "designate", "typist") &&
              "data_sharing" != model.getActionFromState()
            );
          },
          help: "The number of days since the requisition was put on hold (empty if the requisition hasn't been held up)",
        },
        reviewers_completed: {
          title: "Reviewers Completed",
          type: "number",
          isIncluded: function ($state, model) {
            return (
              model.isRole("chair") && "root" == model.getSubjectFromState()
            );
          },
        },
        stage_type: {
          column: "stage_type.name",
          title: "Stage",
          type: "string",
          isIncluded: function ($state, model) {
            return !model.isRole("applicant", "designate", "reviewer");
          },
        },
        phase: {
          column: "stage_type.phase",
          type: "hidden",
        },
        has_data_sharing_filename: {
          title: "Has Agreement",
          type: "boolean",
          isIncluded: function ($state, model) {
            return "data_sharing" == model.getActionFromState();
          },
        },
        data_sharing_approved: {
          title: "Approved",
          type: "boolean",
          isIncluded: function ($state, model) {
            return "data_sharing" == model.getActionFromState();
          },
          highlight: false, // highlight any unapproved reqns
        },
        non_payment: {
          type: "hidden",
          caution: true, // caution any reqn flagged for non-payment
        },
        reqn_version_id: {
          column: "reqn_version.id",
          type: "hidden",
        },
        final_report_id: {
          column: "final_report.id",
          type: "hidden",
        },
        destruction_report_id: {
          column: "destruction_report.id",
          type: "hidden",
        },
      },
      defaultOrder: {
        column: "identifier",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      identifier: {
        title: "Identifier",
        type: "string",
        isConstant: function ($state, model) {
          return !model.isRole("administrator", "typist");
        },
      },
      legacy: {
        title: "Legacy",
        type: "boolean",
        isConstant: function ($state, model) {
          return "view" == model.getActionFromState();
        },
        isExcluded: function ($state, model) {
          return !model.isRole("administrator");
        },
        help:
          "Legacy requisitions are those which were created outside of Magnolia. " +
          "Use this option when uploading pre-existing requisitions into the software.",
      },
      special_fee_waiver_id: {
        title: "Special Fee Waiver",
        type: "enum",
        isExcluded: function ($state, model) {
          return "view" != model.getActionFromState();
        },
        help:
          "The special fee waiver can only be applied to requisitions whose deadline falls in the waiver's " +
          "timespan, and only one requistion can be applied per waiver per applicant.",
      },
      show_prices: {
        title: "Show Fee",
        type: "boolean",
        isConstant: function($state, model) {
          // make sure the chair can only edit the chair's notes
          return model.isRole("chair");
        },
        isExcluded: function ($state, model) {
          return "view" != model.getActionFromState();
        },
        help:
          "Determines whether the fee for the application is calculated. " +
          "This also makes the applicant and trainee country a mandatory field.",
      },
      override_price: {
        title: "Override Fee ($)",
        type: "string",
        format: "integer",
        isConstant: function($state, model) {
          // make sure the chair can only edit the chair's notes
          return model.isRole("chair");
        },
        isExcluded: function ($state, model) {
          return "view" != model.getActionFromState();
        },
        help:
          "Overrides the fee calculation by the provided value. " +
          "If set then the applicant and trainee country will not be a mandatory field."
      },
      non_payment: {
        title: "Flag for Non-Payment",
        type: "boolean",
        isConstant: function($state, model) {
          // make sure the chair can only edit the chair's notes
          return model.isRole("chair");
        },
        isExcluded: function ($state, model) {
          return "view" != model.getActionFromState();
        },
        help: "Flags a requisition for non-payment.",
      },
      reqn_type_id: {
        title: "Requisition Type",
        type: "enum",
        isConstant: function ($state, model) {
          return model.isRole("administrator") &&
            (angular.isUndefined(model.viewModel.record.stage_type) ||
              "New" == model.viewModel.record.stage_type)
            ? false
            : "view";
        },
        isExcluded: function ($state, model) {
          return !model.isRole(
            "administrator",
            "communication",
            "readonly",
            "typist"
          );
        },
      },
      disable_notification: {
        title: "Disable Notifications",
        type: "boolean",
        isConstant: function ($state, model) {
          return !model.isRole("administrator", "typist");
        },
      },
      deadline_id: {
        title: "Deadline",
        type: "enum",
        isConstant: function ($state, model) {
          // only allow the deadline to be changed while in the admin review stage (hide if there is no deadline)
          return (
            !model.isRole("administrator") ||
            angular.isUndefined(model.viewModel.record.phase) ||
            "review" != model.viewModel.record.phase
          );
        },
        isExcluded: function ($state, model) {
          return !model.isRole("administrator") ||
            angular.isUndefined(model.viewModel.record.deadline_id) ||
            null == model.viewModel.record.deadline_id
            ? true
            : "add";
        },
      },
      user_id: {
        title: "Owner",
        type: "lookup-typeahead",
        typeahead: {
          table: "user",
          select:
            'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
          where: ["user.first_name", "user.last_name", "user.name"],
        },
        isConstant: function ($state, model) {
          // never constant when adding a new reqn
          if ("reqn.add" == $state.current.name) return false;

          // if the reqn has an agreement then we can't directly change the primary applicant
          return (
            !model.isRole("administrator") ||
            0 < model.viewModel.record.has_agreements
          );
        },
      },
      trainee_user_id: {
        title: "Trainee",
        type: "lookup-typeahead",
        typeahead: {
          table: "user",
          select:
            'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
          where: ["user.first_name", "user.last_name", "user.name"],
        },
        isConstant: function ($state, model) {
          // if the reqn has an agreement then we can't directly change the primary applicant
          return (
            !model.isRole("administrator") ||
            0 < model.viewModel.record.has_agreements
          );
        },
        isExcluded: "add",
        help: "Only users who have the applicant role and a supervisor can be selected.",
      },
      designate_user_id: {
        title: "Designate",
        type: "lookup-typeahead",
        typeahead: {
          table: "user",
          select:
            'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
          where: ["user.first_name", "user.last_name", "user.name"],
        },
        isConstant: function($state, model) {
          // make sure the chair can only edit the chair's notes
          return model.isRole("chair");
        },
        help: "Only users who have the designate role can be selected.",
      },
      language_id: {
        title: "Language",
        type: "enum",
        isConstant: function ($state, model) {
          return !model.isRole("administrator", "typist");
        },
        isExcluded: function ($state, model) {
          return !model.isRole("administrator", "readonly", "typist");
        },
      },
      stage_type: {
        title: "Current Stage",
        column: "stage_type.name",
        type: "string",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "communication", "readonly")
            ? "add"
            : true;
        },
      },
      state: {
        title: "State",
        type: "enum",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "communication", "readonly") ? "add" : true;
        },
      },
      state_date: {
        title: "State Set On",
        type: "date",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "communication", "readonly") ? "add" : true;
        },
      },
      website: {
        title: "Published on Website",
        type: "boolean",
        isConstant: function ($state, model) {
          return !model.isRole("administrator", "communication");
        },
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "communication") ? "add" : true;
        },
      },
      data_sharing_approved: {
        title: "CANUE Agreement Approved",
        type: "boolean",
        isConstant: function ($state, model) {
          return (
            !model.isRole("administrator") ||
            null == model.viewModel.record.data_sharing_filename
          );
        },
        isExcluded: function ($state, model) {
          return (
            !model.isRole("administrator") ||
            "add" == model.getActionFromState() ||
            !model.viewModel.record.has_linked_data
          );
        },
        help:
          "Whether the requisition's CANUE agreement file has been approved. " +
          "Note that this can only set once a file has been uploaded.",
      },
      data_expiry_date: {
        title: "Data Expiry Date",
        type: "date",
        isConstant: function ($state, model) {
          // show the study data available if we're in the active phase
          return (
            angular.isUndefined(model.viewModel.record.phase) ||
            "active" != model.viewModel.record.phase
          );
        },
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "readonly") ? "add" : true;
        },
      },
      title: {
        column: "reqn_version.title",
        title: "Title",
        type: "string",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "readonly", "typist");
        },
      },
      lay_summary: {
        column: "reqn_version.lay_summary",
        title: "Lay Summary",
        type: "text",
        isConstant: true,
        isExcluded: function ($state, model) {
          return model.isRole("administrator", "readonly", "typist");
        },
      },
      instruction_filename: {
        column: "instruction_filename",
        title: "Additional Documentation",
        type: "file",
        isConstant: function ($state, model) {
          return !model.isRole("administrator");
        },
        isExcluded: function ($state, model) {
          // show the agreement and instruction files if we're past the review stage
          return (
            "add" == model.getActionFromState() ||
            angular.isUndefined(model.viewModel.record.phase) ||
            !["active", "finalization", "complete"].includes(model.viewModel.record.phase)
          );
        },
      },
      suggested_revisions: {
        title: "Suggested Revisions",
        type: "boolean",
        isExcluded: function ($state, model) {
          // show the suggested revisions checkbox to admins when in the decision made stage
          return (
            !model.isRole("administrator") ||
            angular.isUndefined(model.viewModel.record.stage_type) ||
            "Decision Made" != model.viewModel.record.stage_type ||
            angular.isUndefined(model.viewModel.record.next_stage_type) ||
            "Not Approved" == model.viewModel.record.next_stage_type
          );
        },
      },
      note: {
        title: "Administrative Notes",
        type: "text",
        isExcluded: function ($state, model) {
          return !model.isRole("administrator", "readonly", "typist");
        },
      },
      chair_note: {
        title: "Chair's Notes",
        type: "text",
        isExcluded: function ($state, model) {
          return !model.isRole("administrator", "chair");
        },
      },

      current_reqn_version_id: {
        column: "reqn_version.id",
        type: "string",
        isExcluded: true,
      },
      current_final_report_id: {
        column: "final_report.id",
        type: "string",
        isExcluded: true,
      },
      current_destruction_report_id: {
        column: "destruction_report.id",
        type: "string",
        isExcluded: true,
      },
      next_stage_type: { type: "string", isExcluded: true },
      amendment: {
        column: "reqn_version.amendment",
        type: "string",
        isExcluded: true,
      },
      peer_review_filename: {
        column: "reqn_version.peer_review_filename",
        type: "string",
        isExcluded: true,
      },
      funding_filename: {
        column: "reqn_version.funding_filename",
        type: "string",
        isExcluded: true,
      },
      ethics_date: {
        column: "ethics_approval.date",
        type: "date",
        isExcluded: true,
      },
      ethics_filename: {
        column: "reqn_version.ethics_filename",
        type: "string",
        isExcluded: true,
      },
      has_agreements: { type: "boolean", isExcluded: true },
      has_ethics_approval_list: { type: "boolean", isExcluded: true },
      has_linked_data: { type: "boolean", isExcluded: true },
      data_sharing_filename: {
        column: "reqn_version.data_sharing_filename",
        type: "string",
        isExcluded: true,
      },
      data_directory: { type: "string", isExcluded: true },
      phase: { column: "stage_type.phase", type: "string", isExcluded: true },
      status: { column: "stage_type.status", type: "string", isExcluded: true },
      lang: { type: "string", column: "language.code", isExcluded: true },
      deadline: {
        type: "datetime",
        column: "deadline.datetime",
        isExcluded: true,
      },
    });

    module.addExtraOperationGroup("view", {
      title: "View Form",
      operations: [
        {
          title: "Application",
          operation: async function ($state, model) {
            await $state.go(
              "reqn_version.view",
              { identifier: model.viewModel.record.current_reqn_version_id }
            );
          },
        },
        {
          title: "Final Report",
          isIncluded: function ($state, model) {
            return model.viewModel.record.current_final_report_id;
          },
          operation: async function ($state, model) {
            await $state.go(
              "final_report.view",
              { identifier: model.viewModel.record.current_final_report_id }
            );
          },
        },
        {
          title: "Destruction Report",
          isIncluded: function ($state, model) {
            return model.viewModel.record.current_destruction_report_id;
          },
          operation: async function ($state, model) {
            await $state.go(
              "destruction_report.view",
              { identifier: model.viewModel.record.current_destruction_report_id }
            );
          },
        },
      ],
    });

    module.addExtraOperationGroup("view", {
      title: "Action",
      operations: [
        {
          title: "Reset Study Data",
          isIncluded: function ($state, model) { return model.viewModel.canManageData(); },
          operation: function ($state, model) { model.viewModel.resetData(); },
        },
        {
          title: "Defer to Applicant",
          classes: "btn-warning",
          isIncluded: function ($state, model) { return model.viewModel.show("defer"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("defer"); },
          operation: function ($state, model) { model.viewModel.defer(); },
        },
        {
          title: "Abandon",
          classes: "btn-danger",
          isIncluded: function ($state, model) { return model.viewModel.show("abandon"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("abandon"); },
          operation: function ($state, model) { model.viewModel.abandon(); },
        },
        {
          title: "De-activate",
          classes: "btn-danger",
          isIncluded: function ($state, model) { return model.viewModel.show("deactivate"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("deactivate"); },
          operation: function ($state, model) { model.viewModel.deactivate(); },
        },
        {
          title: "Re-activate",
          classes: "btn-warning",
          isIncluded: function ($state, model) { return model.viewModel.show("reactivate"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("reactivate"); },
          operation: function ($state, model) { model.viewModel.reactivate(); },
        },
        {
          title: "Incomplete",
          classes: "btn-danger",
          isIncluded: function ($state, model) { return model.viewModel.show("incomplete"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("incomplete"); },
          operation: function ($state, model) { model.viewModel.incomplete(); },
        },
        {
          title: "Withdraw",
          classes: "btn-danger",
          isIncluded: function ($state, model) { return model.viewModel.show("withdraw"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("withdraw"); },
          operation: function ($state, model) { model.viewModel.withdraw(); },
        },
        {
          title: "Recreate",
          classes: "btn-success",
          isIncluded: function ($state, model) { return model.viewModel.show("recreate"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("recreate"); },
          operation: function ($state, model) { model.viewModel.recreate(); },
        },
        {
          title: "Reverse",
          classes: "btn-warning",
          isIncluded: function ($state, model) { return model.viewModel.show("reverse"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("reverse"); },
          operation: function ($state, model) { model.viewModel.reverse(); },
        },
        {
          title: "Reject",
          classes: "btn-danger",
          isIncluded: function ($state, model) { return model.viewModel.show("reject"); },
          isDisabled: function ($state, model) { return !model.viewModel.enabled("reject"); },
          operation: function ($state, model) { model.viewModel.reject(); },
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
      title: "Proceed...",
      isIncluded: function ($state, model) { return model.viewModel.show("amendment proceed"); },
      isDisabled: function ($state, model) { return !model.viewModel.enabled("proceed"); },
      classes: "btn-success",
      operations: [
        {
          title: "To Feasibility Review",
          operation: function ($state, model) { model.viewModel.proceed("Feasibility Review"); },
          isIncluded: function ($state, model) { return model.viewModel.show("amendment feasibility review"); },
        },
        {
          title: "To DSAC Review",
          operation: function ($state, model) { model.viewModel.proceed("DSAC Review"); },
          isIncluded: function ($state, model) { return model.viewModel.show("amendment dsac review"); },
        },
        {
          title: "To Decision Made",
          operation: function ($state, model) { model.viewModel.proceed("Decision Made"); },
          isIncluded: function ($state, model) { return model.viewModel.show("amendment decision made"); },
        },
        {
          title: "To Agreement",
          operation: function ($state, model) { model.viewModel.proceed("Agreement"); },
          isIncluded: function ($state, model) { return model.viewModel.show("amendment agreement"); },
        },
        {
          title: "To Data Release",
          operation: function ($state, model) { model.viewModel.proceed("Data Release"); },
          isIncluded: function ($state, model) { return model.viewModel.show("amendment data release"); },
        },
        {
          title: "To Active",
          operation: function ($state, model) { model.viewModel.proceed("Active"); },
          isIncluded: function ($state, model) { return model.viewModel.show("amendment active"); },
        },
      ],
    });

    module.addExtraOperationGroup("view", {
      title: "Download",
      operations: [
        {
          title: "Application",
          operation: async function ($state, model) {
            await model.viewModel.downloadApplication();
          },
        },
        {
          title: "Data Checklist",
          operation: async function ($state, model) {
            await model.viewModel.downloadChecklist();
          },
        },
        {
          title: "Application + Data Checklist",
          operation: async function ($state, model) {
            await model.viewModel.downloadApplicationAndChecklist();
          },
        },
        {
          title: "Selected Data Options",
          operation: async function ($state, model) {
            await model.viewModel.downloadDataOptions();
          },
        },
        {
          title: "Proof of Peer Review",
          operation: async function ($state, model) {
            await model.viewModel.downloadPeerReview();
          },
          isDisabled: function ($state, model) {
            return !model.viewModel.record.peer_review_filename;
          },
        },
        {
          title: "Funding Letter",
          operation: async function ($state, model) {
            await model.viewModel.downloadFundingLetter();
          },
          isDisabled: function ($state, model) {
            return !model.viewModel.record.funding_filename;
          },
        },
        {
          title: "Ethics Letter/Exemption",
          operation: async function ($state, model) {
            await model.viewModel.downloadEthicsLetter();
          },
          isDisabled: function ($state, model) {
            return !model.viewModel.record.ethics_filename;
          },
        },
        {
          title: "Agreement Letters",
          operation: async function ($state, model) {
            await model.viewModel.downloadAgreementLetters();
          },
          isDisabled: function ($state, model) {
            return !model.viewModel.record.has_agreements;
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
        {
          title: "Final Report",
          operation: async function ($state, model) {
            await model.viewModel.downloadFinalReport();
          },
          isIncluded: function ($state, model) {
            return (
              "finalization" == model.viewModel.record.phase ||
              "Complete" == model.viewModel.record.stage_type
            );
          },
        },
        {
          title: "Destruction Report",
          operation: async function ($state, model) {
            await model.viewModel.downloadDestructionReport();
          },
          isIncluded: function ($state, model) {
            return ["Data Destruction", "Complete"].includes(model.viewModel.record.stage_type);
          },
        },
        {
          title: "Study Data",
          operation: function ($state, model) {
            model.viewModel.viewData();
          },
          isIncluded: function ($state, model) {
            return model.viewModel.canViewData();
          },
        },
      ],
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnReqnDataSharing", [
      "CnReqnModelFactory",
      "CnSession",
      "$state",
      function (CnReqnModelFactory, CnSession, $state) {
        return {
          templateUrl: module.getFileUrl("list.tpl.html"),
          restrict: "E",
          scope: { model: "=?", removeColumns: "@" },
          controller: function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnReqnModelFactory.root;

            CnSession.setBreadcrumbTrail([
              {
                title: $scope.model.module.name.plural.ucWords(),
                go: async function () { await $state.go("reqn.list"); },
              },
              {
                title: "CANUE Approvals",
              },
            ]);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnReqnAddFactory", [
      "CnBaseAddFactory",
      "CnSession",
      "$state",
      function (CnBaseAddFactory, CnSession, $state) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);

          // immediately view the user record after it has been created
          this.transitionOnSave = function (record) {
            CnSession.workingTransition(async function () {
              await $state.go("reqn_version.view", { identifier: "identifier=" + record.identifier });
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
    cenozo.providers.factory("CnReqnListFactory", [
      "CnBaseListFactory",
      "$state",
      function (CnBaseListFactory, $state) {
        var object = function (parentModel) {
          CnBaseListFactory.construct(this, parentModel);

          angular.extend(this, {
            // Set the heading as part of the 'onList' function so that it updates if we switch from the main
            // reqn list to/from the special data-sharing list
            onList: function (replace) {
              this.heading =
                parentModel.module.name.plural.ucWords() +
                ("data_sharing" == parentModel.getActionFromState()
                  ? " Requiring CANUE Agreements"
                  : " List");
              return this.$$onList(replace);
            },

            search: this.parentModel.getQueryParameter("search"),
            showSearch: function () {
              return "reqn" == this.parentModel.getSubjectFromState();
            },
            applySearch: async function () {
              this.parentModel.setQueryParameter("search", this.search);
              await this.parentModel.reloadState(true);
            },
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
    cenozo.providers.factory("CnReqnViewFactory", [
      "CnBaseViewFactory",
      "CnReqnHelper",
      "CnSession",
      "CnHttpFactory",
      "CnModalMessageFactory",
      "CnModalConfirmFactory",
      "CnModalNoticeListFactory",
      "$window",
      "$state",
      function (
        CnBaseViewFactory,
        CnReqnHelper,
        CnSession,
        CnHttpFactory,
        CnModalMessageFactory,
        CnModalConfirmFactory,
        CnModalNoticeListFactory,
        $window,
        $state
      ) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root, "stage");

          angular.extend(this, {
            show: function (subject) {
              return CnReqnHelper.showAction(subject, this.record);
            },
            abandon: async function () {
              var response = await CnReqnHelper.abandon(
                this.record.getIdentifier(),
                "." != this.record.amendment,
                this.record.lang
              );

              if (response) {
                this.record.state = "abandoned";
                this.record.state_date = moment().format("YYYY-MM-DD");
                this.updateFormattedRecord("state_date", "date");
                if (angular.isDefined(this.notificationModel))
                  await this.notificationModel.listModel.onList(true);
              }
            },
            delete: async function () {
              await CnReqnHelper.delete(
                this.record.getIdentifier(),
                this.record.lang
              );
            },
            translate: async function (value) {
              (await this.record.lang)
                ? CnReqnHelper.translate("reqn", value, this.record.lang)
                : "";
            },
            downloadApplication: async function () {
              await CnReqnHelper.download(
                "application",
                this.record.current_reqn_version_id
              );
            },
            downloadChecklist: async function () {
              await CnReqnHelper.download(
                "checklist",
                this.record.current_reqn_version_id
              );
            },
            downloadApplicationAndChecklist: async function () {
              await CnReqnHelper.download(
                "application_and_checklist",
                this.record.current_reqn_version_id
              );
            },
            downloadDataOptions: async function () {
              await CnReqnHelper.download(
                "data_option_list",
                this.record.current_reqn_version_id
              );
            },
            downloadPeerReview: async function () {
              await CnReqnHelper.download(
                "peer_review_filename",
                this.record.current_reqn_version_id
              );
            },
            downloadFundingLetter: async function () {
              await CnReqnHelper.download(
                "funding_filename",
                this.record.current_reqn_version_id
              );
            },
            downloadEthicsLetter: async function () {
              await CnReqnHelper.download(
                "ethics_filename",
                this.record.current_reqn_version_id
              );
            },
            downloadAgreementLetters: async function () {
              await CnHttpFactory.instance({
                path:
                  this.parentModel.getServiceResourcePath() +
                  "?file=agreements",
                format: "zip",
              }).file();
            },
            downloadReviews: async function () {
              await CnHttpFactory.instance({
                path:
                  this.parentModel.getServiceResourcePath() + "?file=reviews",
                format: "txt",
              }).file();
            },
            downloadFinalReport: async function () {
              await CnReqnHelper.download(
                "final_report",
                this.record.current_final_report_id
              );
            },
            downloadDestructionReport: async function () {
              await CnReqnHelper.download(
                "destruction_report",
                this.record.current_destruction_report_id
              );
            },

            resetData: async function () {
              var response = await CnHttpFactory.instance({
                path:
                  this.parentModel.getServiceResourcePath() +
                  "?action=reset_data",
              }).patch();

              CnModalMessageFactory.instance({
                title: "Study Data Reset",
                message: response.data
                  ? "This " +
                    this.parentModel.module.name.possessive +
                    " study data has been made available and will automatically expire in " +
                    CnSession.application.studyDataExpiry +
                    " days."
                  : "Warning: The " +
                    this.parentModel.module.name.singular +
                    " has no data to make available.",
                error: !response.data,
              }).show();

              await this.onView();
            },
            canManageData: function () {
              // administrators can manage reqn data when in the data release and active stages only
              var stage_type = this.record.stage_type
                ? this.record.stage_type
                : "";
              return (
                this.parentModel.isRole("administrator") &&
                ("Data Release" == stage_type || "Active" == stage_type)
              );
            },
            viewData: function () {
              $window.open(
                CnSession.application.studyDataUrl +
                  "/" +
                  this.record.data_directory,
                "studyData" + this.record.id
              );
            },
            canViewData: function () {
              // administrators and applicants can view data when in the active stage
              var stage_type = this.record.stage_type
                ? this.record.stage_type
                : "";
              return (
                (this.parentModel.isRole("administrator") &&
                  ["Data Release", "Active"].includes(stage_type)) ||
                (this.parentModel.isRole("applicant", "designate") &&
                  "Active" == stage_type)
              );
            },
            onView: async function (force) {
              // update the output list language
              this.updateOutputListLanguage();

              if (this.parentModel.isRole("reviewer")) {
                // If we are a reviewer assigned to this reqn and haven't completed our review then show a reminder
                var response = await CnHttpFactory.instance({
                  path: this.parentModel.getServiceResourcePath() + "/review",
                  data: {
                    select: {
                      column: [
                        "recommendation_type_id",
                        "answers",
                        "questions",
                        { table: "review_type", column: "name" },
                      ],
                    },
                    modifier: {
                      where: [
                        {
                          column: "review.user_id",
                          operator: "=",
                          value: CnSession.user.id,
                        },
                        {
                          column: "review_type.name",
                          operator: "LIKE",
                          value: "Reviewer %",
                        },
                      ],
                    },
                  },
                }).query();

                var outstandingReview = null;
                response.data.some((review) => {
                  if (
                    null == review.recommendation_type_id ||
                    review.answers < review.questions
                  ) {
                    outstandingReview = review;
                    return true;
                  }
                });
                if (null != outstandingReview) {
                  var message =
                    'Please note: you are responsible for the "' +
                    outstandingReview.name +
                    '" review belonging to this ' +
                    this.parentModel.module.name.singular +
                    " which has not been completed.\n\n" +
                    "In order for the review process to proceed you must ";

                  // warn if the recommendation hasn't been completed
                  if (null == outstandingReview.recommendation_type_id) {
                    message += "provide a recommendation";
                    if (outstandingReview.answers < outstandingReview.questions)
                      message += " and ";
                  }

                  // warn if a question is unanswered
                  if (outstandingReview.answers < outstandingReview.questions) {
                    message +=
                      "answer all review questions (" +
                      outstandingReview.answers +
                      " of " +
                      outstandingReview.questions +
                      " have been answered)";
                  }

                  message += ".";

                  CnModalMessageFactory.instance({
                    title: "Outstanding Review",
                    message: message,
                  }).show();
                }
              }

              // update the column languages in case they were changed while viewing a report
              await this.$$onView(force);

              // update whether we can edit the data destroy list
              if (angular.isDefined(this.dataDestroyModel)) {
                this.dataDestroyModel.getAddEnabled = "Pre Data Destruction" == this.record.stage_type ?
                  function () { return this.$$getAddEnabled(); } : function () { return false; }
                this.dataDestroyModel.getDeleteEnabled = "Pre Data Destruction" == this.record.stage_type ?
                  function () { return this.$$getDeleteEnabled(); } : function () { return false; }
              }

              if (angular.isDefined(this.noticeModel)) {
                this.noticeModel.columnList.viewed_by_trainee_user.isIncluded =
                  null == this.record.trainee_user_id
                    ? function () {
                        return false;
                      }
                    : function () {
                        return true;
                      };
                this.noticeModel.columnList.viewed_by_designate_user.isIncluded =
                  null == this.record.designate_user_id
                    ? function () {
                        return false;
                      }
                    : function () {
                        return true;
                      };
              }

              const deadline = parentModel.metadata.columnList.deadline_id.enumList.findByProperty(
                "value",
                this.record.deadline_id
              );
              parentModel.metadata.columnList.special_fee_waiver_id.enumList.forEach( item => {
                item.disabled = !(
                  null != deadline &&
                  item.start_date <= deadline.datetime &&
                  deadline.datetime <= item.end_date
                );
              });
            },

            updateOutputListLanguage: function () {
              var columnList = cenozoApp.module("output").columnList;
              columnList.output_type_en.isIncluded = function ($state, model) {
                return true;
              };
              columnList.output_type_fr.isIncluded = function ($state, model) {
                return false;
              };
              columnList.output_type_en.title = CnReqnHelper.translate(
                "output",
                "output_type",
                "en"
              );
              columnList.output_type_fr.title = CnReqnHelper.translate(
                "output",
                "output_type",
                "fr"
              );
              columnList.detail.title = CnReqnHelper.translate(
                "output",
                "detail",
                "en"
              );
              columnList.output_source_count.title = CnReqnHelper.translate(
                "output",
                "output_source_count",
                "en"
              );
            },

            onPatch: async function (data) {
              var changingUser = angular.isDefined(data.user_id);
              var changingTrainee = angular.isDefined(data.trainee_user_id);

              // don't allow the user and trainee to be the same person
              if (
                (changingUser && this.record.trainee_user_id == data.user_id) ||
                (changingTrainee && this.record.user_id == data.trainee_user_id)
              ) {
                await CnModalMessageFactory.instance({
                  title: "Invalid User Selection",
                  message:
                    "You cannot set the owner and trainee to be the same person.",
                  error: true,
                }).show();

                // we're not making the change so put back the old user
                if (changingUser) {
                  this.record.user_id = this.backupRecord.user_id;
                  this.formattedRecord.user_id =
                    this.backupRecord.formatted_user_id;
                } else {
                  this.record.trainee_user_id =
                    this.backupRecord.trainee_user_id;
                  this.formattedRecord.trainee_user_id =
                    this.backupRecord.formatted_trainee_user_id;
                }
              } else {
                var proceed = true;

                // show a warning when changing the primary applicant
                if (changingUser) {
                  var response = await CnModalConfirmFactory.instance({
                    title: "Change Owner",
                    message:
                      "Changing the " +
                      this.parentModel.module.name.possessive +
                      " primary applicant will immediately remove " +
                      "it from the old owner's " +
                      this.parentModel.module.name.singular +
                      " list and add it to the new " +
                      "owner's list.  Also, a notification will be sent to both the old and new applicants explaining the " +
                      "transfer of ownership.\n\nAre you sure you wish to proceed?",
                  }).show();
                  proceed = response;
                }

                if (proceed) {
                  await this.$$onPatch(data);

                  // Reload the view if we're changing the suggested revisions (the next stage will change)
                  // or reqn type (the deadline might change)
                  if (
                    angular.isDefined(data.suggested_revisions) ||
                    angular.isDefined(data.reqn_type_id)
                  )
                    await this.onView();

                  // Reload the notification list if we're changing the user
                  if (changingUser && angular.isDefined(this.notificationModel))
                    await this.notificationModel.listModel.onList(true);
                } else if (changingUser) {
                  // we're not making the change so put back the old user
                  this.record.user_id = this.backupRecord.user_id;
                  this.formattedRecord.user_id =
                    this.backupRecord.formatted_user_id;
                }
              }
            },

            enabled: function (subject) {
              var state = this.record.state ? this.record.state : "";
              if (
                ["abandon", "deactivate", "defer", "incomplete", "withdraw", "reactivate", "recreate", "reverse"]
                  .includes(subject)
              ) {
                return true;
              } else if (
                "proceed" == subject &&
                "." != this.record.amendment &&
                ["Admin Review", "Feasibility Review", "Decision Made", "Agreement"]
                  .includes(this.record.stage_type)
              ) {
                // the next stage isn't always set when in an amendment, so only check for state
                return !state;
              } else if (["proceed", "reject"].includes(subject)) {
                return !state && null != this.record.next_stage_type;
              } else return false;
            },

            getActiveForm: function() {
              var phase = this.record.phase ? this.record.phase : "";
              let stageType = this.record.stage_type ? this.record.stage_type : "";
              if (stageType.match(/Destruction/)) return "destruction_report";
              else if ("finalization" == phase) return "final_report";
              return "application";
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
                await this.reloadAll(["review", "stage", "notification"]);
              }
            },

            proceed: async function (stageType) {
              var message =
                "Are you sure you wish to move this " +
                this.parentModel.module.name.singular +
                ' to the "' +
                (angular.isDefined(stageType)
                  ? stageType
                  : this.record.next_stage_type) +
                '" stage?';

              // check to see if there are any active deferral notes for the active form
              var response = await CnHttpFactory.instance({
                path: this.parentModel.getServiceResourcePath() + '/deferral_note',
                data: { modifier: { where: { column: "form", operator: '=', value: this.getActiveForm() } } }
              }).count();
              const deferralNotes = parseInt(response.headers("Total"));

              if (this.parentModel.isRole("administrator") && 0 < deferralNotes ) {
                message +=
                  "\n\nWARNING: There are deferral notes present, you may wish to remove them before proceeding.";
              }

              if ("Data Release" == this.record.next_stage_type) {
                if (this.record.has_ethics_approval_list) {
                  if (null == this.record.ethics_date) {
                    message +=
                      "\n\nWARNING: This " +
                      this.parentModel.module.name.singular +
                      " has no ethics agreement, " +
                      "you may not wish to proceed until one has been uploaded.";
                  } else if (moment().isAfter(this.record.ethics_date, "day")) {
                    message +=
                      "\n\nWARNING: This " +
                      this.parentModel.module.name.possessive +
                      " ethics expired on " +
                      moment(this.record.ethics_date).format("MMMM D, YYYY") +
                      ", " +
                      "you may not wish to proceed until a new ethics agreement has been uploaded.";
                  }
                } else {
                  if (!this.record.ethics_filename) {
                    message +=
                      "\n\nWARNING: This " +
                      this.parentModel.module.name.singular +
                      " has no ethics agreement, " +
                      "you may not wish to proceed until one has been uploaded.";
                  }
                }
              } else if ("Pre Data Destruction" == this.record.stage_type) {
                // the next stage depends on data destroy records, so get the current next stage now
                const response = await CnHttpFactory.instance({
                  path: this.parentModel.getServiceResourcePath(),
                  data: { select: { column: 'next_stage_type' } },
                }).get();

                message =
                  "Are you sure you wish to move this " +
                  this.parentModel.module.name.singular +
                  ' to the "' + response.data.next_stage_type + '" stage?';
                if ("Complete" == response.data.next_stage_type) {
                  message +=
                    "\n\nWARNING: There is no data to destroy, so the Data Destruction stage will be skipped.";
                }
              } else if ("Data Destruction" == this.record.stage_type) {
                // warn if there are any data-destroy records without a date
                const response = await CnHttpFactory.instance({
                  path: this.parentModel.getServiceResourcePath() + "/data_destroy",
                  data: { modifier: { where: { column: "data_destroy.datetime", operator: "=", value: null } } },
                }).count();

                const count = parseInt(response.headers("Total"));
                if(0 < count) {
                  message +=
                    "\n\nWARNING: There are " + count + " data versions that do not have a date of destruction.";
                }
              }

              var response = await CnModalConfirmFactory.instance({
                message: message,
              }).show();

              if (response) {
                var queryString = "?action=next_stage";
                if (angular.isDefined(stageType))
                  queryString += "&stage_type=" + stageType;
                await CnHttpFactory.instance({
                  path: this.parentModel.getServiceResourcePath() + queryString,
                }).patch();
                await this.reloadAll(["review", "stage", "notification"]);
              }
            },

            reject: async function () {
              var message =
                "Are you sure you wish to reject the " +
                this.parentModel.module.name.singular +
                "?";
              var response = await CnModalConfirmFactory.instance({
                message: message,
              }).show();

              if (response) {
                await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceResourcePath() +
                    "?action=reject",
                }).patch();
                await this.reloadAll(["review", "stage", "notification"]);
              }
            },

            defer: async function () {
              // check to see if there are any active deferral notes for the active form
              var response = await CnHttpFactory.instance({
                path: this.parentModel.getServiceResourcePath() + '/deferral_note',
                data: { modifier: { where: { column: "form", operator: '=', value: this.getActiveForm() } } }
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
                this.record.state = "deferred";
                this.record.state_date = moment().format("YYYY-MM-DD");
                this.updateFormattedRecord("state_date", "date");
                await this.reloadAll(["reqnVersion", "notification"]);
              }
            },

            deactivate: async function () {
              var response = await CnModalConfirmFactory.instance({
                message:
                  "Are you sure you wish to de-activate the " +
                  this.parentModel.module.name.singular +
                  "?" +
                  "\n\nThe applicant will no longer be able to edit or submit the " +
                  this.parentModel.module.name.singular +
                  ".",
              }).show();
              if (response) {
                await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceResourcePath() +
                    "?action=deactivate",
                }).patch();
                this.record.state = "inactive";
                this.record.state_date = moment().format("YYYY-MM-DD");
                this.updateFormattedRecord("state_date", "date");
                if (angular.isDefined(this.notificationModel))
                  this.notificationModel.listModel.onList(true);
              }
            },

            incomplete: async function () {
              var response = await CnModalConfirmFactory.instance({
                message:
                  "Are you sure you wish to mark this " +
                  this.parentModel.module.name.singular +
                  " as permanently incomplete?" +
                  "\n\nThere is no undoing this action. However, once moved to the incomplete stage the " +
                  this.parentModel.module.name.singular +
                  " can be recreated as a new application.",
              }).show();
              if (response) {
                await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceResourcePath() +
                    "?action=incomplete",
                }).patch();
                await this.reloadAll(["stage", "notification"]);
              }
            },

            withdraw: async function () {
              var response = await CnModalConfirmFactory.instance({
                message:
                  "Are you sure you wish to mark this " +
                  this.parentModel.module.name.singular +
                  " as permanently withdrawn?" +
                  "\n\nThere is no undoing this action. However, once moved to the withdrawn stage the " +
                  this.parentModel.module.name.singular +
                  " can be recreated as a new application.",
              }).show();
              if (response) {
                await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceResourcePath() +
                    "?action=withdraw",
                }).patch();
                await this.reloadAll(["stage", "notification"]);
              }
            },

            reactivate: async function () {
              var response = await CnModalConfirmFactory.instance({
                message:
                  "Are you sure you wish to re-activate the " +
                  this.parentModel.module.name.singular +
                  "?" +
                  "\n\nThe applicant will be notified that it has been re-activated and they will be able to re-submit for review.",
              }).show();
              if (response) {
                await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceResourcePath() +
                    "?action=reactivate",
                }).patch();
                this.record.state =
                  "abandoned" == this.record.state ? "deferred" : "";
                this.record.state_date =
                  "abandoned" == this.record.state
                    ? moment().format("YYYY-MM-DD")
                    : null;
                this.updateFormattedRecord("state_date", "date");
                if (angular.isDefined(this.notificationModel))
                  await this.notificationModel.listModel.onList(true);
              }
            },

            recreate: async function () {
              var response = await CnModalConfirmFactory.instance({
                message:
                  "Are you sure you wish to recreate the " +
                  this.parentModel.module.name.singular +
                  "?" +
                  "\n\nA new " +
                  this.parentModel.module.name.singular +
                  " will be created using all of the details " +
                  "provided in this " +
                  this.parentModel.module.name.singular +
                  ".",
              }).show();
              if (response) {
                var response = await CnHttpFactory.instance({
                  path:
                    this.parentModel.getServiceCollectionPath() +
                    "?clone=" +
                    this.record.identifier,
                }).post();

                // redirect to the new requestion
                await $state.go("reqn.view", { identifier: response.data });
              }
            },

            displayNotices: async function () {
              var noticeList = [];
              var response = await CnHttpFactory.instance({
                path: this.parentModel.getServiceResourcePath() + "/notice",
                data: { modifier: { order: { datetime: true } } },
              }).query();

              CnModalNoticeListFactory.instance({
                title: "Notice List",
                closeText: this.translate("misc.close"),
                noticeList: response.data,
              }).printMessage();
            },

            getChildTitle: function (child) {
              return "stage" == child.subject.snake
                ? "Stage History"
                : this.$$getChildTitle(child);
            },

            getChildList: function () {
              var list = this.$$getChildList();

              // remove the final report item if not in the finalization phase or complete stage
              if ("finalization" == this.record.phase || "Complete" == this.record.stage_type) {
                list = list.filter( (child) => "final_report" != child.subject.snake );
              }

              // remove the destruction report item if not in the data destruction or complete stage
              if ( !["Data Destruction", "Complete"].includes( this.record.stage_type ) ) {
                list = list.filter( (child) => "destruction_report" != child.subject.snake );
              }

              // remove the ethics approval item if this reqn has no ethics approval list
              if (!this.record.has_ethics_approval_list) {
                list = list.filter( (child) => "ethics_approval" != child.subject.snake );
              }

              // remove the packaged data item is not in the data release or active stage
              if (!["Data Release", "Active"].includes(this.record.stage_type)) {
                list = list.filter( (child) => "packaged_data" != child.subject.snake );
              }

              // remove the data destruction item if not in the data destruction stages
              if (!["Pre Data Destruction", "Data Destruction"].includes(this.record.stage_type)) {
                list = list.filter( (child) => "data_destroy" != child.subject.snake );
              }

              return list;
            },
          });

          this.configureFileInput("instruction_filename");

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
    cenozo.providers.factory("CnReqnModelFactory", [
      "CnReqnHelper",
      "CnBaseModelFactory",
      "CnReqnAddFactory",
      "CnReqnListFactory",
      "CnReqnViewFactory",
      "CnHttpFactory",
      "CnSession",
      "$state",
      function (
        CnReqnHelper,
        CnBaseModelFactory,
        CnReqnAddFactory,
        CnReqnListFactory,
        CnReqnViewFactory,
        CnHttpFactory,
        CnSession,
        $state
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnReqnAddFactory.instance(this);
          this.listModel = CnReqnListFactory.instance(this);
          this.viewModel = CnReqnViewFactory.instance(this, root);

          angular.extend(this, {
            // override the service collection path so that applicants can view their reqns from the home screen
            getServiceCollectionPath: function () {
              // ignore the parent if it is the root state
              return (
                this.$$getServiceCollectionPath(
                  "root" == this.getSubjectFromState()
                ) +
                ("data_sharing" == this.getActionFromState()
                  ? "?data_sharing=1"
                  : "")
              );
            },

            getAddEnabled: function () {
              return (
                this.$$getAddEnabled() &&
                ("reqn" == this.getSubjectFromState() ||
                  ("root" == this.getSubjectFromState() &&
                    this.isRole("applicant")))
              );
            },

            getEditEnabled: function () {
              var phase = this.viewModel.record.phase ? this.viewModel.record.phase : "";
              var state = this.viewModel.record.state ? this.viewModel.record.state : "";
              return (
                this.$$getEditEnabled() && (
                  this.isRole("applicant", "designate")
                    ? "new" == phase || ("deferred" == state && "review" == phase)
                    : this.isRole("administrator", "chair", "communication", "typist")
                )
              );
            },

            getDeleteEnabled: function () {
              return (
                this.$$getDeleteEnabled() &&
                angular.isDefined(this.listModel.record) &&
                "new" == this.listModel.record.phase
              );
            },

            // override transitionToAddState (used when applicant creates a new reqn)
            transitionToAddState: async function () {
              // for applicants immediately get a new reqn and view it (no add state required)
              if ("applicant" != CnSession.role.name) {
                this.$$transitionToAddState();
              } else {
                var response = await CnHttpFactory.instance({
                  path: "reqn",
                  data: { user_id: CnSession.user.id },
                }).post();
                var newId = response.data;

                // get the new reqn version id
                var response = await CnHttpFactory.instance({
                  path: "reqn/" + newId,
                  data: {
                    select: {
                      column: {
                        table: "reqn_version",
                        column: "id",
                        alias: "reqn_version_id",
                      },
                    },
                  },
                }).get();

                await $state.go("reqn_version.view", { identifier: response.data.reqn_version_id });
              }
            },

            // override transitionToViewState (used when application views a reqn)
            transitionToViewState: async function (record) {
              if (this.isRole("applicant", "designate", "typist")) {
                let state = "reqn_version.view";
                let args = { identifier: record.reqn_version_id };
                if ("finalization" == record.phase) {
                  if ("Data Destruction" == record.stage_type) {
                    state = "destruction_report.view";
                    args = { identifier: record.destruction_report_id };
                  } else if (null == record.stage_type.match(/Data Destruction/)) {
                    state = "final_report.view";
                    args = { identifier: record.final_report_id };
                  }
                }
                await $state.go(state, args);
              } else {
                await this.$$transitionToViewState(record);
              }
            },

            // override the service collection
            getServiceData: function (type, columnRestrictLists) {
              var data = this.$$getServiceData(type, columnRestrictLists);

              if ("root" == this.getSubjectFromState()) {
                // chairs only see DSAC reqns from the home screen
                if (angular.isUndefined(data.modifier.where))
                  data.modifier.where = [];
                if (this.isRole("chair")) {
                  data.modifier.where.push({
                    column: "stage_type.name",
                    operator: "LIKE",
                    value: "%DSAC%",
                  });
                  // EC only see EC reqns from the home screen
                } else if (this.isRole("ec")) {
                  data.modifier.where.push({
                    column: "stage_type.name",
                    operator: "LIKE",
                    value: "%EC%",
                  });
                }
              } else if (
                "list" == type &&
                "reqn" == this.getSubjectFromState()
              ) {
                // apply the search term if there is one
                var search = this.getQueryParameter("search");
                if (search) data.search = search;
              }

              return data;
            },

            getTypeaheadData: function (input, viewValue) {
              var data = this.$$getTypeaheadData(input, viewValue);

              if ("trainee_user_id" == input.key) {
                data.modifier.join = {
                  table: "applicant",
                  onleft: "user.id",
                  onright: "applicant.user_id",
                };
                data.modifier.where.push({
                  column: "applicant.supervisor_user_id",
                  operator: "!=",
                  value: null,
                });
              } else if ("designate_user_id" == input.key) {
                data.modifier.join = [
                  {
                    table: "access",
                    onleft: "user.id",
                    onright: "access.user_id",
                  },
                  {
                    table: "role",
                    onleft: "access.role_id",
                    onright: "role.id",
                  },
                ];
                data.modifier.where.push({
                  column: "role.name",
                  operator: "=",
                  value: "designate",
                });
              }

              return data;
            },

            getMetadata: async function () {
              await this.$$getMetadata();

              var [reqnTypeResponse, deadlineResponse, specialFeeWaiverResponse, languageResponse] =
                await Promise.all([
                  CnHttpFactory.instance({
                    path: "reqn_type",
                    data: {
                      select: { column: ["id", "name"] },
                      modifier: { order: "name", limit: 1000 },
                    },
                  }).query(),

                  CnHttpFactory.instance({
                    path: "deadline",
                    data: {
                      select: { column: ["id", "name", "datetime"] },
                      modifier: { order: "datetime", desc: true, limit: 1000 },
                    },
                  }).query(),

                  CnHttpFactory.instance({
                    path: "special_fee_waiver",
                    data: {
                      select: { column: ["id", "name", "start_date", "end_date"] },
                      modifier: { order: "start_date", desc: true, limit: 1000 },
                    },
                  }).query(),

                  CnHttpFactory.instance({
                    path: "language",
                    data: {
                      select: { column: ["id", "name"] },
                      modifier: {
                        where: { column: "active", operator: "=", value: true },
                        order: "name",
                        limit: 1000,
                      },
                    },
                  }).query(),
                ]);

              this.metadata.columnList.reqn_type_id.enumList =
                reqnTypeResponse.data.reduce((list, item) => {
                  list.push({ value: item.id, name: item.name });
                  return list;
                }, []);

              this.metadata.columnList.deadline_id.enumList =
                deadlineResponse.data.reduce((list, item) => {
                  list.push({ value: item.id, datetime: item.datetime, name: item.name });
                  return list;
                }, []);

              this.metadata.columnList.special_fee_waiver_id.enumList =
                specialFeeWaiverResponse.data.reduce((list, item) => {
                  list.push({
                    value: item.id,
                    name: item.name,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    disabled: true
                  });
                  return list;
                }, []);

              this.metadata.columnList.language_id.enumList =
                languageResponse.data.reduce((list, item) => {
                  list.push({ value: item.id, name: item.name });
                  return list;
                }, []);
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
