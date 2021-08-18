export default function inputDescriptionBuilder(selectedSchemaFields:string[], fullObject:Object):Object{
  let inputDescriptor: Object = {}
  for (let value of selectedSchemaFields){
    //NOTE: for the next refactor...use str.split and NOT REGEXS YOU WILL NEVER GET THAT TIME BACK
    const reIndex:RegExp = /(?<=\.)(\w*?)(?=\.)/gi 
    const rePayload:RegExp = /(?!\w*\.)(?<=\.)(.*)/gi
    value = value.replace('$.credentialSubject','')
    let regexIndexPayload:string | Object
    let regexIndexValue:string

    if(/(?<=\.)(\w*?)(?=\.)/gi.test(value)){
      //$.xxx.key.value format
      regexIndexValue = reIndex.exec(value)[0]
      regexIndexPayload = rePayload.exec(value)[0]

      //building the json object
      if (regexIndexValue in inputDescriptor){
        //the key exists in the object
        inputDescriptor[`${regexIndexValue}`][`${regexIndexPayload}`] = {} 

      } else {
        //the key doesn't exist
        // TODO: good improvement is to make it recursive (for deeper levels)
        inputDescriptor[`${regexIndexValue}`] = {}
        inputDescriptor[`${regexIndexValue}`][`${regexIndexPayload}`] = {}
        // grab the type

        inputDescriptor[`${regexIndexValue}`]["type"] = [fullObject['data']['credentialSubject'][`${regexIndexValue}`]["type"]]


        
      }
    } else {
      //$.xxx.key format
      regexIndexValue = value.slice(1)
      inputDescriptor[`${regexIndexValue}`] = {}
    }
  }
  inputDescriptor["type"] = [fullObject['data']['credentialSubject']["type"]]
  inputDescriptor["@explicit"] = true
  //key credentialSubject 
  //grab context and type from credential
  return inputDescriptor
}
