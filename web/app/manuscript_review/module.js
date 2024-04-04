cenozoApp.defineModule({
  name: "manuscript_review",
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
        singular: "review",
        plural: "reviews",
        possessive: "review's",
      },
      columnList: {
        title: { column: "manuscript.title", title: "Requisition" },
        amendment: { title: "Amendment" },
        manuscript_review_type: {
          column: "manuscript_review_type.name",
          title: "Type",
          isIncluded: function ($state, model) {
            return "root.home" != $state.current.name;
          },
        },
        user_full_name: {
          title: "Reviewer",
        },
        datetime: { title: "Created On", type: "date" },
        answered_questions: {
          title: "Questions (Yes/Answered)",
          help: 'Displays the number of "Yes" Answers out of the number of Answered Questions.',
        },
        recommendation: {
          column: "manuscript_recommendation_type.name",
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
      title: {
        column: "manuscript.title",
        title: "Requisition",
        type: "string",
        isConstant: true,
      },
      amendment: {
        title: "Amendment",
        type: "string",
        isConstant: true,
      },
      manuscript_review_type: {
        column: "manuscript_review_type.name",
        title: "Review Type",
        type: "string",
        isConstant: true,
      },
      user_id: {
        column: "manuscript_review.user_id",
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
      manuscript_recommendation_type_id: {
        title: "Recommendation",
        type: "enum",
      },
      note: {
        title: "Note",
        type: "text",
      },
      manuscript_id: { type: "hidden" },
      manuscript_review_type_id: { type: "hidden" },
      current_manuscript_version_id: { column: "manuscript_version.id", type: "hidden" },
      editable: { type: "boolean", isExcluded: true },
    });

    module.addExtraOperation("view", {
      title: "View Form",
      operation: async function ($state, model) {
        await $state.go("manuscript_version.view", {
          identifier: model.viewModel.record.current_manuscript_version_id,
        });
      },
    });

    module.addExtraOperationGroup("view", {
      title: "Download",
      operations: [
        {
          title: "Manuscript Review",
          operation: async function ($state, model) {
            await model.viewModel.downloadManuscript();
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
    cenozo.providers.factory("CnManuscriptReviewViewFactory", [
      "CnBaseViewFactory",
      "CnManuscriptHelper",
      "CnHttpFactory",
      "CnSession",
      function (CnBaseViewFactory, CnManuscriptHelper, CnHttpFactory, CnSession) {
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
                this.parentModel.metadata.columnList.manuscript_recommendation_type_id.enumList =
                  this.parentModel.manuscriptRecommendationList[this.record.review_type_id];
              } finally {
                this.mayEdit = this.record.editable;
              }
            },

            downloadManuscript: async function () {
              await CnManuscriptHelper.download(
                this.record.current_manuscript_version_id
              );
            },
            downloadReviews: async function () {
              await CnHttpFactory.instance({
                path: "manuscript/" + this.record.manuscript_id + "?file=reviews",
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
    cenozo.providers.factory("CnManuscriptReviewModelFactory", [
      "CnBaseModelFactory",
      "CnManuscriptReviewListFactory",
      "CnManuscriptReviewViewFactory",
      "CnSession",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnManuscriptReviewListFactory,
        CnManuscriptReviewViewFactory,
        CnSession,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnManuscriptReviewListFactory.instance(this);
          this.viewModel = CnManuscriptReviewViewFactory.instance(this, root);

          this.recommendationList = {};

          // extend getMetadata
          this.getMetadata = async function () {
            await this.$$getMetadata();

            var response = await CnHttpFactory.instance({
              path: "manuscript_recommendation_type",
              data: {
                select: { column: ["id", "name", "review_type_id_list"] },
                modifier: { order: "manuscript_recommendation_type.name", limit: 1000 },
              },
            }).query();

            this.metadata.columnList.manuscript_recommendation_type_id = {
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
