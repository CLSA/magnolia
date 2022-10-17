"use strict";

var cenozo = angular.module("cenozo");

cenozo.controller("HeaderCtrl", [
  "$scope",
  "CnBaseHeader",
  async function ($scope, CnBaseHeader) {
    // copy all properties from the base header
    await CnBaseHeader.construct($scope);
  },
]);

/* ############################################################################################## */
cenozo.directive("cnViewInputWithDifferences", function () {
  return {
    templateUrl: cenozoApp.getFileUrl(
      "magnolia",
      "view-input-with-differences.tpl.html"
    ),
    restrict: "E",
    scope: {
      model: "=",
      difference: "=",
      input: "=",
      noHelpIndicator: "=",
      noCols: "=",
    },
    controller: [
      "$scope",
      function ($scope) {
        $scope.directive = "cnViewInputWithDifferences";
      },
    ],
  };
});

/* ############################################################################################## */
cenozo.directive("cnDeferralNote", function () {
  return {
    templateUrl: cenozoApp.getFileUrl("magnolia", "deferral-note.tpl.html"),
    restrict: "E",
    scope: { note: "@" },
    controller: [
      "$scope",
      function ($scope) {
        if( angular.isUndefined( $scope.$parent.model.inputList[$scope.note] ) ) {
          throw new Error("Missing deferral note '" + $scope.note + "' in input list.");
        }

        angular.extend($scope, {
          directive: "cnDeferralNote",
          input: {
            key: $scope.note,
            title: "Note to Applicant",
            type: $scope.$parent.model.inputList[$scope.note].type,
          },
        });
      },
    ],
  };
});

/* ############################################################################################## */
cenozo.service("CnModalNoticeListFactory", [
  "CnModalMessageFactory",
  "$uibModal",
  "$window",
  "$filter",
  function (CnModalMessageFactory, $uibModal, $window, $filter) {
    var object = function (params) {
      angular.extend(this, {
        title: "Title",
        closeText: "Close",
        noticeList: [],
      });
      angular.extend(this, params);

      angular.extend(this, {
        printMessage: function () {
          var printWindow = $window.open(
            "",
            "_blank",
            "width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no"
          );
          if (null == printWindow) {
            CnModalMessageFactory.instance({
              title: "Permission Required",
              message:
                "Your web browser is not allowing this site to open pop-up windows. " +
                "In order to download your notices you must allow pop-up windows in your browser’s settings.",
              error: true,
            }).show();
          } else {
            printWindow.document.open();
            var body = '<html><body onload="window.print()">';
            this.noticeList.forEach((notice) => {
              body +=
                "<h3>" +
                $filter("cnDatetime")(notice.datetime, "date") +
                ": " +
                notice.title +
                "</h3>" +
                "<div>" +
                $filter("cnNewlines")(notice.description) +
                "</div>";
            });
            body += "</body></html>";

            printWindow.document.write(body);
            printWindow.document.close();
          }
        },

        show: function () {
          var self = this;
          this.modal = $uibModal.open({
            backdrop: "static",
            keyboard: !this.block,
            modalFade: true,
            templateUrl: cenozoApp.getFileUrl(
              "magnolia",
              "modal-notice-list.tpl.html"
            ),
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.model = self;
                $scope.close = function () {
                  $uibModalInstance.close(false);
                };
              },
            ],
          });

          return this.modal.result;
        },

        close: function () {
          if (angular.isDefined(this.modal)) this.modal.close(false);
        },
      });
    };

    return {
      instance: function (params) {
        return new object(angular.isUndefined(params) ? {} : params);
      },
    };
  },
]);

/* ############################################################################################## */
cenozo.service("CnModalSubmitLegacyFactory", [
  "$uibModal",
  function ($uibModal) {
    var object = function (params) {
      angular.extend(this, params);

      angular.extend(this, {
        show: function () {
          var self = this;
          return $uibModal.open({
            backdrop: "static",
            keyboard: true,
            modalFade: true,
            templateUrl: cenozoApp.getFileUrl(
              "magnolia",
              "modal-submit-legacy.tpl.html"
            ),
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.model = self;
                $scope.stage_type = "Active";
                $scope.ok = function () {
                  $uibModalInstance.close($scope.stage_type);
                };
                $scope.cancel = function () {
                  $uibModalInstance.close(null);
                };
              },
            ],
          }).result;
        },
      });
    };

    return {
      instance: function (params) {
        return new object(angular.isUndefined(params) ? {} : params);
      },
    };
  },
]);

/* ############################################################################################## */
cenozo.service("CnModalUploadAgreementFactory", [
  "CnSession",
  "CnHttpFactory",
  "CnModalDatetimeFactory",
  "$uibModal",
  function (CnSession, CnHttpFactory, CnModalDatetimeFactory, $uibModal) {
    var object = function (params) {
      angular.extend(this, params);

      this.show = function () {
        return $uibModal.open({
          backdrop: "static",
          keyboard: true,
          modalFade: true,
          templateUrl: cenozoApp.getFileUrl(
            "magnolia",
            "modal-upload-agreement.tpl.html"
          ),
          controller: [
            "$scope",
            "$uibModalInstance",
            function ($scope, $uibModalInstance) {
              angular.extend($scope, {
                filename: null,
                startDate: null,
                startDateFormatted: null,
                endDate: null,
                endDateFormatted: null,

                file: {
                  key: "agreement_filename",
                  file: null,
                  uploading: false,
                  getFilename: function () {
                    var obj = this;
                    var data = new FormData();
                    data.append("file", obj.file);
                    var fileDetails = data.get("file");
                    return fileDetails.name;
                  },
                  upload: async function (path) {
                    var obj = this;

                    // upload the file
                    try {
                      obj.uploading = true;
                      await CnHttpFactory.instance({
                        path: path + "?file=agreement_filename",
                        data: obj.file,
                        format: "unknown",
                      }).patch();
                    } finally {
                      obj.uploading = false;
                    }
                  },
                },

                selectDatetime: async function (input) {
                  var response = await CnModalDatetimeFactory.instance({
                    title: "startDate" == input ? "Start Date" : "End Date",
                    date: $scope[input],
                    pickerType: "date",
                    emptyAllowed: false,
                    minDate: "endDate" == input ? $scope.startDate : null,
                    maxDate: "startDate" == input ? $scope.endDate : null,
                  }).show();

                  if (false !== response) {
                    $scope[input] = response;
                    $scope[input + "Formatted"] = CnSession.formatValue(
                      response,
                      "date",
                      true
                    );
                  }
                },

                ok: function () {
                  $uibModalInstance.close({
                    file: $scope.file,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate,
                  });
                },
                cancel: function () {
                  $uibModalInstance.close(false);
                },
              });
            },
          ],
        }).result;
      };
    };

    return {
      instance: function (params) {
        return new object(angular.isUndefined(params) ? {} : params);
      },
    };
  },
]);

