import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

export const STORE_NAME = 'STORE_NAME';
export const STORE_PURPOSE = 'STORE_PURPOSE';
export const STORE_DATE_ARRAY = 'STORE_DATE_ARRAY';
export const POP_DATE_ARRAY = 'POP_DATE_ARRAY';
export const STORE_DATE_ARRAY_ERROR_LABEL = 'STORE_DATE_ARRAY_ERROR_LABEL';
export const STORE_NAME_ERROR_LABEL = 'STORE_NAME_ERROR_LABEL';
export const STORE_PURPOSE_ERROR_LABEL = 'STORE_PURPOSE_ERROR_LABEL';
export const STORE_EVENT = 'STORE_EVENT';
export const STORE_PERSONALIZED_DATE_SELECTION = 'STORE_PERSONALIZED_DATE_SELECTION';
export const ATTENDEE_NAME = 'ATTENDEE_NAME';
export const STORE_ATTENDEE_NAME_ERROR_LABEL = 'STORE_ATTENDEE_NAME_ERROR_LABEL';
export const UPDATE_NOTIFICATION_FLAG = 'UPDATE_NOTIFICATION_FLAG';
export const STORE_LOCATION = 'STORE_LOCATION';
export const UPDATE_ATTENDEE = 'UPDATE_ATTENDEE';
export const RENDER_LANGUAGE = 'RENDER_LANGUAGE';
export const FETCH_AND_STORE_WEATHER = 'FETCH_AND_STORE_WEATHER';

export function storeName(name) {
  return dispatch => {
    return dispatch({
      type: STORE_NAME,
      name: name
    });
  };
}

export function storePurpose(purpose) {
  return dispatch => {
    return dispatch({
      type: STORE_PURPOSE,
      purpose: purpose
    });
  };
}

export function storeDateArray(date) {
  return dispatch => {
    return dispatch({
      type: STORE_DATE_ARRAY,
      date: date
    });
  };
}

export function popDateArray(date) {
  return dispatch => {
    return dispatch({
      type: POP_DATE_ARRAY,
      date: date
    });
  };
}

export function storeDateArrayErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_DATE_ARRAY_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

export function storeNameErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_NAME_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

export function storePurposeErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_PURPOSE_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

function storeEventId(json) {
  const eventId = json['eventId'];

  return browserHistory.push('/eventCreated/eventId=' + eventId);
}

export function registerEvent(name, purpose, dateArray, location) {
  return dispatch => {
    return fetch('/api/registerEvent', {credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'name' : name, 'purpose' : purpose, 'dateArray': dateArray, 'location': location})})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          console.log('error in posting event');
        }
        return res.json();
      })
      .then(json => storeEventId(json))
  };
}

function storeEvent(json) {
  //console.log('coming here' + JSON.stringify(json));
  return {
    type: STORE_EVENT,
    json
  }
}

export function fetchEvent(eventId) {
  return dispatch => {
    return fetch('/api/fetchEvent/?eventId=' + eventId, {credentials: 'include'})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          return dispatch({
            type: FETCH_ERROR,
            status: status
          });
        }
        return res.json();
      })
      .then(json => dispatch(storeEvent(json)))
  };
}

export function storePersonalizedDateSelection(date, status) {
  return dispatch => {
    return dispatch({
      type: STORE_PERSONALIZED_DATE_SELECTION,
      date: date,
      status: status
    });
  };
}

export function storeAttendeeName(name) {
  return dispatch => {
    return dispatch({
      type: ATTENDEE_NAME,
      name: name
    });
  };
}

export function storeAttendeeNameErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_ATTENDEE_NAME_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

export function registerAttendee(name, personalizedDateSelection, eventId) {
  console.log('calling upda');
  return dispatch => {
    return fetch('/api/registerAttendee', {credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'name': name, 'personalizedDateSelection': personalizedDateSelection, 'eventId': eventId})})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          console.log('error in updating event object');
        }
        return res.json();
      })
      .then(json => dispatch(storeEvent(json)))
  };
}

export function updateAttendee(attendeeId, name, personalizedDateSelection, eventId) {
  console.log('calling upda');
  return dispatch => {
    return fetch('/api/updateAttendee', {credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'attendeeId': attendeeId, 'name': name, 'personalizedDateSelection': personalizedDateSelection, 'eventId': eventId})})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          console.log('error in updating attendee object');
        }
        return res.json();
      })
      .then(json => dispatch(storeEvent(json)))
  };
}

export function updateNotificationFlag(flagValue) {
  return dispatch => {
    return dispatch({
      type: UPDATE_NOTIFICATION_FLAG,
      flagValue: flagValue
    });
  };
}

export function storeLocation(location) {
  return dispatch => {
    return dispatch({
      type: STORE_LOCATION,
      location: location
    });
  }
}

export function changelanguage(languageJson) {
  return dispatch => {
    return dispatch({
      type: RENDER_LANGUAGE,
      languageJson: languageJson
    });
  };
}

function storeWeatherJson(json) {
  let modifiedForecast = [];
  console.log('coming here' + JSON.stringify(json));
  if (json.query.results === null) {
    return {
      type: FETCH_AND_STORE_WEATHER,
      forecast: modifiedForecast
    }
  } else {
    const forecast = json.query.results.channel.item.forecast;

    for (let i=0; i<forecast.length; i++) {
      let forecastObj = {};
      forecastObj["date"] = forecast[i].date;
      forecastObj["cast"] = forecast[i].text;
      forecastObj["code"] = forecast[i].code;
      modifiedForecast.push(forecastObj);
    }

    return {
      type: FETCH_AND_STORE_WEATHER,
      forecast: modifiedForecast
    }
  }
}

export function fetchWeather(location) {
  return dispatch => {
    return fetch('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"' + location + '\")&format=json&env=store://datatables.org/alltableswithkeys', {credentials: 'omit'})
      .then(res => {
        if (res.status !== 200) {
          console.log("not fetch");
          let status = res.status;
          return dispatch({
            type: FETCH_ERROR,
            status: status
          });
        }
        console.log("fetch successfully");
        console.log(JSON.stringify(res));
        return res.json();
      })
      .then(json => dispatch(storeWeatherJson(json)))
  };
}