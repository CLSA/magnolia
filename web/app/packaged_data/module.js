cenozoApp.defineModule({
  name: "packaged_data",
  models: "list",
  create: (module) => {
    angular.extend(module, {
      identifier: {}, // standard
      name: {
        singular: "packaged data",
        plural: "packaged data",
        possessive: "packaged data's",
      },
      columnList: {
        filename: {
          title: "Filename",
        },
      },
      defaultOrder: {
        column: "filename",
        reverse: false,
      },
    });
  },
});
