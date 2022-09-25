import requests from './requestRoutes.json'
const BaseURL = 'http://192.168.40.11/itmarket247'

export function requestHandler(type, reqData
  //,auth
  ) {

  let { req, route } = setupRequest(type, reqData
    //, auth
    )
  return new Promise((resolve, reject) => {
    fetch(BaseURL + route, req)
      .then(response => {
        return response.json()
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function setupRequest(type, reqData
  ) {
  let req = null
  let route = null

  if (requests[type].method === 'GET') {
    req = {
      method: 'GET',
      //headers: { ...auth },
    }
    route = requests[type].route + new URLSearchParams({ ...reqData }).toString()
  } else if (requests[type].method === 'POST') {
    req = {
      method: 'POST',
      headers: {
        //...auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...reqData })
    }
    route = requests[type].route
  }

  return { req, route }
}