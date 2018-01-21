//Push Notification to user when daily views hits 10, 50, 100, 300, 1000 views
//By clicking notification -> Should open user page
//"You have X Views Today"
const RequestNotification = ('PushNotificationRequest');
const dbProvider = require('../config/db');

//Trigger When data is > 10,50,100,300,1000 views
//Refer to Database Schema

//Find TokenID of User that is to Receive Notification
exports.findTokenID = function(userID, ViewCount, done){

  var TokenIDs = dbProvider.get().query( 'SELECT device_token FROM tb_users WHERE id = userID' , [userID], (err, rows) => {
                  if(err) throw err;
                  done(rows);
                });

  var message = "You Have " + ViewCount + " Views Today!";
  RequestNotification.SendNotifications(Tokens, message);
}
