import PubNub from 'pubnub';

const pubnub = new PubNub({
   publishKey: 'pub-c-568f3541-bf8d-4bcc-8e5c-828607e53018',
   subscribeKey: 'sub-c-84a73187-d572-4a15-a58d-d900cba155f8',
   secretKey: 'sec-c-ZmRhODczZjktNTQ4Ni00ZmMxLWJhZjctM2M1Njc5MWFkNjEz'
});

export default pubnub;
