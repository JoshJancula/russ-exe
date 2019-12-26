export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',
  isMobileApp: false,
  isElectron: true,
  enableTestData: true,

  defaultTableData: [
    { name: 'head', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'neck', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'anteriorTrunk', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'posteriorTrunk', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightButtock', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftButtock', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'genetalia', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'rightUpperArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftUpperArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null , hasError: false},
    { name: 'rightLowerArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false },
    { name: 'leftLowerArm', secondDegree: null, thirdDegree: null, fourthDegree: null, total: null, hasError: false},
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
    acctNo: 'A1234567889null',
    patientAge: '56',
    birthDate: 'null4/25/1963',
    patientSex: 'M',
    admitDate: '9/19/2019'
},

 defaultDataObject: {
  tableData: [],
  formType: 'burn',
  burnType: 'friction',
  skinType: null,
  createdBy: 'Frank Reynolds',
  dateOfInjury: '9/19/2019',
  timeOfInjury: '18:24',
  amendmentHistory: []
},

 defaultUserData: {
  userName: 'Frank Reynolds',
  userEsig: 'squanchy',
  userId: 'squanchy'
}

};
