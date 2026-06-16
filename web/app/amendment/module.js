cenozoApp.defineModule({
  name: "amendment",
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
        singular: "amendment",
        plural: "amendments",
        possessive: "amendment's",
      },
      columnList: {
        formatted_name: { title: "Name" },
        fee_schedule: { column: "fee_schedule.name", title: "Fee Schedule" },
        fee: { title: "Fee Change", type: "number", filter: "currency:$:0" },
        override_fee: { title: "Override Fee Change", type: "number", filter: "currency:$:0" },
        paid: { title: "Paid", type: "boolean" },
        has_agreement: { title: "Has Agreement", type: "boolean" },
        agreement_end_date: { column: "reqn_version.agreement_end_date", title: "Agreement End", type: "date" },
        datetime: { column: "first_reqn_version.datetime", title: "Datetime", type: "datetime" },
        note: { title: "Note", type: "text", limit: 200 },
      },
      defaultOrder: {
        column: "amendment.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      formatted_name: { title: "Name", type: "string", isConstant: true },
      fee_schedule_id: { title: "Fee Schedule", type: "enum" },
      fee: { title: "Fee Change ($)", type: "string", format: "integer", isConstant: true },
      override_fee: { title: "Override Fee Change ($)", type: "string", format: "integer" },
      paid: { title: "Paid", type: "boolean" },
      has_agreement: { title: "Has Agreement", type: "boolean", isConstant: true },
      datetime: {
        column: "first_reqn_version.datetime",
        title: "Datetime",
        type: "datetime",
        isConstant: true,
      },
      note: { title: "Note", type: "text" },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnAmendmentViewFactory", [
      "CnBaseViewFactory",
      function (CnBaseViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root, "stage");

          angular.extend(this, {
            onPatch: async function (data) {
              await this.$$onPatch(data);

              // if the fee schedule or override fee changed then reload the record to update the fee
              if (angular.isDefined(data.fee_schedule_id) || angular.isDefined(data.override_fee))
                await this.onView();
            },
          });

          async function init(object) {
            await object.deferred.promise;
            if (angular.isDefined(object.stageModel)) object.stageModel.listModel.heading = "Stage History";
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
    cenozo.providers.factory("CnAmendmentModelFactory", [
      "CnBaseModelFactory",
      "CnAmendmentListFactory",
      "CnAmendmentViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnAmendmentListFactory,
        CnAmendmentViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnAmendmentListFactory.instance(this);
          this.viewModel = CnAmendmentViewFactory.instance(this, root);

          // extend getMetadata
          this.getMetadata = async function () {
            await this.$$getMetadata();

            var dataSelectionResponse = await CnHttpFactory.instance({
              path: "fee_schedule",
              data: {
                select: { column: ["id", "name", "datetime"] },
                modifier: { order: "fee_schedule.datetime", limit: 1000 },
              },
            }).query();

            this.metadata.columnList.fee_schedule_id.enumList =
              dataSelectionResponse.data.reduce((list, item) => {
                list.push({
                  value: item.id,
                  name: item.name + " (" + moment(item.datetime).format("YYYY-MM-DD") + ")",
                });
                return list;
              }, []);
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
