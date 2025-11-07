cenozoApp.defineModule({
  name: "additional_fee_fee_schedule",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: [
          {
            subject: "fee_schedule",
            column: "fee_schedule.name",
          },
          {
            subject: "additional_fee",
            column: "additional_fee.name",
          },
        ],
      },
      name: {
        singular: "additional fee fee schedule",
        plural: "additional fee fee schedules",
        possessive: "additional fee fee schedule's",
      },
      columnList: {
        additional_fee: { title: "Additional Fee", column: "additional_fee.name" },
        fee_schedule: { title: "Fee Schedule", column: "fee_schedule.name" },
        fee: { title: "Fee", type: "currency:$:0" },
      },
      defaultOrder: {
        column: "additional_fee_fee_schedule.id",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      additional_fee: {
        title: "Additional Fee",
        column: "additional_fee.name",
        type: "string",
        isConstant: true,
      },
      fee_schedule: {
        title: "Fee Schedule",
        column: "fee_schedule.name",
        type: "string",
        isConstant: true,
      },
      fee: { title: "Fee ($)", type: "string", format: "integer" },
    });
  },
});
