/**
 * Description of the action goes here
 * @param  {String} params.name=value Description of the parameter goes here
 * @param  {Number} [params.age] Optional parameter
 */
async function yourCustomAction(state, event, params) {
  return state
}



module.exports = { yourCustomAction }

const _ = require('lodash')
const axios = require('axios');
module.exports = {
  start: async(state ,event) => {
   // const fullname = null;
    const fullname = await event.bp.users.getTag(event.user.id,'FULLNAME');
    /*if (name == undefined){
       fullname = "No Name";
    }
    else{
       fullname = name;
    }*/
    return {
      ...state, // we clone the existing state
      fullname
      
    }
  },

  sendRandomQuestion: async (state, event) => {
    // The `-random()` extension picks a random element in all the `trivia` Content Type
    // We also retrieve the message we just sent, notice that `event.reply` is asynchronous, so we need to `await` it
    const messageSent = await event.reply('#!trivia-random()')
    //console.log(messageSent)
    // We find the good answer
    const goodAnswer = _.find(messageSent.context.choices, { payload: 'TRIVIA_GOOD' })

    return {
      ...state, // We clone the state
      ankit : null,
      isCorrect: null, // We reset `isCorrect` (optional)
      count: state.count + 1, // We increase the number of questions we asked so far
      goodAnswer // We store the goodAnswer in the state, so that we can match the user's response against it
      
    }
  },

  render: async (state, event, args) => {
    if (!args.renderer) {
      throw new Error('Missing "renderer"')
    }

    await event.reply(args.renderer, args)
  },

  validateAnswer: (state, event) => {
    const isCorrect = state.goodAnswer && event.text === state.goodAnswer.text
    console.log('___________________')
    console.log(isCorrect)
    const ankit = "ABC";
    return { ...state, isCorrect, ankit, score: isCorrect ? state.score + 1 : state.score }
  },
  console: async (state, event) => {
    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
    console.log(state)
    console.log(event.text)
    const value = await event.bp.users.getTags(event.user.id);
    console.log(value)
    return { ...state }
  },
  nlu: async (state, event ,{ name, value } ) => {
      //const intent ="null";
      //const entities = null;
      console.log(value);
      await axios.get('http://localhost:5000/parse?q='+value)
                .then(response  => {
                  data = response.data;
                  //console.log(data)
                  const intent = data.intent;
                  const entities = data.entities;
                  //event.bp.users.tag(event.user.id, 'intent', intent)
                   console.log("NNNNNNNNNNNNNNNNNNNNNN");
                  console.log(intent)
                  console.log(entities) 
                  event.user.myentities =  entities;
                  event.user.myintent =  intent;
                   console.log("NNNNNNNNNNNNNNNNNNNNNN");
            /*       return new Promise(async (resolve, reject) => { // <--- this line
                      try {
                        const abcefg = intent;
                        console.log("******************")
                         console.log(intent)
                        await event.bp.users.tag(event.user.id, "abcefg",intent.name);

                        return resolve(entities);
                      } catch(error) {
                        return reject(error);
                      }
                    });*/
                  
                  //await event.bp.users.tag(event.user.id, "abc", intent)
                  //const abc = "ABC"
                  //return { ...state, abc}

                })/*.then(response=>{
                  console.log("NNNNNNNNNNNNNNNNNNNNNN");
                  //console.log(response);
                  const ent = response
                  //console.log(state);
                  //return { ...state,ent }
                  console.log("NNNNNNNNNNNNNNNNNNNNNN");

                })*/
                .catch(error => {
                  console.log(error);
                });
    //const intent = await event.bp.users.getTag(event.user.id,"abcefg");
    //console.log(intent)
    const myentities=event.user.myentities;
    const myintent=event.user.myintent;
    return { ...state ,myintent,myentities}
     
  },

  /**
   * @param {string} args.name - Name of the tag.
   * @param {string} args.value - Value of the tag.
   */
  change: async (state, event) => {
    //await event.bp.users.tag(event.user.id, name, value)
    return { ...state}
  },

  setUserTag: async (state, event, { name, value }) => {
    await event.bp.users.tag(event.user.id, name, value)
    return { ...state }
  },

  getUserTag: async (state, event, { name, into }) => {
    const value = await event.bp.users.getTag(event.user.id, name)
    return { ...state, [into]: value }
  },

  getWeather:async (state,event) =>{
      //http = require('http');
      const entity = state.myentities[0];
      console.log("GGGGGGGGGGGGGGGGGGGG");
      ///console.log(entity.value)
      
       var apiKey = 'cacdf29dc2be47d484a105606152306';

       
        url = 'http://api.apixu.com/v1/current.json?key=' + apiKey + '&q=' + entity.value;
        await axios.get(url)
                .then(response  => {
                  current = response.data;
                  //console.log(current)

                  country = current.location.country
                  event.user.city = current.location.name
                  event.user.condition = current.current.condition.text
                  event.user.temperature_c = current.current.temp_c
                  event.user.humidity = current.current.humidity
                  event.user.wind_mph = current.current.wind_mph

                   //response = "It is currently "+condition+" in "+city+" at the moment. The temperature is "+temperature_c+" degrees, the humidity is "+humidity+"% and the wind speed is "+wind_mph+" mph.";
                  //console.log(response);
                })
                .catch(error => {
                  console.log(error);
                });

        //console.log(entity.value)
        const city = event.user.city 
        const condition = event.user.condition 
        const temperature_c = event.user.temperature_c 
        const humidity = event.user.humidity 
        const wind_mph = event.user.wind_mph 

        return {...state,city,condition,temperature_c,humidity,wind_mph }


  }
}