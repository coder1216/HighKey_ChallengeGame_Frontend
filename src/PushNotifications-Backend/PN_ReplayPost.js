//Push Notification -> To User when someone replays his post
//_nickName_ replayed your content
const RequestNotification = ('PushNotificationRequest');
const dbProvider = require('../config/db');

//Find TokenID of User that is to Receive Notification
//Not Implemented Yet: replay_amount in tb_post table
//replayPostID => ID in tb_post table
exports.findTokenIDUser = function(replayPostID, done){
  var userID;
  var tokenIDs;
  var userReplayerID;
  dbProvider.get().query(
    'SELECT tb_users.id, tb_users.device_token, tb_post.replayer_id FROM tb_post INNER JOIN tb_users ON tb_post.user_id = tb_users.id WHERE tb_post.id = replayPostID LIMIT 1',
    [replayPostID], (err, rows) => {
      if(err) throw err;
      userID = rows.id;
      tokenIDs = [rows.device_token];
      userReplayerID = rows.replayer_id;
      done(rows);
    }
  );

  var replayerUserName;
  dbProvider.get().query('SELECT * FROM tb_users WHERE userReplayerID = id LIMIT 1', [userReplayerID], (err, rows) => {
      if(err) throw err;
      replayerUserName = rows.username;
      done(rows);
  });

  //Need to Decide how the post will be replied to
  var message = replayUserName + "Replayed Your Content";
  RequestNotification.sendNotifications(tokenIDs, message);
}
