cenozoApp.extendModule({
  name: "site",
  create: (module) => {
    // we don't need the participant_count column
    delete module.columnList.participant_count;
  },
});
