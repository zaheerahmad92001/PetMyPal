const getAccessToken=async()=> {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }
  export {
      getAccessToken
  }