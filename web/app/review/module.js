cenozoApp.defineModule({
  name: "review",
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
        singular: "review",
        plural: "reviews",
        possessive: "review's",
      },
      columnList: {
        identifier: { column: "reqn.identifier", title: "Requisition" },
        amendment: { title: "Amendment" },
        review_type: {
          column: "review_type.name",
          title: "Type",
          isIncluded: function ($state, model) {
            return "root.home" != $state.current.name;
          },
        },
        user_full_name: {
          title: "Reviewer",
          isIncluded: function ($state, model) {
            return !model.isRole("reviewer");
          },
        },
        datetime: { title: "Created On", type: "date" },
        answered_questions: {
          title: "Questions (Yes/Answered)",
          help: 'Displays the number of "Yes" Answers out of the number of Answered Questions.',
        },
        recommendation: {
          column: "recommendation_type.name",
          title: "Recommendation",
        },
        full_note: {
          title: "Full Note",
          align: "left",
          isIncluded: function ($state, model) {
            return "root.home" != $state.current.name;
          },
        },
      },
      defaultOrder: {
        column: "datetime",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      identifier: {
        column: "reqn.identifier",
        title: "Requisition",
        type: "lookup-typeahead",
        typeahead: {
          table: "reqn",
          select: "reqn.identifier",
          where: "reqn.identifier",
        },
        isConstant: true,
      },
      amendment: {
        title: "Amendment",
        type: "string",
        isConstant: true,
      },
      review_type: {
        column: "review_type.name",
        title: "Review Type",
        type: "string",
        isConstant: true,
      },
      user_id: {
        column: "review.user_id",
        title: "Reviewer",
        type: "lookup-typeahead",
        typeahead: {
          table: "user",
          select:
            'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
          where: ["user.first_name", "user.last_name", "user.name"],
        },
        isConstant: function ($state, model) {
          return !model.isRole("administrator", "chair");
        },
      },
      datetime: {
        title: "Created On",
        type: "date",
        isConstant: function ($state, model) {
          return !model.isRole("administrator", "chair");
        },
      },
      recommendation_type_id: {
        title: "Recommendation",
        type: "enum",
      },
      note: {
        title: "Note",
        type: "text",
      },
      reqn_id: { type: "hidden" },
      review_type_id: { type: "hidden" },
      current_reqn_version_id: { column: "reqn_version.id", type: "hidden" },
      peer_review_filename: {
        column: "reqn_version.peer_review_filename",
        type: "hidden",
      },
      funding_filename: {
        column: "reqn_version.funding_filename",
        type: "hidden",
      },
      ethics_filename: {
        column: "reqn_version.ethics_filename",
        type: "hidden",
      },
      agreement_filename: {
        column: "reqn_version.agreement_filename",
        type: "hidden",
      },
      editable: { type: "boolean", isExcluded: true },
    });

    module.addExtraOperation("view", {
      title: "View Form",
      operation: async function ($state, model) {
        await $state.go("reqn_version.view", {
          identifier: model.viewModel.record.current_reqn_version_id,
        });
      },
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
          title: "Proof of Peer Review",
          operation: async function ($state, model) {
            await model.viewModel.downloadFundingLetter();
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
          title: "Agreement Letter",
          operation: async function ($state, model) {
            await model.viewModel.downloadAgreementLetter();
          },
          isDisabled: function ($state, model) {
            return !model.viewModel.record.agreement_filename;
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
    cenozo.providers.factory("CnReviewViewFactory", [
      "CnBaseViewFactory",
      "CnReqnHelper",
      "CnHttpFactory",
      "CnSession",
      function (CnBaseViewFactory, CnReqnHelper, CnHttpFactory, CnSession) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          // administrators can edit any review, but other roles only have access to specific reviews
          // (updated after the record is loaded)
          angular.extend(this, {
            mayEdit: "administrator" == CnSession.role.name,
            onView: async function (force) {
              this.mayEdit = false;
              try {
                await this.$$onView(force);

                // determine which recommendation_type enum list to use based on the review type
                this.parentModel.metadata.columnList.recommendation_type_id.enumList =
                  this.parentModel.recommendationList[
                    this.record.review_type_id
                  ];
              } finally {
                this.mayEdit = this.record.editable;
              }
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
            downloadAgreementLetter: async function () {
              await CnReqnHelper.download(
                "agreement_filename",
                this.record.current_reqn_version_id
              );
            },
            downloadReviews: async function () {
              await CnHttpFactory.instance({
                path: "reqn/" + this.record.reqn_id + "?file=reviews",
                format: "txt",
              }).file();
            },
          });

          // add an additional check to see if the review is editable
          var self = this;
          this.parentModel.getEditEnabled = function () {
            return self.parentModel.$$getEditEnabled() && self.mayEdit;
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
    cenozo.providers.factory("CnReviewModelFactory", [
      "CnBaseModelFactory",
      "CnReviewListFactory",
      "CnReviewViewFactory",
      "CnSession",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnReviewListFactory,
        CnReviewViewFactory,
        CnSession,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnReviewListFactory.instance(this);
          this.viewModel = CnReviewViewFactory.instance(this, root);

          this.recommendationList = {};

          // override the service collection path so that reviewers can view their reviews from the home screen
          this.getServiceCollectionPath = function () {
            // ignore the parent if it is root
            return this.$$getServiceCollectionPath(
              "root" == this.getSubjectFromState()
            );
          };

          // override the service data so that reviewers only see their own incomplete reviews from the home screen
          this.getServiceData = function (type, columnRestrictLists) {
            var data = this.$$getServiceData(type, columnRestrictLists);
            if (
              "root" == this.getSubjectFromState() &&
              "reviewer" == CnSession.role.name
            ) {
              if (angular.isUndefined(data.modifier.where))
                data.modifier.where = [];
              data.modifier.where.push({
                column: "review.user_id",
                operator: "=",
                value: CnSession.user.id,
              });
              data.modifier.where.push({
                column: "review.recommendation_type_id",
                operator: "=",
                value: null,
              });
            }
            return data;
          };

          // extend getMetadata
          this.getMetadata = async function () {
            await this.$$getMetadata();

            var response = await CnHttpFactory.instance({
              path: "recommendation_type",
              data: {
                select: { column: ["id", "name", "review_type_id_list"] },
                modifier: { order: "recommendation_type.name", limit: 1000 },
              },
            }).query();

            this.metadata.columnList.recommendation_type_id = {
              required: false,
              enumList: [],
            };
            response.data.forEach((item) =>
              item.review_type_id_list.split(",").forEach((reviewTypeId) => {
                if (angular.isUndefined(this.recommendationList[reviewTypeId]))
                  this.recommendationList[reviewTypeId] = [];
                this.recommendationList[reviewTypeId].push({
                  value: item.id,
                  name: item.name,
                });
              })
            );
          };

          // extend getTypeaheadData
          this.getTypeaheadData = function (input, viewValue) {
            var data = this.$$getTypeaheadData(input, viewValue);

            // only include active reviewers (reviewer_only parameter handled by the service)
            if (
              "user" == input.typeahead.table &&
              null != this.viewModel.record.review_type.match(/Reviewer [0-9]/)
            )
              data.reviewer_only = true;

            return data;
          };
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
