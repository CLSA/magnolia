cenozoApp.defineModule({
  name: "special_fee_waiver",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        column: "name",
      },
      name: {
        singular: "special fee waiver",
        plural: "special fee waivers",
        possessive: "special fee waiver's",
      },
      columnList: {
        name: { title: "Name", },
        start_date: { title: "Start", type: "date" },
        end_date: { title: "End", type: "date" },
        reqn_count: { title: "Requisitions" },
      },
      defaultOrder: {
        column: "name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
        format: "identifier",
      },
      start_date: {
        title: "Start Date",
        type: "date",
      },
      end_date: {
        title: "End Date",
        type: "date",
        min: "start_date",
      },
    });
  },
});
