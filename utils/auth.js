exports.clearRes = (data) => {
  // create a new copy  
  const newData= ({...data}._doc); 

  //We deconstruct the data object and return a new object with only the required fields
  const {password, __v, createdAt, updatedAt, ...cleanedData} = newData;

  return cleanedData;
}

exports.getMissingMessage = (missingFields) => {
  if (missingFields.length === 1) {
    return `Please indicate your ${missingFields[0]}`
  } else if(missingFields.length > 1) {
    let fullError = missingFields[0]
    for (let i = 1; i < missingFields.length; i++) {
      i === (missingFields.length - 1) ? fullError += ` and ${missingFields[i]}` : fullError += `, ${missingFields[i]}`
    }
    return `Please indicate your ${fullError}`
  }

  return false
}