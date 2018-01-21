//import React from 'react';
//
// export async function Connect(dataType ){
//
//          try {
//              let url = "http://localhost/";
//              switch (dataType) {
//                  case "name" : url = 'http://localhost/';
//                  case "friends" : url = 'http://localhost/';
//              }
//              let request = new Request({
//                  method: 'GET',
//                  headers: {
//                      'Accept': 'application/json'
//                  }
//              });
//              let  response = await fetch(url, request);
//              let responseJson = await response.json();
//              return responseJson;
//          } catch(error) {
//              console.error(error);
//          }
//        }
//
//
//
//
//
//
//
