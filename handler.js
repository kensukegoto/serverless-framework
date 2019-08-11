'use strict';

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-1', apiVersion: '2012-08-10'});

module.exports.hello = async (event, context, callback) => {

if (isNaN(event.id)) {
    return {
      users: [],
      error: "Invalid Value"
  };
}

const id = +event.id;

  let thisPullParams = {
    TableName: 'service-mmdd',
    KeyConditionExpression : "#k = :val", // keyとvalueが一致するものを取得する
    ExpressionAttributeNames  : {"#k" : "id"}, // idをキーにセット
    ExpressionAttributeValues : {":val" : id}, // 1をvalueにセット
};

let data = {
  users: [],
  error: ""
};

let users = null;

try{

  users = await dynamo.query(thisPullParams,(err,data)=>{

    if(err){
      console.log(err);
    }else{
      console.log(data);
    }

  }).promise();

}catch(err){
  
  data.error = err.code;
  // usersはエラーオブジェクトとなる
  // エラーオブジェクトを只の空オブジェクトに
  users = {}; 
}

  if(users.Items) data.users = users.Items;

  return data;
};
