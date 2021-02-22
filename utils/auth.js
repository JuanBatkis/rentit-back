exports.clearRes = (data) => {
  // create a new copy  
  const newData= ({...data}._doc); 

  //We deconstruct the data object and return a new object with only the required fields
  const {password, __v, createdAt, updatedAt, ...cleanedData} = newData;

  return cleanedData;
}