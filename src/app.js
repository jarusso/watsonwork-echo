// A sample chatbot app that listens to messages posted to a space in IBM
// Watson Workspace and echoes hello messages back to the space

import express from 'express';
import * as request from 'request';
import * as util from 'util';
import * as bparser from 'body-parser';
import { createHmac } from 'crypto';
import * as http from 'http';
import * as https from 'https';
import * as oauth from './oauth';
import * as ssl from './ssl';
import debug from 'debug';

// Debug log
const log = debug('watsonwork-echo-app');

// Echoes Watson Work chat messages containing 'hello' or 'hey' back
// to the space they were sent to
export const echo = (appId, token) => (req, res) => {
  // Respond to the Webhook right away, as the response message will
  // be sent asynchronously
  res.status(201).end();

  // Only handle message-created Webhook events, and ignore the app's
  // own messages
  //if(req.body.type !== 'message-created' || req.body.userId === appId)
  //  return;
  log('######## USER ID: ' + req.body.userId + ' APP ID: ' + appId + '#######');	 	
  if(req.body.userId === appId)
  {
    log('ignoring since this message came from us ' + appId);	  
    return;
  }

  if ( req.body.type == 'message-created' || req.body.type == 'message-annotation-added')
  {
	  log('received ' + req.body.type);	

  	if ( req.body.type == 'message-created')
  	{
	  log('Got a message %o', req.body);

	  // React to 'hello' or 'hey' keywords in the message and send an echo
	  // message back to the conversation in the originating space
	  if(req.body.content
	    // Tokenize the message text into individual words
	    .split(/[^A-Za-z0-9]+/)
	    // Look for the hello and hey words
	    .filter((word) => /^(hello|hey)$/i.test(word)).length)
	
	    // Send the echo message
	    send(req.body.spaceId,
	      util.format(
	        'Hey %s, did you say %s?',
	        req.body.userName, req.body.content),
	      token(),
	      (err, res) => {
	        if(!err)
	          log('Sent message to space %s', req.body.spaceId);
	      });
	
	  if(req.body.content
	    // Tokenize the message text into individual words
	    .split(/[^A-Za-z0-9]+/)
	    // Look for the hello and hey words
	    .filter((word) => /^(shit|ass|fuck)$/i.test(word)).length)
	
	    // Send the echo message
	    send(req.body.spaceId,
	      util.format(
	        'Hey %s, did you say %s? Enough with the swearing!',
	        req.body.userName, req.body.content),
	      token(),
	      (err, res) => {
	        if(!err)
	          log('Sent message to space %s', req.body.spaceId);
	      });
	}
	else
	{
	    const accessToken = req.body.access_token;
	    const GraphQLOptions = {
			"url": `api.watsonwork.ibm.com/graphql`,
			"headers": {
			    "Content-Type": "application/graphql",
			    "x-graphql-view": "PUBLIC",
			    "jwt": "${jwt}"
			},
			"method": "POST",
			"body": ""
		    };

	    GraphQLOptions.headers.jwt = accessToken;
	    var annotationType = req.body.annotationType;
	    var annotationPayload = JSON.parse(req.body.annotationPayload);
	    var messageId = annotationPayload.messageId;
   	    var memberId;	
	    GraphQLOptions.body = "{ message (id: \"" + messageId + "\") {createdBy { displayName id}}}";
	    
	    request(GraphQLOptions, function(err, response, graphqlbody) {
		      if (!err && response.statusCode === 200) {
			  const bodyParsed = JSON.parse(graphqlbody);
			  var person = bodyParsed.data.message.createdBy;
			  memberId = person.id;
		      } else {
			  console.log("ERROR: Can't retrieve " + GraphQLOptions.body + " status:" + response.statusCode);
			  return;
		      }
		
		 if (memberId !== APP_ID)
		{
		
		log('Got an annotation %o', req.body);
    		//var jsonBody = JSON.parse(req.body);
		//log('Parsed %o', jsonBody);
    		//var annotationType = req.body.annotationType;
		log('Type --> ', annotationType);

		
		//var annotationPayload = JSON.parse(req.body.annotationPayload);
		//var payload = req.body.annotationPayload;
		
		log('Payload --> ', annotationPayload);
		
		    if ( annotationType == "message-nlp-docSentiment")
		    {
			    log('sentiment ');
			    var docSentiment = annotationPayload.docSentiment;
			    log('docSentiment --> ', docSentiment.type);
				  send(req.body.spaceId,
					util.format(
				'type: ' + annotationType + ' watson sez this sounds : ' + docSentiment.type + ' confidence: ' + docSentiment.score.toString(),
				req.body.userName, req.body.content),
			      token(),
			      (err, res) => {
				if(!err)
				  log('Sent message to space %s', req.body.spaceId);
			      });
		      }

/*		    if ( annotationType == "message-focus")
		    {
			    var lens = payload.lens;
				  send(req.body.spaceId,
					util.format(
				'type: ' + annotationType + ' watson sez this looks like a : ' + lens + ' confidence: ' + lens.score.toString(),
				req.body.userName, req.body.content),
			      token(),
			      (err, res) => {
				if(!err)
				  log('Sent message to space %s', req.body.spaceId);
			      });
		      }
*/
		}
		else
		{
			log('not processing annotation because it is from our own message ');	
		}		
	    });
	}
};

// 
 const request(authenticationOptions, function(err, response, authenticationBody) {

    // If successful authentication, a 200 response code is returned
    if (response.statusCode !== 200) {
        // if our app can't authenticate then it must have been disabled.  Just return
        console.log("ERROR: App can't authenticate");
        return;
    }
	 
// Send an app message to the conversation in a space
const send = (spaceId, text, tok, cb) => {
  request.post(
    'https://api.watsonwork.ibm.com/v1/spaces/' + spaceId + '/messages', {
      headers: {
        Authorization: 'Bearer ' + tok
      },
      json: true,
      // An App message can specify a color, a title, markdown text and
      // an 'actor' useful to show where the message is coming from
      body: {
        type: 'appMessage',
        version: 1.0,
        annotations: [{
          type: 'generic',
          version: 1.0,

          color: '#6CB7FB',
          title: 'Echo message',
          text: text,

          actor: {
            name: 'from sample echo app',
            avatar: 'https://avatars1.githubusercontent.com/u/22985179',
            url: 'https://github.com/watsonwork/watsonwork-echo'
          }
        }]
      }
    }, (err, res) => {
      if(err || res.statusCode !== 201) {
        log('Error sending message %o', err || res.statusCode);
        cb(err || new Error(res.statusCode));
        return;
      }
      log('Send result %d, %o', res.statusCode, res.body);
      cb(null, res.body);
    });
};

// Verify Watson Work request signature
export const verify = (wsecret) => (req, res, buf, encoding) => {
  if(req.get('X-OUTBOUND-TOKEN') !==
    createHmac('sha256', wsecret).update(buf).digest('hex')) {
    log('Invalid request signature');
    const err = new Error('Invalid request signature');
    err.status = 401;
    throw err;
  }
};

// Handle Watson Work Webhook challenge requests
export const challenge = (wsecret) => (req, res, next) => {
  if(req.body.type === 'verification') {
    log('Got Webhook verification challenge %o', req.body);
    const body = JSON.stringify({
      response: req.body.challenge
    });
    res.set('X-OUTBOUND-TOKEN',
      createHmac('sha256', wsecret).update(body).digest('hex'));
    res.type('json').send(body);
    return;
  }
  next();
};

// Create Express Web app
export const webapp = (appId, secret, wsecret, cb) => {
  // Authenticate the app and get an OAuth token
  oauth.run(appId, secret, (err, token) => {
    if(err) {
      cb(err);
      return;
    }

    // Return the Express Web app
    cb(null, express()

      // Configure Express route for the app Webhook
      .post('/echo',

        // Verify Watson Work request signature and parse request body
        bparser.json({
          type: '*/*',
          verify: verify(wsecret)
        }),

        // Handle Watson Work Webhook challenge requests
        challenge(wsecret),

        // Handle Watson Work messages
        echo(appId, token)));
  });
};

// App main entry point
const main = (argv, env, cb) => {
  // Create Express Web app
  webapp(
    env.ECHO_APP_ID, env.ECHO_APP_SECRET,
    env.ECHO_WEBHOOK_SECRET, (err, app) => {
      if(err) {
        cb(err);
        return;
      }

      if(env.PORT) {
        // In a hosting environment like Bluemix for example, HTTPS is
        // handled by a reverse proxy in front of the app, just listen
        // on the configured HTTP port
        log('HTTP server listening on port %d', env.PORT);
        http.createServer(app).listen(env.PORT, cb);
      }

      else
        // Listen on the configured HTTPS port, default to 443
        ssl.conf(env, (err, conf) => {
          if(err) {
            cb(err);
            return;
          }
          const port = env.SSLPORT || 443;
          log('HTTPS server listening on port %d', port);
          https.createServer(conf, app).listen(port, cb);
        });
    });
};

if (require.main === module)
  main(process.argv, process.env, (err) => {
    if(err) {
      console.log('Error starting app:', err);
      return;
    }
    log('App started');
  });
