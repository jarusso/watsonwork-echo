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
  if(req.body.type !== 'message-created' || req.body.userId === appId)
    return;

  log('Got a message %o', req.body);

  // React to 'hello' or 'hey' keywords in the message and send an echo
  // message back to the conversation in the originating space
  if(req.body.content
    // Tokenize the message text into individual words
    .split(/[^A-Za-z0-9]+/)
    // Look for the hello and hey words
    .filter((word) => /^(hello|hey|yo)$/i.test(word)).length)
    
    var addOn = statement();

    // Send the echo message
    send(req.body.spaceId,
      util.format(
        'Hey %s, did you say %s? \n%s',
        req.body.userName, req.body.content, addOn),
      token(),
      (err, res) => {
        if(!err)
          log('Sent message to space %s', req.body.spaceId);
      });
};

const statement = () => {
	
  var saying = [
    		"He gave his father 'the talk'",
		"His passport requires no photograph",
		"When he drives a car off the lot, its price increases in value",
		"Once a rattlesnake bit him, after 5 days of excruciating pain, the snake finally died",
		"His 5 de Mayo party starts on the 8th of March",
		"His feet don't get blisters, but his shoes do",
		"He once went to the psychic, to warn her",
		"If he were to punch you in the face you would have to fight off a strong urge to thank him",
		"Whatever side of the tracks he's currently on is the right side, even if he crosses the tracks he'll still be on the right side",
		"He can speak Russian... in French",
		"He never says something tastes like chicken.. not even chicken",
		"Superman has pajamas with his logo",
		"His tears can cure cancer, too bad he never cries",
		"The circus ran away to join him",
		"Bear hugs are what he gives bears",
		"He once brought a knife to a gunfight... just to even the odds",
		"When he meets the Pope, the Pope kisses his ring",
		"His friends call him by his name, his enemies don't call him anything because they are all dead",
		"He has never waited 15 minutes after finishing a meal before returning to the pool",
		"If he were to visit the dark side of the moon, it wouldn't be dark",
		"He once won a staring contest with his own reflection",
		"He can kill two stones with one bird",
		"His signature won a Pulitzer",
		"When a tree falls in a forest and no one is there, he hears it",
		"He once got pulled over for speeding, and the cop got the ticket",
		"The dark is afraid of him",
		"Sharks have a week dedicated to him",
		"His ten gallon hat holds twenty gallons",
		"No less than 25 Mexican folk songs have been written about his beard",
		"He once made a weeping willow laugh",
		"He lives vicariously through himself",
		"His business card simply says I'll Call You",
		"He once taught a german shepherd how to bark in spanish",
		"He bowls overhand",
		"In museums, he is allowed to touch the art",
		"He is allowed to talk about the fight club",
		"He once won a fist fight, only using his beard",
		"He once won the Tour-de-France, but was disqualified for riding a unicycle",
		"A bird in his hand is worth three in the bush",
		"His lovemaking has been detected by a seismograph",
		"The Holy Grail is looking for him",
		"Roses stop to smell him",
		"He once started a fire using only dental floss and water",
		"His sweat is the cure for the common cold",
		"Bigfoot tries to get pictures of him",
		"Werewolves are jealous of his beard",
		"He once turned a vampire into a vegetarian",
		"He once won the world series of poker using UNO cards",
		"He never wears a watch because time is always on his side",
		"He has taught old dogs a variety of new tricks",
		"He has won the lifetime achievement award... twice",
		"If opportunity knocks, and he's not at home, opportunity waits",
		"Batman watches Saturday morning cartoons about him",
		"When he was young he once sent his parents to his room",
		"He once had an awkward moment, just to see how it feels",
		"His beard alone has experienced more than a lesser man’s entire body",
		"His blood smells like cologne",
		"Mosquitoes refuse to bite him purely out of respect",
		"He is fluent in all languages, including three that he only speaks",
		"Once while sailing around the world, he discovered a short cut",
		"Panhandlers give him money",
		"When he goes to Spain, he chases the bulls",
		"His shadow has been on the 'best dressed' list twice",
		"When he holds a lady's purse, he looks manly",
		"Two countries went to war to dispute HIS nationality",
		"When in Rome, they do as HE does",
		"His pillow is cool on BOTH sides",
		"The Nobel Academy was awarded a prize from him",
		"He taught Chuck Norris martial arts",
		"Time waits on no one, but him",
		"Once he ran a marathon because it was 'on the way'",
		"His mother has a tattoo that says 'Son'",
		"The star on his Christmas tree is tracked by NASA",
		"Presidents take his birthday off",
		"His recipe for deviled eggs involves actual witchcraft",
		"He has never walked into a spider web",
		"He is left-handed. And right-handed",
		"His shirts never wrinkle",
		"The police often question him, just because they find him interesting",
		"His organ donation card also lists his beard",
		"He doesn’t believe in using oven mitts, nor potholders",
		"His cereal never gets soggy. It sits there, staying crispy, just for him",
		"Respected archaeologists fight over his discarded apple cores",
		"Even his tree houses have fully finished basements",
		"His garden maze is responsible for more missing persons than the bermuda triangle",
		"If he were to say something costs an arm and a leg, it would",
		"He’s never lost a game of chance",
		"He is the life of parties that he has never attended",
		"He was on a recent archaeological dig and came across prehistoric foot prints that lead out of Africa into all parts of the world. On close inspection, it turned out that the prints were his",
		"He once caught the Loch Ness Monster….with a cane pole, but threw it back",
		"His wallet is woven out of chupacabra leather",
		"He played a game of Russian Roulette with a fully loaded magnum, and won",
		"Freemasons strive to learn HIS secret handshake",
		"If he was to pat you on the back, you would list it on your resume",
		"He is considered a national treasure in countries he’s never visits",
		"Cars look both ways for him, before driving down a street",
		"He once tried to acquire a cold just to see what it felt like, but it didn’t take",
		"He has inside jokes with people he’s never met."
		];	
	var high = saying.length - 1;
	var low = 0;
	var statement = "By the way, did you know?\n " + saying[ Math.floor(Math.random() * (high - low + 1) + low)];
	statement += "\n He is the most interesting man in the world.";
	//var statement = saying[0];
  return statement;
};

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
            name: 'Sample echo app'
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
