

let WHITELIST_IP_ADDRESSES: Array<string>= [];
if (process.env.REACT_APP_DEV_ENV === "production") {
  WHITELIST_IP_ADDRESSES = [];
} else if (process.env.REACT_APP_DEV_ENV === "labs") {
  WHITELIST_IP_ADDRESSES = [
    "0x3AE561b6Cd1134Ae45f387102Fe32529b84Cf94A",
    "0xf384cB884B647C24A5D33E949d993E0502e66A92",
    "0x60776036F69363220F566466252e22961e8bEf7d",
    "0x7960635982F8800ce8A9D70A9005B9b9b71e0F56",
    "0xf32eb17D418AF0947EAB1a417485dFA60DcD1742",
    "0xc12f60C5F63b75850a549eFB01b8ab497ca03790",
    "0x93d11B358c6b62525a1f7c4649ed4A7a0929b604",
    "0xD2ee70eb384F0c227a8Da21487396067b167838A",
    "0x04A0e39Ee1dEDC4AF7240144151c4EA895310528",
    "0xDceDD1900D8407447d624b4106A253C9a5f7d831", //  my windows.. 
  ]
} else if (process.env.REACT_APP_DEV_ENV === "development") {
  // WHITELIST_IP_ADDRESSES = [
  //   "0x3AE561b6Cd1134Ae45f387102Fe32529b84Cf94A",
  //   "0xf384cB884B647C24A5D33E949d993E0502e66A92",
  //   "0x60776036F69363220F566466252e22961e8bEf7d",
  //   "0x7960635982F8800ce8A9D70A9005B9b9b71e0F56",
  // ]

  WHITELIST_IP_ADDRESSES = [
    "0x3AE561b6Cd1134Ae45f387102Fe32529b84Cf94A",
    "0xf384cB884B647C24A5D33E949d993E0502e66A92",
    "0x60776036F69363220F566466252e22961e8bEf7d",
    "0x7960635982F8800ce8A9D70A9005B9b9b71e0F56",
    "0xf32eb17D418AF0947EAB1a417485dFA60DcD1742",
    "0xc12f60C5F63b75850a549eFB01b8ab497ca03790",
    "0x93d11B358c6b62525a1f7c4649ed4A7a0929b604",
    "0xD2ee70eb384F0c227a8Da21487396067b167838A",
    "0x04A0e39Ee1dEDC4AF7240144151c4EA895310528",
    "0xDceDD1900D8407447d624b4106A253C9a5f7d831", //  my windows.. 
    "0x57096755A53577a1E47A9F5c1D86d4Cf76e9Dd10", // lokendra

    "0x8F52CE2c16FE47E5E1f94990dB3dcc9F62bbC813",
    "0xc12f60C5F63b75850a549eFB01b8ab497ca03790",
    "0x57096755A53577a1E47A9F5c1D86d4Cf76e9Dd10",
    "0xE4503D48FD4CB3f30Ff9fb46f198D8A5F6F964BF",
    "0xc341e0fd548298de89b38fe31f2ac63457105451",
    "0x7960635982F8800ce8A9D70A9005B9b9b71e0F56",
  ]
} else {
  WHITELIST_IP_ADDRESSES = [
    // "0x3AE561b6Cd1134Ae45f387102Fe32529b84Cf94A",
    // "0xf384cB884B647C24A5D33E949d993E0502e66A92",
    // "0x60776036F69363220F566466252e22961e8bEf7d"
  ]
}

export {WHITELIST_IP_ADDRESSES};



// DEV
// export const WHITELIST_IP_ADDRESSES = [
//   "0x3AE561b6Cd1134Ae45f387102Fe32529b84Cf94A",
//   "0xf384cB884B647C24A5D33E949d993E0502e66A92",
//   "0x60776036F69363220F566466252e22961e8bEf7d"
//   // "0x1192772a938a0f2FCBF748a3E9d66f58EFA0863b"
// ]

// // LAB TECHS
// export const WHITELIST_IP_ADDRESSES = [
//   "0x3AE561b6Cd1134Ae45f387102Fe32529b84Cf94A",
//   "0xf384cB884B647C24A5D33E949d993E0502e66A92",
//   // "0x1192772a938a0f2FCBF748a3E9d66f58EFA0863b"
// ]
