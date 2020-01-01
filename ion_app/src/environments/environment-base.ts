export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',
  isMobileApp: false,
  isElectron: true,
  useIpcForApi: true,
  enableTestData: true,
  persistRedux: false,
  onlyAddValidRowsToPDF: true,

  defaultTableData: [
    { name: 'head', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'neck', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'anteriorTrunk', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'posteriorTrunk', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightButtock', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftButtock', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'genetalia', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightUpperArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftUpperArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightLowerArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftLowerArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightHand', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftHand', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightThigh', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftThigh', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightLeg', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftLeg', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightFoot', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftFoot', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false }
  ],

  defaultPatientInfo: {
    patientName: 'Russ Lane',
    medRecno: 'M12345678',
    acctNo: 'A12345678890',
    patientAge: '56',
    birthDate: '04/25/1963',
    patientSex: 'M',
    admitDate: '9/19/2019'
  },

  defaultDataObject: {
    tableData: [],
    formType: 'burn',
    burnType: null,
    skinType: null,
    createdBy: null,
    dateOfInjury: null,
    timeOfInjury: null,
    amendmentHistory: []
  },

  dummyDataObject: {
    tableData: [],
    formType: 'burn',
    burnType: 'friction',
    skinType: null,
    createdBy: 'Frank Reynolds',
    dateOfInjury: '09/19/2019',
    timeOfInjury: '18:24',
    amendmentHistory: []
  },

  defaultUserData: {
    userName: 'Frank Reynolds',
    userEsig: 'squanchy',
    userId: 'squanchy'
  },

  fakeImageData: [
    {
      wound_no: 'Wound-4',
      wound_desc: 'PI; Medial; Forearm; Left; POA = ?; ',
      wound_dos: '04/03/2019',
      src: 'https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019062018142500992012_07F4EBFE;jpg'
    },
    {
      wound_no: 'Wound-1',
      wound_desc: 'PI; Plantar; Finger; 2nd left; POA = ?; ',
      wound_dos: '04/22/2019',
      src: 'https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019052217245303388001_C7864049;jpg'
    },
    {
      wound_no: 'Wound-5',
      wound_desc: 'PI; Anterior; Arm Lower; Left; POA = ?; ',
      wound_dos: '09/10/2019',
      src: 'https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019091018100801184004_2A635C72;jpg'
    },
    {
      wound_no: 'Wound-11',
      wound_desc: 'PI; Inferior; Forearm; Right; POA = ?; ',
      wound_dos: '09/18/2019',
      src: 'https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019101422241500592000_54D956AB;jpg'
    },
    {
      wound_no: 'Wound-9',
      wound_desc: 'PI; Anterior; Arm Lower; Right; POA = ?; ',
      wound_dos: '09/20/2019',
      src: 'https://pixmobile.eastus.cloudapp.azure.com/HealthEPixMobileWeb/GetImage.aspx?h=localhost:3002&k=6181888a-0285-4a7a-ba8e-901c936280c0:2019092712394000892006_7CB1F16E;jpg'
    }
  ]

};