/* ############################################################################################## */
cenozo.service("CnReqnHelper", [
  "CnSession",
  "CnHttpFactory",
  "CnModalConfirmFactory",
  "$state",
  function (CnSession, CnHttpFactory, CnModalConfirmFactory, $state) {
    var object = {
      promise: null,

      showAction: function (subject, record) {
        var role = CnSession.role.name;
        var phase = record.phase ? record.phase : "";
        var state = record.state ? record.state : "";
        var stage_type = record.stage_type ? record.stage_type : "";

        if ("submit" == subject) {
          return (
            ["applicant", "designate", "administrator", "typist"].includes(
              role
            ) &&
            ("new" == phase || "deferred" == state)
          );
        } else if ("view" == subject) {
          return !["applicant", "designate"].includes(role);
        } else if ("abandon" == subject) {
          return "." == record.amendment
            ? // non-amendment process
              ["administrator", "applicant", "designate"].includes(role) &&
                "deferred" == state &&
                "review" == phase
            : // amendment process
              ["administrator", "applicant", "designate"].includes(role) &&
                "Admin Review" == record.stage_type;
        } else if ("delete" == subject) {
          return "new" == phase;
        } else if ("defer" == subject) {
          return (
            "administrator" == role &&
            !["abandoned", "inactive", "deferred"].includes(state) &&
            ["review", "active"].includes(phase)
          );
        } else if ("amend" == subject) {
          return (
            ["administrator", "applicant", "designate", "typist"].includes(
              role
            ) &&
            !["abandoned", "deferred"].includes(state) &&
            "active" == phase &&
            "Report Required" != stage_type
          );
        } else if ("deactivate" == subject) {
          return (
            "administrator" == role &&
            !["abandoned", "inactive"].includes(state) &&
            !["new", "complete"].includes(phase)
          );
        } else if ("incomplete" == subject) {
          return (
            "administrator" == role &&
            "." == record.amendment &&
            ("review" == phase ||
              ["Agreement", "Data Release"].includes(record.stage_type))
          );
        } else if ("withdraw" == subject) {
          return "administrator" == role && "active" == phase;
        } else if ("reactivate" == subject) {
          return (
            "administrator" == role && ["abandoned", "inactive"].includes(state)
          );
        } else if ("recreate" == subject) {
          return "administrator" == role && "complete" == phase;
        } else if ("report" == subject) {
          return ["Report Required", "Complete"].includes(stage_type);
        } else if ("proceed" == subject) {
          return (
            "complete" != phase &&
            (("administrator" == role && "new" != phase) ||
              ("chair" == role && stage_type.includes("DSAC")) ||
              ("smt" == role && stage_type.includes("SMT"))) &&
            !this.showAction("amendment proceed", record)
          );
        } else if ("reject" == subject) {
          return (
            "DSAC Selection" == stage_type &&
            ["administrator", "chair"].includes(role)
          );
        } else if ("compare" == subject) {
          return !["applicant", "designate"].includes(role);
        } else if ("amendment proceed" == subject) {
          return (
            "." != record.amendment &&
            [
              "Admin Review",
              "Feasibility Review",
              "Decision Made",
              "Agreement",
            ].includes(stage_type) &&
            "administrator" == role
          );
        } else if ("amendment feasibility review" == subject) {
          return "Admin Review" == stage_type;
        } else if ("amendment dsac review" == subject) {
          return "Feasibility Review" == stage_type;
        } else if ("amendment decision made" == subject) {
          return ["Admin Review", "Feasibility Review"].includes(stage_type);
        } else if ("amendment agreement" == subject) {
          return "Decision Made" == stage_type;
        } else if ("amendment data release" == subject) {
          return ["Decision Made", "Agreement"].includes(stage_type);
        } else if ("amendment active" == subject) {
          return ["Decision Made", "Agreement"].includes(stage_type);
        } else return false;
      },

      abandon: async function (reqnIdentifier, amendment, language) {
        var message = "";
        if (amendment) {
          if (["applicant", "designate"].includes(CnSession.role.name)) {
            message = this.translate(
              "reqn",
              "misc.abandonAmendmentWarning",
              language
            );
          } else {
            message =
              "Are you sure you want to abandon the amendment?" +
              "\n\nThe amendment process will be discontinued and the requisition will be returned back to its previous status.";
          }
        } else {
          if (["applicant", "designate"].includes(CnSession.role.name)) {
            message = this.translate("reqn", "misc.abandonWarning", language);
          } else {
            message =
              "Are you sure you wish to abandon the requisition?" +
              "\n\nThe applicant will no longer have access to the requisition and the review process will " +
              "be discontinued. It is possible to re-activate the requisition at a later time.";
          }
        }
        var response = await CnModalConfirmFactory.instance({
          title: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("reqn", "misc.pleaseConfirm", language)
            : "Please Confirm",
          noText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("reqn", "misc.no", language)
            : "No",
          yesText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("reqn", "misc.yes", language)
            : "Yes",
          message: message,
        }).show();

        if (response) {
          await CnHttpFactory.instance({
            path: "reqn/" + reqnIdentifier + "?action=abandon",
          }).patch();
          return true;
        }

        return false;
      },

      delete: async function (reqnIdentifier, language) {
        var response = await CnModalConfirmFactory.instance({
          title: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("reqn", "misc.pleaseConfirm", language)
            : "Please Confirm",
          noText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("reqn", "misc.no", language)
            : "No",
          yesText: ["applicant", "designate"].includes(CnSession.role.name)
            ? this.translate("reqn", "misc.yes", language)
            : "Yes",
          message: this.translate("reqn", "misc.deleteWarning", language),
        }).show();

        if (response) {
          await CnHttpFactory.instance({
            path: "reqn/" + reqnIdentifier,
          }).delete();
          await $state.go(
            ["applicant", "designate"].includes(CnSession.role.name)
              ? "root.home"
              : "reqn.list"
          );
        }
      },

      download: async function (subject, id) {
        var http = {
          path:
            "final_report" == subject
              ? "final_report/" + id
              : "reqn_version/" + id + "?file=" + subject,
          format:
            "final_report" == subject
              ? "pdf"
              : "data_options" == subject
              ? "csv"
              : "unknown",
        };
        await CnHttpFactory.instance(http).file();
      },

      translate: function (subject, address, language) {
        var addressParts = address.split(".");

        function get(array, index) {
          if (angular.isUndefined(index)) index = 0;
          var part = addressParts[index];
          return angular.isUndefined(array[part])
            ? "ERROR"
            : angular.isDefined(array[part][language])
            ? array[part][language]
            : get(array[part], index + 1);
        }

        return get(this.lookupData[subject]);
      },

      lookupData: {
        reqn: {
          heading: {
            en: "Data and Biospecimen Request Application",
            fr: "Demande d’accès aux données et aux échantillons",
          },
          instructions: {
            tab: { en: "Instructions", fr: "Consignes" },
            title: {
              en: "Instructions for completing an application",
              fr: "Consignes pour remplir une demande",
            },
            text1: {
              en: 'Please note that the CLSA <strong>only accepts applications for data that are available at the time of submission</strong>.  To know what data are currently available, please consult the <a href="https://www.clsa-elcv.ca/doc/3162" target="data_availability">CLSA Data Availability Table</a> which is regularly updated as data become available.  Applications proposing the use of data that are not available at the time of submission will not be considered for review, and you will need to reapply once those data become available.',
              fr: 'Veuillez noter que l’ÉLCV <strong>accepte les demandes uniquement pour les données disponibles au moment de la soumission</strong>. Pour connaître les données disponibles actuellement, consultez le <a href="https://www.clsa-elcv.ca/doc/3162" target="data_availability">tableau de disponibilité des données de l’ÉLCV</a>, qui est mis à jour régulièrement à mesure que de nouvelles données deviennent disponibles. Les demandes proposant l’utilisation de données qui ne sont pas disponibles au moment de la soumission ne seront pas examinées, et il faudra présenter une nouvelle demande dès que ces données seront disponibles.',
            },
            text2: {
              en: 'Please consult the CLSA website for instructions, policies, and procedures for CLSA data and biospecimen access: <a href="http://www.clsa-elcv.ca/data-access" target="clsa">www.clsa-elcv.ca/data-access</a> and get informed about the <a href="https://www.clsa-elcv.ca/data-application-tips" target="tips">Tips for preparing a CLSA Data Access Application</a>. Applicants are also encouraged to review the pertinent sections of the relevant CLSA protocol(s), Data Collection Tools and Physical Assessments in advance of completing the application. Additional information on the variables in the CLSA dataset is on the <a href="https://datapreview.clsa-elcv.ca/" target="dpp">CLSA Data Preview Portal</a>.',
              fr: 'Veuillez consulter les consignes, les politiques et la procédure de demande d’accès aux données et aux échantillons sur le site Web de l’ÉLCV : <a href="https://www.clsa-elcv.ca/fr/acces-aux-donnees" target="clsa">www.clsa-elcv.ca/fr/acces-aux-donnees</a> et informez-vous sur les <a href="https://www.clsa-elcv.ca/fr/acces-aux-donnees/documents-dacces-aux-donnees-et-aux-echantillons/conseils-pour-preparer-une" target="tips">Conseils pour préparer une demande d’accès aux données de l’ÉLCV | Étude longitudinale canadienne sur le vieillissement (clsa-elcv.ca)</a>. Nous encourageons les demandeurs à consulter les sections pertinentes du protocole de l’ÉLCV (en anglais seulement), les outils de collecte de données et les tests physiques avant de remplir une demande d’accès. Des informations supplémentaires sur les variables contenues dans l’ensemble de données de l’ÉLCV sont disponibles sur le <a href="https://datapreview.clsa-elcv.ca/" target="dpp">Portail de données de l’ÉLCV</a>.',
            },
            text3: {
              en: 'Consult us for any questions regarding your application at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez nous transmettre toute question relative aux demandes d’accès aux données de l’ÉLCV en écrivant à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
            },
            text4: {
              en: "The application is composed of 3 parts:<ul><li>Part 1: General Project Information</li><li>Part 2: Data Checklist</li><li>Part 3: Biospecimen Checklist (forthcoming)</li></ul>",
              fr: "La demande est séparée en trois parties :<ul><li>1<sup>re</sup> partie : Renseignements généraux</li><li>2<sup>e</sup> partie : Sélection des données</li><li>3<sup>e</sup> partie : Sélection des échantillons biologiques (à venir)</li></ul>",
            },
            text5: {
              en: 'Additional information or instructions are available anywhere that the <b class="invert">ⓘ</b> symbol appears. Hover your mouse cursor over the text to see the additional details.',
              fr: 'Des informations ou des instructions supplémentaires sont disponibles partout où le symbole <b class="invert">ⓘ</b> apparaît. Passez le curseur sur le texte pour voir les informations supplémentaires.',
            },
            text6: {
              en: "Please ensure that you have completed <strong>all of the sections of the application</strong> form that are relevant to your application. Incomplete applications may result in processing delays or refusal of your application.",
              fr: "Assurez-vous de bien remplir <strong>toutes les sections pertinentes du formulaire de demande d’accès</strong>. Les demandes incomplètes pourront causer un retard dans le traitement de votre demande ou entraîner un refus.",
            },
          },
          amendment: {
            tab: { en: "Amendment", fr: "Modification" },
            title: {
              en: "Amendment Details",
              fr: "Détails de la modification",
            },
            text1: {
              en: "Amendment requests will be reviewed as they are received. Amendments must NOT be operationalized until the amendment has been approved.",
              fr: "Les demandes de modification seront évalués au fur et à mesure qu’ils seront reçus. Vous DEVEZ attendre l’autorisation avant d’effectuer les modifications demandées.",
            },
            text2: {
              en: 'All requests will be reviewed by the CLSA. If the change is deemed to be significant, the request will be forwarded to the Chair of the CLSA Data and Biospecimen Access Committee (DSAC) who may request a new application be submitted for review and approval. Certain changes may require an amendment to your CLSA Access Agreement.  If you require a change to the title of your project please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: "Toutes les demandes seront révisées par l’ÉLCV. Si les changements apportés sont jugés majeurs, la demande sera envoyée au président du Comité chargé de l’accès aux données et aux échantillons biologiques qui pourrait exiger qu’une nouvelle demande d’accès soit soumise et approuvée. Certains changements peuvent nécessiter une modification de votre Entente d’accès de l’ÉLCV.  Si vous souhaitez modifier le titre de votre projet, veuillez contacter access@clsa-elcv.ca.",
            },
            text3: {
              en: "Please indicate the purpose of your amendment request. (Check ALL that apply):",
              fr: "Veuillez indiquer le motif de votre demande de modification (cochez toutes les cases qui s’appliquent) :",
            },
            atLeastOne: {
              en: "You must select at least one reason for your amendment request.",
              fr: "Vous devez sélectionner au moins un motif pour votre demande de modification.",
            },
            newUser: {
              en: "Please provide the name of the new primary applicant",
              fr: "Veuillez fournir le nom du nouveau demandeur principal",
            },
            newUserNotice: {
              en: "Changing the primary applicant, once approved, will remove your access to this application and transfer ownership to the new applicant.\n\nAre you sure you wish to proceed?",
              fr: "Une fois approuvé, le changement de demandeur principal supprimera votre accès à cette demande et la propriété du compte sera transférée au nouveau demandeur.\n\nÊtes-vous sûr(e) de vouloir continuer?",
            },
            newUserIsTraineeNotice: {
              en: "The applicant you have selected is a trainee.  Please select a new applicant which does not have a supervisor.",
              fr: "Le demandeur que vous avez sélectionné est un stagiaire. Veuillez sélectionner un nouveau demandeur qui n’a pas de superviseur.",
            },
          },
          part1: {
            tab: { en: "Part 1", fr: "1<sup>re</sup> partie" },
            title: {
              en: "Part 1 of 3: General Project Information",
              fr: "Partie 1 de 3 : Renseignements généraux",
            },
            a: {
              tab: { en: "Applicant", fr: "Demandeur" },
              text1: {
                en: "<strong>Primary Applicant</strong>: The primary applicant will be the contact person for the CLSA Access Agreement as well as for the data release and any relevant updates.  The primary applicant must hold an eligible appointment (continuing or term appointment) at an eligible institution (that is able to uphold the conditions of the data access agreement, administer grant funds, and provide Research Ethics Board approval).",
                fr: "<strong>Demandeur principal</strong> : Le demandeur principal sera la personne-ressource pour l’Entente d’accès de l’ÉLCV, ainsi que pour la transmission des données et toute mise à jour pertinente.  Le demandeur principal doit occuper un poste admissible (à titre continu ou pour une durée déterminée) dans un établissement admissible qui est en mesure de respecter les conditions de l’Entente d’accès aux données, d’administrer les fonds de la subvention et de fournir l’approbation du comité d’éthique de la recherche.",
              },
              text2: {
                en: "<strong>Fee Waivers</strong>: Please see below to select the fee waiver.",
                fr: "<strong>Exonération des frais</strong> : Sélectionnez l’exonération des frais ci-dessous.",
              },
              applicant_name: { en: "Name", fr: "Nom" },
              applicant_position: { en: "Position", fr: "Poste" },
              applicant_affiliation: { en: "Institution", fr: "Établissement" },
              applicant_country_id: {
                en: "Institution Country",
                fr: "Pays de l’établissement",
              },
              applicant_address: {
                en: "Mailing Address",
                fr: "Adresse de correspondance",
              },
              applicant_phone: { en: "Phone", fr: "Téléphone" },
              applicant_email: { en: "E-mail", fr: "Courriel" },
              text3: {
                en: "Complete this section if this is a Trainee application (Master’s, PhD and Postdoctoral Fellow).",
                fr: "Remplissez cette section si la demande est pour un étudiant (Maîtrise, Ph. D.) ou un chercheur postdoctoral.",
              },
              trainee_name: { en: "Name", fr: "Nom" },
              trainee_program: {
                en: "Degree and Program of Study",
                fr: "Grade et programme d’étude",
              },
              trainee_institution: {
                en: "Institution of Enrollment",
                fr: "Établissement d’étude",
              },
              trainee_country_id: {
                en: "Institution Country",
                fr: "Pays de l’établissement",
              },
              trainee_address: {
                en: "Current Mailing Address",
                fr: "Adresse de correspondance actuelle",
              },
              trainee_phone: { en: "Phone", fr: "Téléphone" },
              trainee_email: { en: "E-mail", fr: "Courriel" },
              text4: {
                en: "Graduate students (Master’s or PhD) who wish to obtain the CLSA data for the sole purpose of their thesis, and postdoctoral fellows (limit 1 waiver per postdoc) who wish to obtain the CLSA data for the sole purpose of their postdoctoral project who are enrolled at Canadian institutions for their graduate degree or postdoc, can apply for a fee waiver. Canadian trainees working outside Canada but funded through a Canadian source are also eligible for a fee waiver. The CIHR Catalyst Grants for the use of CLSA Data are not eligible for Trainee Fee Waivers.",
                fr: "Les étudiants de deuxième et troisième cycle (Maîtrise ou Ph. D.) et les chercheurs postdoctoraux (limite d’une exonération par post doctorat) qui désirent utiliser les données de l’ÉLCV uniquement pour leur recherche et qui sont inscrits à un établissement canadien peuvent demander une exonération des frais. Les stagiaires canadiens qui travaillent à l’extérieur du Canada, mais qui sont financés par un organisme canadien peuvent également demander une exonération des frais. Les subventions catalyseur pour l’analyse des données de l’ÉLCV ne sont pas admissibles à l’exonération des frais pour les stagiaires.",
              },
              waiver: {
                en: "Fee Waiver Type",
                fr: "Type d’exemption de frais",
              },
            },
            b: {
              tab: { en: "Project Team", fr: "Équipe de projet" },
              text: {
                en: "All Co-Applicants and Other Personnel must be listed below. You must inform your collaborators that you have included them on this application. Please note that changes to the project team, including change of Primary Applicant and addition or removal of Co-Applicants and Support Personnel <strong>require an amendment</strong>. To submit an Amendment request, please click on “Create Amendment” in the upper-right corner of your screen and follow the instructions.",
                fr: "Tous les codemandeurs et les membres du personnel de soutien doivent être identifiés ci-dessous. Vous devez informer vos collaborateurs que vous les avez inclus dans cette demande. Veuillez noter que tout changement à l’équipe de projet y compris un changement de demandeur principal et l’ajout ou le retrait d’un codemandeur ou d’un membre du personnel de soutien <strong>nécessite une modification</strong>. Pour soumettre une demande de modification, veuillez cliquer sur « Créer une modification » dans le coin supérieur droit de votre écran et suivre les instructions.",
              },
              noCoapplicants: {
                en: "No co-applicants have been added.",
                fr: "Aucun codemandeur n’a été ajouté.",
              },
              name: { en: "Name", fr: "Nom" },
              position: { en: "Position", fr: "Poste" },
              affiliation: { en: "Institution", fr: "Établissement" },
              email: { en: "E-mail", fr: "Courriel" },
              role: { en: "Role", fr: "Rôle" },
              access: {
                en: "Requires Access to Data",
                fr: "Doit avoir accès aux données",
              },
              addCoapplicant: {
                en: "Add Co-Applicant",
                fr: "Ajouter codemandeurs",
              },
              coapplicantAgreementText: {
                en: "All Co-Applicants and Support Personnel being added to the project, who will require direct access to the CLSA data, must sign the co-applicant agreement form (download button below) and agree to comply with the conditions outlined in Articles 2.1 and 2.3 of the CLSA Access Agreement.",
                fr: "Tous les codemandeurs et le personnel de soutien ajoutés au projet qui auront besoin d’un accès direct aux données de l’ÉLCV doivent signer le formulaire d’entente de codemandeur (lien de téléchargement ci-dessous) et accepter de se conformer aux conditions énoncées aux articles 2.1 et 2.3 de l’Entente d’accès de l’ÉLCV.",
              },
              coapplicantAgreementButton: {
                en: "Download Co-Applicant Agreement Form Template",
                fr: "Télécharger le modèle de formulaire d’entente de codemandeur",
              },
              coapplicantAgreement: {
                en: "Changes to co-applicants agreement",
                fr: "Modifications à apporter à l’entente de codemandeur",
              },
            },
            c: {
              tab: { en: "Timeline", fr: "Échéancier" },
              text1: {
                en: "What is the anticipated time frame for this proposed project? In planning for your project, please consider in your time frame <strong>at least ",
                fr: "Quel est l’échéancier prévu du projet proposé? Lors de la planification de votre projet, veuillez prévoir <strong>au moins ",
              },
              text2: {
                en: " months from the application submission deadline</strong> to the time you receive your dataset.",
                fr: " mois à compter de la date limite de soumission</strong> de votre candidature pour recevoir votre ensemble de données.",
              },
              text3: {
                en: "Project duration: The length of time you propose to use the CLSA data for analysis. You may choose 2 or 3 years.",
                fr: "Durée du projet : la durée pendant laquelle vous proposez d’utiliser les données de l’ÉLCV à des fins d’analyse. Vous pouvez choisir entre 2 ou 3 ans.",
              },
              text4: {
                en: "Agreement duration: An approved project will have an additional two years beyond the project duration to complete all work, and to disseminate the results in the form of manuscripts or presentations, as noted within the CLSA Access Agreement.",
                fr: "Durée de l’entente : un projet approuvé disposera de deux années supplémentaires au-delà de la durée du projet pour achever tous les travaux et diffuser les résultats sous la forme de manuscrits et de présentations, tel qu’indiqué dans l’entente d’accès aux données de l’ÉLCV.",
              },
              deadline: {
                en: "Application submission deadline",
                fr: "Date limite de soumission",
              },
              start_date: {
                en: "Anticipated start date",
                fr: "Date prévue de début",
              },
              duration: {
                en: "Proposed project duration",
                fr: "Durée proposée du projet",
              },
            },
            d: {
              tab: { en: "Description", fr: "Description" },
              text1: {
                en: "<strong>Provide the level of detail you would normally provide in a grant application. Failure to provide adequate detail to assess feasibility will result in rejection of the application.</strong> Please adhere to character count limits.",
                fr: "<strong>Fournissez autant de détails que vous fourniriez normalement dans une demande de subvention. Si l’information pour évaluer la faisabilité du projet n’est pas assez détaillée, la demande sera rejetée.</strong> Veuillez respecter les limites de caractères.",
              },
              title: { en: "Project Title", fr: "Titre du projet" },
              keywords: { en: "Keywords", fr: "Mots clés" },
              keywords_text: {
                en: "Please provide 3-5 keywords describing your project.",
                fr: "Veuillez fournir 3 à 5 mots clés décrivant votre projet.",
              },
              text2: {
                en: "Please provide a lay language summary of your project (<strong>maximum 1000 characters</strong>) suitable for posting on the CLSA website if your application is approved.",
                fr: "Veuillez fournir un résumé non scientifique de votre projet (<strong>maximum 1000 caractères</strong>) pouvant être publié sur le site Web de l’ÉLCV si votre demande est approuvée.",
              },
              lay_summary: { en: "Lay Summary", fr: "Résumé non scientifique" },
              lay_summary_text: {
                en: "Please provide a lay language summary of your project (<strong>maximum 1000 characters</strong>) suitable for posting on the CLSA website if your application is approved. Please ensure that the lay summary provides a stand-alone, informative description of your project.",
                fr: "Veuillez fournir un résumé non scientifique de votre projet (<strong>maximum 1000 caractères</strong>) pouvant être publié sur le site Web de l’ÉLCV si votre demande est approuvée. Assurez-vous de fournir un résumé détaillé et complet de votre projet.",
              },
              text3: {
                en: "Please provide a description of the proposed project. The proposal should be informative and specific and <strong>no more than 4500 characters per section. Non-compliant applications will be returned.</strong>",
                fr: "Veuillez fournir une description du projet proposé. La proposition doit être informative et précise sans dépasser 4500 caractères par section. Les demandes non conformes seront renvoyées au demandeur.",
              },
              background: {
                en: "Background and Study Relevance",
                fr: "Contexte et pertinence de l’étude",
              },
              objectives: {
                en: "Study Objectives and/or Hypotheses",
                fr: "Objectifs et/ou hypothèses de l’étude",
              },
              methodology: {
                en: "Study Design and Methodology",
                fr: "Modèle d’étude et méthodologie",
              },
              amendment_justification_summary: {
                en: "Amendment Justification Summary",
                fr: "TODO: TRANSLATE",
              },
              methodology_text: {
                en: "The study design and methodology including an overview of the variables and/or biospecimens requested for the project. In no more than half a page, describe the inclusion and exclusion criteria for participants to be included in your study (e.g., age, sex, etc.).",
                fr: "Modèle d’étude et méthodologie comprenant un survol de la liste de variables et/ou échantillons demandés. Sans dépasser une demi-page, décrivez les critères d’inclusion et d’exclusion des participants qui seront inclus dans votre étude (p. ex. âge, sexe, etc.).",
              },
              analysis: { en: "Data Analysis", fr: "Analyse de données" },
              analysis_text: {
                en: "Brief description of the data analysis proposed (this section should include justification for the sample size requested). Requests for small subsets of the study participants must be justified.",
                fr: "Brève description de l’analyse de données proposée (cette section devrait inclure la justification de la taille d’échantillon demandée). Les demandes de petits sous-groupes de participants doivent être justifiées.",
              },
              text4: {
                en: "Please include a list of the most relevant references (maximum ",
                fr: "Veuillez présenter une liste des références les plus pertinentes (maximum ",
              },
              text5: {
                en: ")",
                fr: ")",
              },
              number: { en: "Number", fr: "Numéro" },
              reference: { en: "Reference", fr: "Référence" },
              noReferences: {
                en: "No references have been added.",
                fr: "Aucune référence n’a été ajoutée.",
              },
              addReference: { en: "Add Reference", fr: "Ajouter référence" },
            },
            e: {
              tab: { en: "Scientific Review", fr: "Évaluation scientifique" },
              text: {
                en: 'Evidence of peer reviewed funding will be considered evidence of scientific review. If you have selected "yes, the project received approval for funding", please upload proof of funding notification. If there are no plans to submit an application for financial support for this project, please provide alternate evidence of peer review (e.g., internal departmental review, thesis protocol defense, etc.), if available.',
                fr: "Les preuves de financement accordé après examen par les pairs seront considérées comme preuves d’examen scientifique. Si vous avez sélectionné « Oui, le financement pour le projet a été approuvé », veuillez télécharger l’attestation de financement. Si vous ne prévoyez pas de soumettre une demande de soutien financier pour ce projet, veuillez fournir une autre preuve d’examen par les pairs (par exemple, examen interne du département, défense du protocole de thèse, etc.), si disponible.",
              },
              peer_review: {
                en: "Has the project been scientifically reviewed?",
                fr: "Le projet a-t-il fait l’objet d’un examen scientifique?",
              },
              peer_review_filename: {
                en: "Digital copy of proof of peer review",
                fr: "Copie numérique de la preuve de l’examen par les pairs",
              },
              funding: {
                en: "Has the project received approval for funding?",
                fr: "Le financement pour le projet a-t-il approuvé?",
              },
              funding_agency: {
                en: "Funding agency",
                fr: "L’Organisme de financement",
              },
              grant_number: {
                en: "Grant Number",
                fr: "Numéro de la subvention",
              },
              letter: {
                en: "Digital copy of funding letter",
                fr: "Copie numérique de la lettre de financement",
              },
            },
            f: {
              tab: { en: "Ethics", fr: "Éthique" },
              text: {
                en: "Please note that ethics approval is NOT required at the time of this application, but <strong>no data or biospecimens will be released until proof of ethics approval has been received by the CLSA.</strong>",
                fr: "Notez que l’approbation éthique n’est PAS requise à cette étape de la demande, mais <strong>aucune donnée ou aucun échantillon ne seront transmis avant que l’ÉLCV ait reçu une preuve d’approbation éthique.</strong>",
              },
              approvalListNote: {
                en: "Updated ethics approval documents can be added to your requisition <strong>without the need to create a new amendment</strong>.  Simply click the Add button below to upload the document.",
                fr: "Vous pouvez mettre à jour les documents d’approbation éthique relatifs à votre demande <strong>sans créer un nouvel amendement</strong>. Il suffit de cliquer sur le bouton « Ajouter » ci-dessous pour téléverser le document.",
              },
              ethics: {
                en: "Has this project received ethics approval?",
                fr: "Ce projet a-t-il reçu une approbation éthique?",
              },
              letter: {
                en: "Digital copy of ethics approval letter or proof of exemption",
                fr: "Copie numérique de la lettre d’approbation ou une lettre d’exemption de la part du Comité d’éthique",
              },
              expiration: {
                en: "Expiration date of approval",
                fr: "Date limite d’autorisation",
              },
              response: {
                en: "Expected date of response",
                fr: "Date approximative de la réponse",
              },
            },
          },
          part2: {
            tab: { en: "Part 2", fr: "2<sup>e</sup> partie" },
            title: {
              en: "Part 2 of 3: Data Checklist",
              fr: "Partie 2 de 3 : Sélection des données",
            },
            notes: {
              tab: { en: "Notes", fr: "Remarques" },
              text1: {
                en: "Please mark the sections containing the modules in the CLSA dataset that you are requesting.",
                fr: "Veuillez sélectionner chaque module de l’ensemble de données de l’ÉLCV que vous demandez, et ce, pour chacune des vagues (départ et/ou 1er suivi) de collecte de données qui vous intéresse.",
              },
              text2: {
                en: "<strong>Included in all datasets</strong><ul><li>Sampling weights</li></ul>",
                fr: "<strong>Inclus dans tous les ensembles de données</strong><ul><li>Poids d’échantillonnage</li></ul>",
              },
              text3: {
                en: "<strong>Not included in datasets</strong><ul><li>Identifiable information collected (e.g. name, contact information, date of birth, health insurance number, and full postal code)</li></ul>",
                fr: "<strong>Exclus des ensembles de données</strong><ul><li>Informations d’identification recueillies (p. ex. nom, coordonnées, date de naissance, numéro d’assurance maladie et code postal complet)</li></ul>",
              },
              text4: {
                en: 'For more information on these data, consult the <a href="https://www.clsa-elcv.ca/doc/3162" target="data_availability">CLSA Data Availability Table</a> on our website.',
                fr: 'Pour en savoir plus sur ces données, consultez le <a href="https://www.clsa-elcv.ca/doc/3162" target="data_availability">tableau de disponibilité des données de l’ÉLCV</a> sur notre site Web.',
              },
            },
            cohort: {
              tab: {
                en: "Cohort & Longitudinal Analyses",
                fr: "Analyses de cohorte et longitudinales",
              },
              text1: {
                en: 'Please select the cohort (Tracking and/or Comprehensive - YOU MUST SELECT "YES" FOR AT LEAST ONE COHORT) for which you are requesting data:',
                fr: "Veuillez sélectionner la cohorte (surveillance et/ou globale) pour laquelle vous demandez des données (VOUS DEVEZ SÉLECTIONNER AU MOINS UNE COHORTE) :",
              },
              text2: {
                en: "You will be able to make your selection of the wave of data collection (Baseline and/or Follow-up 1) within the Data Checklist.",
                fr: "Vous pourrez sélectionner la vague de collecte de données (départ et/ou 1er suivi) dans le tableau de sélection de données.",
              },
              tracking: {
                en: "Tracking Cohort (Telephone Interview)",
                fr: "Évaluation de surveillance (Entrevue téléphonique)",
              },
              trackingHelp: {
                en: "Participants providing data through telephone interviews only. No physical assessment data, medications data or biomarker data are available for this cohort. For further information on what data are available for the Tracking Cohort, consult the CLSA Data Availability Table on our website.",
                fr: "Cohorte de surveillance (entrevue téléphonique) : Les participants de cette cohorte fournissent des données uniquement via une entrevue téléphonique. Aucune donnée sur les tests physiques, les médicaments ou les biomarqueurs n’est disponible pour cette cohorte. Pour plus d’informations sur les données disponibles pour la cohorte de surveillance, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.",
              },
              comprehensive: {
                en: "Comprehensive Cohort (In-home Interview & DCS visit)",
                fr: "Évaluation globale (Entrevue à domicile et au site)",
              },
              comprehensiveHelp: {
                en: "Participants providing data through an In-home interview and during a visit to a Data Collection Site. Physical assessment, medications and biomarker data are available for this cohort only. For further information on what data are available for the Tracking Cohort, consult the CLSA Data Availability Table on our website.",
                fr: "Cohorte globale (entrevue à domicile et visite à un Site de collecte de données) : Les participants de cette cohorte fournissent des données via une entrevue à domicile et une visite à un Site de collecte de données. Les tests physiques, les médicaments et les données sur les biomarqueurs sont disponibles pour cette cohorte uniquement. Pour plus d’informations sur les données disponibles pour la cohorte globale, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.",
              },
              bothCohortNotice: {
                en: 'Please be sure to fully explain in "Part 1 - Description" section of your application, how you will use the data from both the Tracking and Comprehensive cohorts in your analyses, accounting for the differences in the data available for each cohort. For further information on what data are available for the Tracking and Comprehensive Cohort, consult the CLSA Data Availability Table on our website.',
                fr: "À la « Partie 1 - Description » de votre demande d’accès, assurez-vous de bien expliquer comment les données des cohortes globale et de surveillance seront utilisées dans vos analyses, en tenant compte des différences entre les données disponibles pour chaque cohorte. Pour plus d’informations sur les données disponibles pour la cohorte de surveillance et la cohorte globale, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.",
              },
              longitudinal: {
                en: "Is this project part of longitudinal or integrative analyses involving previously approved project using CLSA data?",
                fr: "Ce projet fait-il partie d’analyses longitudinales ou intégratives en lien avec un projet utilisant les données de l’ELCV déjà approuvé?",
              },
              last_identifier: {
                en: "Please enter the application number of the related CLSA approved project",
                fr: "Veuillez entrer le numéro de demande du projet connexe approuvé par l’ÉLCV.",
              },
            },
          },
          part3: {
            tab: { en: "Part 3", fr: "3<sup>e</sup> partie" },
            title: {
              en: "Part 3 of 3: Biospecimen Access",
              fr: "Partie 3 de 3 : Accès aux échantillons",
            },
            text: {
              en: "Biospecimen Access is not yet available",
              fr: "Accès aux échantillons n’est pas encore disponible",
            },
          },
          misc: {
            no: { en: "No", fr: "Non" },
            yes: { en: "Yes", fr: "Oui" },
            close: { en: "Close", fr: "Ferme" },
            none: { en: "none", fr: "aucun" },
            add: { en: "Add", fr: "Ajouter" },
            ok: { en: "OK", fr: "OK" },
            cancel: { en: "Cancel", fr: "Annuler" },
            choose: { en: "(choose)", fr: "(choisir)" },
            exempt: { en: "exempt", fr: "exempt(e)" },
            requested: { en: "requested", fr: "demandé" },
            prevButton: {
              en: "Return to the previous section",
              fr: "Retourner à la section précédente",
            },
            nextButton: {
              en: "Proceed to the next section",
              fr: "Passez à la section suivante",
            },
            pleaseConfirm: { en: "Please confirm", fr: "Veuillez confirmer" },
            pleaseNote: { en: "Please Note", fr: "Notez bien" },
            totalCost: { en: "Total fees", fr: "Total des frais" },
            remove: { en: "Remove", fr: "Supprimer" },
            chars: { en: "characters", fr: "caractères" },
            comments: { en: "Comments", fr: "Commentaires" },
            coapplicant: { en: "Co-Applicant", fr: "Codemandeur" },
            delete: { en: "Delete", fr: "Effacer" },
            download: { en: "Download", fr: "Télécharger" },
            application: { en: "Application", fr: "Soumission" },
            dataChecklist: {
              en: "Data Checklist",
              fr: "Sélection des données",
            },
            applicationAndDataChecklist: {
              en: "Application + Data Checklist",
              fr: "Soumission + sélection des données",
            },
            dataSharing: {
              en: "Data Sharing Agreement",
              fr: "Entente de partage de données",
            },
            notices: { en: "Notices", fr: "Notifications" },
            studyData: { en: "Study Data", fr: "Données d’étude" },
            finalReport: { en: "Final Report", fr: "Rapport final" },
            study: {
              clsa: { en: "CLSA", fr: "ÉLCV" },
              covid_19_questionnaire: {
                en: "COVID-19, Questionnaire",
                fr: "COVID-19, questionnaire",
              },
              covid_19_antibody: {
                en: "COVID-19, Antibody",
                fr: "COVID-19, anticorps",
              },
              covid_19_dbs: { en: "COVID-19, DBS", fr: "COVID-19, DBS" },
              covid_19_brain: {
                en: "COVID-19, Brain",
                fr: "COVID-19, cerveau",
              },
            },
            studyPhase: {
              bl: { en: "Baseline", fr: "départ" },
              f1: { en: "Follow-up 1", fr: "1er suivi" },
              f2: { en: "Follow-up 2", fr: "2e suivi" },
              f3: { en: "Follow-up 3", fr: "3e suivi" },
              f4: { en: "Follow-up 4", fr: "4e suivi" },
              f5: { en: "Follow-up 5", fr: "5e suivi" },
              f6: { en: "Follow-up 6", fr: "6e suivi" },
            },
            data_sharing: {
              en: "Completed copy of CANUE Data Use and Sharing via Third Party Agreement",
              fr: "Copie complété de l’Entente de partage et d’utilisation des données via une tierce partie autorisée de CANUE",
            },
            file: { en: "File", fr: "Fichier" },
            expirationDate: { en: "Expiration Date", fr: "Date limite" },
            addEthicsApproval: {
              en: "Add Ethics Approval",
              fr: "Ajouter une lettre d’approbation éthique",
            },
            reportRequiredWarning: {
              en: "This application’s final report is required, would you like to view it now?",
              fr: "Il faut fournir un rapport final pour cette demande, souhaitez-vous l’afficher maintenant?",
            },
            costCombined: {
              en: "A combined fee will be applied for these study-phases when requested at the same time.",
              fr: "Des frais combinés sont exigés pour ces phases d’étude lorsqu’elles sont demandées en même temps.",
            },
            amend: { en: "Create Amendment", fr: "Effectuer une modification" },
            amendWarning: {
              en: "Are you sure you wish to create an amendment?\n\nThe application form will be re-opened and you will be able to make and submit changes.",
              fr: "Êtes-vous sûr de vouloir effectuer une modification? Le formulaire de demande sera rouvert. Vous pourrez alors apporter des modifications et les soumettre.",
            },
            confirmNoReferences: {
              en: "You have not provided any co-applicants to the project team, and you have not provided any references.  Are you sure that you wish to submit the application without this information?\n\nIf not then please click \"No\" so that you may fill in the missing details before submitting.  If you are sure then clicking \"Yes\" will proceed with submitting your application for review.",
              fr: "TODO: TRANSLATE"
            },
            submit: { en: "Submit", fr: "Soumettre" },
            submitTitle: {
              en: "Application Submitted",
              fr: "Demande soumise",
            },
            submitMessage: {
              en: "You have successfully submitted your CLSA Data and Biospecimen Request Application and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV a bien été soumise. Elle sera maintenant évaluée. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            traineeSubmitTitle: {
              en: "Application Submitted for Supervisor Approval",
              fr: "Demande envoyée au superviseur pour approbation",
            },
            traineeSubmitMessage: {
              en: "You have successfully submitted your CLSA Data and Biospecimen Request Application and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons de l’ÉLCV a été soumise avec succès. Votre superviseur recevra une demande d’approbation par courriel. Elle sera maintenant évaluée. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            designateSubmitTitle: {
              en: "Application Submitted for Primary Applicant Approval",
              fr: "Soumission de la demande pour approbation par le demandeur principal",
            },
            designateSubmitMessage: {
              en: "You have successfully submitted the CLSA Data and Biospecimen Request Application on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV a été soumise avec succès au nom du demandeur principal. Celui-ci recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin, puis lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour voir l’état de votre demande. Pour connaître les délais prévus pour la réception de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            resubmitTitle: {
              en: "Application Resubmitted",
              fr: "Demande resoumise",
            },
            resubmitMessage: {
              en: "You have successfully resubmitted your CLSA Data and Biospecimen Request Application. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV a bien été resoumise. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            traineeResubmitTitle: {
              en: "Application Resubmitted for Supervisor Approval",
              fr: "Demande envoyée à nouveau au superviseur pour approbation",
            },
            traineeResubmitMessage: {
              en: "You have successfully resubmitted your CLSA Data and Biospecimen Request Application and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons de l’ÉLCV a été resoumise avec succès. Votre superviseur recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            designateResubmitTitle: {
              en: "Application Resubmitted for Primary Applicant Approval",
              fr: "Nouvelle soumission de la demande pour approbation par le demandeur principal",
            },
            designateResubmitMessage: {
              en: "You have successfully resubmitted the CLSA Data and Biospecimen Request Application on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.",
              fr: "Votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV a été resoumise avec succès au nom du demandeur principal. Celui-ci recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin, puis lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour voir l’état de votre demande. Pour connaître les délais prévus pour la réception de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.",
            },
            submitWarning: {
              en: "Are you sure that all changes are complete and the application is ready to be submitted?",
              fr: "Êtes-vous sûr(e) d’avoir apporté tous les changements souhaités à la demande d’accès et qu’elle est prête à être soumise?",
            },
            missingFieldTitle: {
              en: "Missing mandatory field",
              fr: "Champ obligatoire manquant",
            },
            missingFieldMessage: {
              en: "There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.",
              fr: "Des champs obligatoires sont manquants. Vous serez redirigé vers l’endroit où se trouvent les champs incomplets. Veuillez soumettre la demande d’accès à nouveau quand tous les champs obligatoires auront été remplis.",
            },
            invalidNewApplicantTitle: {
              en: "Invalid applicant",
              fr: "Demandeur incorrect",
            },
            invalidNewApplicantMessage: {
              en: "It is not possible to change the primary applicant to the user you have selected because their role in the system is not that of an applicant.  Please try selecting a different user.",
              fr: "Il n’est pas possible de remplacer le demandeur principal par l’utilisateur que vous avez sélectionné, car cet utilisateur n’a pas le rôle de demandeur. Veuillez essayer de sélectionner un autre utilisateur.",
            },
            invalidStartDateTitle: {
              en: "Invalid start date",
              fr: "Date de début non valide",
            },
            invalidStartDateMessage: {
              en: "The start date you have provided is not acceptable. You will now be redirected to where the start date field can be found. Please try re-submitting once the start date has been corrected.",
              fr: "La date de début indiquée n’est pas acceptable. Vous serez redirigé à l’endroit où se trouve le champ de date de début. Veuillez essayer de soumettre à nouveau une fois la date de début corrigée.",
            },
            noChangesMessage: {
              en: "You have not made any changes to the form since your last submission.  Are you sure you wish to proceed?",
              fr: "Vous n’avez apporté aucune modification au formulaire depuis votre dernière soumission. Êtes-vous sûr(e) de vouloir continuer?",
            },
            deleteWarning: {
              en: "Are you sure you want to delete the application?\n\nThis will permanently destroy all details you have provided. Once this is done there will be no way to restore the application!",
              fr: "Êtes-vous sûr(e) de vouloir supprimer la demande d’accès?\n\nToutes les informations fournies seront détruites et il vous sera impossible de les restaurer!",
            },
            abandon: { en: "Abandon", fr: "Abandonner" },
            abandonWarning: {
              en: "Are you sure you want to abandon the application?\n\nYou will no longer have access to the application and the review process will be discontinued.",
              fr: "Êtes-vous sûr(e) de vouloir abandonner la demande d’accès?\n\nVous n’y aurez plus accès et le processus d’évaluation sera interrompu.",
            },
            abandonAmendmentWarning: {
              en: "Are you sure you want to abandon the amendment?\n\nThe amendment process will be discontinued and your application will be returned back to its previous status.",
              fr: "Êtes-vous sûr de vouloir abandonner la modification? Le processus de modification sera interrompu et votre demande sera renvoyée à son statut précédent.",
            },
            emailText: {
              en: "You must provide an institutional email. Public email accounts such as @gmail.com are not allowed.",
              fr: "Vous devez fournir un courriel institutionnel. Les comptes de messagerie publics tels que @gmail.com ne sont pas autorisés.",
            },
            duration2Years: {
              en: "2 Years",
              fr: "2 ans",
            },
            duration3Years: {
              en: "3 Years",
              fr: "3 années",
            },
            duration2p1Years: {
              en: "2 Years + 1 Additional Year",
              fr: "2 ans + 1 année supplémentaire",
            },
            duration2p2Years: {
              en: "2 Years + 2 Additional Years",
              fr: "2 ans + 2 années supplémentaires",
            },
            duration2p3Years: {
              en: "2 Years + 3 Additional Years",
              fr: "2 ans + 3 années supplémentaires",
            },
            duration3p1Years: {
              en: "3 Years + 1 Additional Year",
              fr: "3 ans + 1 année supplémentaire",
            },
            duration3p2Years: {
              en: "3 Years + 2 Additional Years",
              fr: "3 ans + 2 années supplémentaires",
            },
            duration3p3Years: {
              en: "3 Years + 3 Additional Years",
              fr: "3 ans + 3 années supplémentaires",
            },
            traineeFeeWaiver: {
              en: "Fee waiver for graduate student (Master’s or PhD) for thesis only",
              fr: "Exonération pour un étudiant des cycles supérieurs (Maîtrise ou Ph. D.) pour la thèse seulement",
            },
            postdocFeeWaiver: {
              en: "Fee waiver for postdoctoral fellow (limit 1 waiver for postdoctoral studies)",
              fr: "Exonération pour un boursier postdoctoral (limite d’une exonération pour les études postdoctorales)",
            },
            clinicalFeeWaiver: {
              en: "Clinical fellow with protected time for research (limit 1 waiver)",
              fr: "Chercheur-boursier clinicien avec temps réservé à la recherche (limite 1 exonération)",
            },
            clickToSelect: {
              en: "(click to select)",
              fr: "(cliquez pour sélectionner)",
            },
            dataExpired: {
              en: 'The data for this requisition is no longer available. Please send a request to <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a> in order to re-activate the download link.',
              fr: 'Les données de cette demande ne sont plus disponibles. Veuillez envoyer une demande à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a> afin de réactiver le lien de téléchargement.',
            },
          },
        },
        finalReport: {
          heading: {
            en: "CLSA Approved User Research Final Report",
            fr: "Rapport final de la recherche pour les utilisateurs autorisés par l’ÉLCV",
          },
          instructions: {
            tab: { en: "Instructions", fr: "Consignes" },
            title: {
              en: "Completing the CLSA Approved User Final Report",
              fr: "Remplir le rapport final pour les utilisateurs autorisés de l’ÉLCV",
            },
            text1: {
              en: "The information reported in this report allows the CLSA to assess what progress has been made toward accomplishing the objectives set out in the initial application and the impact of the project towards the advancement of knowledge.",
              fr: "Les informations transmises dans ce rapport permettent à l’ÉLCV d’évaluer les progrès effectués qui mènent à l’atteinte des objectifs définis dans la demande initiale, et de mesurer l’impact du projet sur l’avancement des connaissances.",
            },
            text2: {
              en: "The Final Report must be submitted at the end of the project, 1 year after the Effective Date of the CLSA Access Agreement for projects with a 1-year term and 2 years after the Effective Date of the CLSA Access Agreement for projects with a 2-year term. The Final Report must be submitted within 60 days after the end date of the CLSA Access Agreement.",
              fr: "Le rapport final doit être envoyé à la fin du projet, un an après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée d’un ans ou deux ans après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée de deux ans. Le rapport final doit être soumis dans les 60 jours suivant la fin de l’Entente d’accès de l’ÉLCV.",
            },
            text3: {
              en: "Please ensure that you have completed <strong>all of the sections of the Final Report</strong>. Please attach additional pages if necessary, clearly noting which section your are expanding upon.",
              fr: "Assurez-vous de bien remplir <strong>toutes les sections du rapport</strong>. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.",
            },
            text4: {
              en: 'Consult us for any questions regarding the final report at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez adresser toute question relative au rapport final à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
            },
          },
          part1: {
            tab: { en: "Part 1", fr: "1<sup>re</sup> partie" },
            a: {
              achieved_objectives: {
                en: "Were you able to achieve the objectives stated in the approved application?",
                fr: "TODO: TRANSLATE",
              },
              findings: {
                en: "Please provide a lay summary of the key findings to be posted on the CLSA website (1500 characters).",
                fr: "TODO: TRANSLATE",
              },
              noFindings: {
                en: "Please provide an explanation why the objectives were not achieved (1500 characters).",
                fr: "TODO: TRANSLATE",
              },
            },
            b: {
              question: {
                en: "Graduate thesis details",
                fr: "Informations sur la these",
              },
              text: {
                en: "Since this is a trainee project that has been granted a fee waiver, you must complete the information below. (Any publications must be reported in the next section)",
                fr: "Comme il s’agit d’un projet de stagiaire auquel une exonération des frais a été accordée, vous devez remplir les informations ci-dessous. (Toute publication doit être rapportée à la section suivante)",
              },
              thesis_title: {
                en: "Thesis title (if graduate student trainee)",
                fr: "Titre de la thèse (s’il s’agit d’un étudiant aux cycles supérieurs)",
              },
              thesis_status: {
                en: "Thesis status (Proposal in preparation, thesis in progress, submitted, approved)",
                fr: "État de la thèse (Proposition en cours de préparation, thèse en cours d’écriture, thèse déposée, thèse approuvée)",
              },
            },
          },
          part2: {
            tab: { en: "Part 2", fr: "2<sup>e</sup> partie" },
            question: {
              en: "What has the project produced?",
              fr: "Qu’est-ce que votre projet a produit?",
            },
            text: {
              en: "List any products resulting from the project during the reporting period. Please provide references where available, and for peer-reviewed publications please specify if ‘in press’, ‘submitted’ or ‘published’. If you have not yet done so, please provide a copy of peer-reviewed publications to the CLSA when submitting this report.",
              fr: "Énumérer les produits qui ont été développés dans le cadre de votre projet pendant la période en question. Veuillez fournir les références lorsqu’elles sont disponibles. Pour les articles évalués par des pairs, veuillez spécifier s’ils sont « sous presse », « soumis » ou « publiés ». Si ce n’est pas déjà fait, veuillez fournir une copie des articles évalués par des pairs à l’ÉLCV en soumettant ce rapport.",
            },
            addOutput: { en: "Add Output", fr: "Ajouter une réalisation" },
          },
          part3: {
            tab: { en: "Part 3", fr: "3<sup>e</sup> partie" },
            a: {
              question: {
                en: "What is the impact of the project?",
                fr: "Quel est l’impact du projet?",
              },
              text: {
                en: "Describe distinctive contributions, major accomplishments, innovations, successes, or any change in practice or behavior that has come about as a result of the project.",
                fr: "Décrivez les contributions marquantes, les réalisations, innovations, succès importants ou les changements dans la pratique ou les comportements qui ont émergé des conclusions de votre projet.",
              },
            },
            b: {
              question: {
                en: "What opportunities for training and professional development has the project provided?",
                fr: "Quelles occasions de formation et de perfectionnement professionnel votre projet a-t-il offert?",
              },
              text: {
                en: "List any opportunities for training (i.e. student research assistants) and professional development (i.e. HQP development opportunities, lectures, courses) that the project has provided.",
                fr: "Énumérez toutes les occasions de formation et de perfectionnement professionnel que votre projet a offertes.",
              },
            },
            c: {
              question: {
                en: "How have the results been disseminated to communities of interest?",
                fr: "Comment avez-vous diffusé les résultats aux groupes d’intérêt?",
              },
              text: {
                en: "Describe any knowledge translation and outreach activities that have been undertaken.",
                fr: "Décrivez toutes les activités d’application des connaissances et de sensibilisation qui ont été réalisées.",
              },
            },
          },
          misc: {
            no: { en: "No", fr: "Non" },
            yes: { en: "Yes", fr: "Oui" },
            close: { en: "Close", fr: "Ferme" },
            choose: { en: "(choose)", fr: "(choisir)" },
            remove: { en: "Remove", fr: "Supprimer" },
            prevButton: {
              en: "Return to the previous section",
              fr: "Retourner à la section précédente",
            },
            nextButton: {
              en: "Proceed to the next section",
              fr: "Passez à la section suivante",
            },
            download: { en: "Download", fr: "Télécharger" },
            application: { en: "Application", fr: "Soumission" },
            submit: { en: "Submit", fr: "Soumettre" },
            finalReport: { en: "Final Report", fr: "Rapport final" },
            pleaseConfirm: { en: "Please confirm", fr: "Veuillez confirmer" },
            submitTitle: {
              en: "Final Report Submitted",
              fr: "Rapport final soumise",
            },
            submitMessage: {
              en: "You have successfully submitted your Final Report and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été soumis avec succès. Il sera maintenant examiné. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            traineeSubmitTitle: {
              en: "Final Report Submitted for Supervisor Approval",
              fr: "Rapport final soumis au superviseur pour approbation",
            },
            traineeSubmitMessage: {
              en: "You have successfully submitted your Final Report and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été soumis avec succès. Votre superviseur recevra un courriel lui demandant son approbation. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            designateSubmitTitle: {
              en: "Final Report Submitted for Primary Applicant Approval",
              fr: "Soumission du rapport final pour approbation par le demandeur principal",
            },
            designateSubmitMessage: {
              en: "You have successfully submitted the Final Report on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été soumis avec succès au nom du demandeur principal. Celui-ci recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin, puis lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            resubmitTitle: {
              en: "Final Report Resubmitted",
              fr: "Rapport final resoumise",
            },
            resubmitMessage: {
              en: "You have successfully resubmitted your Final Report. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application.",
              fr: "Votre rapport final a été resoumis avec succès. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour voir l’état de votre demande.",
            },
            traineeResubmitTitle: {
              en: "Final Report Resubmitted for Supervisor Approval",
              fr: "Rapport final envoyée à nouveau au superviseur pour approbation",
            },
            traineeResubmitMessage: {
              en: "You have successfully resubmitted your Final Report and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été resoumis avec succès. Votre superviseur recevra un courriel lui demandant son approbation. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            designateResubmitTitle: {
              en: "Final Report Resubmitted for Primary Applicant Approval",
              fr: "Nouvelle soumission du rapport final pour approbation par le demandeur principal",
            },
            designateResubmitMessage: {
              en: "You have successfully resubmitted the Final Report on behalf of the primary applicant and they will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.",
              fr: "Votre rapport final a été resoumis avec succès au nom du demandeur principal. Celui-ci recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin, puis lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.",
            },
            submitWarning: {
              en: "Are you sure that all changes are complete and the report is ready to be submitted?",
              fr: "Êtes-vous sûr d’avoir apporté toutes les modifications souhaitées et de vouloir soumettre le rapport?",
            },
            missingFieldTitle: {
              en: "Missing mandatory field",
              fr: "Champ obligatoire manquant",
            },
            missingFieldMessage: {
              en: "There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.",
              fr: "Des champs obligatoires sont manquants. Vous allez maintenant être redirigé vers les champs incomplets. Veuillez réessayer lorsque tous les champs obligatoires auront été remplis.",
            },
            noChangesMessage: {
              en: "You have not made any changes to the report since your last submission.  Are you sure you wish to proceed?",
              fr: "Vous n’avez apporté aucune modification au rapport depuis votre dernière soumission. Êtes-vous sûr de vouloir continuer?",
            },
          },
        },
        output: {
          add: { en: "Add", fr: "Ajouter" },
          output_type: { en: "Output Type", fr: "Type de réalisation" },
          detail: { en: "Details", fr: "Informations" },
          filename: { en: "Attachment", fr: "Pièce jointe" },
          url: { en: "URL", fr: "URL" },
          addOutputSource: { en: "Add Source", fr: "Ajouter une source" },
          outputSourceListHeading: {
            en: "Source List",
            fr: "Liste des sources",
          },
          output_source_count: { en: "Sources", fr: "Sources" },
          createOutput: { en: "Create Output", fr: "Créer une réalisation" },
          createOutputSource: {
            en: "Create Output Source",
            fr: "Créer une source pour une réalisation",
          },
          viewFinalReport: {
            en: "View Final Report",
            fr: "Afficher le rapport final",
          },
          viewOutput: { en: "View Output", fr: "Afficher la réalisation" },
          outputDetails: {
            en: "Output Details",
            fr: "Informations sur la réalisation",
          },
          outputSourceDetails: {
            en: "Output Source Details",
            fr: "Informations sur la source de la réalisation",
          },
          save: { en: "Save", fr: "Sauvegarder" },
          cancel: { en: "Cancel", fr: "Annuler" },
          delete: { en: "Delete", fr: "Effacer" },
          choose: { en: "(choose)", fr: "(choisir)" },
          newOutputSourceTitle: { en: "Please Note", fr: "Notez bien" },
          newOutputSourceMessage: {
            en: "You must provide either a file or URL",
            fr: "Vous devez fournir un fichier ou une URL",
          },
        },
      },
    };

    async function init(obj) {
      // fill in dynamic content
      obj.promise = CnHttpFactory.instance({
        path: "data_category",
        data: {
          select: { column: ["name_en", "name_fr"] },
          modifier: { order: "rank", limit: 1000 },
        },
      }).query();

      var response = await obj.promise;
      var letter = "a";
      response.data.forEach((category) => {
        obj.lookupData.reqn.part2[letter] = {
          tab: { en: category.name_en, fr: category.name_fr },
        };
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      });
    }

    init(object);

    return object;
  },
]);
