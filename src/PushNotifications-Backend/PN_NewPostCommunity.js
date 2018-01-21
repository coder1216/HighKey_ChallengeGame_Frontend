//To Admin and Members Whenever a new post is added to community after 48 silent hours
//(By clicking notification -> Open App and and start previewing information  (Latest -> Oldest))
const RequestNotification = ('PushNotificationRequest');
const dbProvider = require('../config/db');

//Find TokenID of Users that are to Receive Notification
exports.findTokenIDsAdminMembers = function(userID, done){
  var tokenIDs = dbProvider.get().query(
    'SELECT device_token FROM tb_users WHERE id IN (SELECT user_id FROM tb_community)',
                  [userID], (err, rows) => {
                    if(err) throw err;
                    done(rows);
                });
  var userName = dbProvider.get().query('SELECT username FROM tb_users WHERE id = userID', [userID], (err, rows) => {
                  if(err) throw err;
                  done(rows);
                });

  //User and whom they posted to
  var message = userName + "Lighted Spot Again";
  RequestNotification.SendNotifications(tokenIDs, message);
}
