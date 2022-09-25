let months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function getDateInUTCWithoutHours(date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
  );
}

export function convertDateToUTC(date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

export function getDateInUTC(date) {
  var now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
  return new Date(now_utc);
}

export function convertDateToString(date) {
  date =
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2);
  return date;
}

export function convertDateTimeToString(date) {
  date =
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2) +
    ' ' +
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2);
  return date;
}

export const postTimeAndReaction = postTime => {
  let feeling = '';
  let unixTime = parseInt(postTime);
  let postDate = new Date(unixTime * 1000);
  let currentDate = new Date();
  if (postDate.getDate() === currentDate.getDate()) {
    feeling = 'is feeling';

    if (postDate.getHours() === currentDate.getHours()) {
      let min = currentDate.getMinutes() - postDate.getMinutes();
     
      if (min === 0) {
        return {
          time: 'Just now',
          feeling,
        };
      } else {
        return {
          time: min + ' min ago',
          feeling,
        };
      }
    } else if (currentDate.getHours() - postDate.getHours() <= 24) {
      return {
        time: currentDate.getHours() - postDate.getHours() + ' hr ago',
        feeling,
      };
    }
  } else {
    feeling = 'was feeling';
    let year = postDate.getFullYear();
    let month = months[postDate.getMonth()];
    let date = postDate.getDate();
    let days = Math.floor(
      (new Date().getTime() - new Date(postTime * 1000).getTime()) /
      (1000 * 60 * 60 * 24),
    );
    if (days < 7) {
      return {
        time: `${days == 0 ? 1 : days} ${days > 1 ? 'days' : 'day'}`,
        feeling,
      };
    } else if (days <= 31) {
      return {
        time: `${Math.floor(days / 7) == 0 ? 1 : Math.floor(days / 7)} ${Math.floor(days / 7) > 1 ? 'weeks ago' : 'week ago'
          }`,
        feeling,
      };
    } else if (days < 335) {
      return {
        time: `${Math.floor(days / 30)} ${Math.floor(days / 30) > 1 ? 'months ago' : 'month ago'
          }`,
        feeling,
      };
    } else if (days >= 365) {
      let year = Math.floor(days / 30)
      year = year / 12;
      
     
      return {
        time: `${year > 0 && year < 1 ? '1 year ago' : Math.floor(year) == 1 ? '1 year ago' : Math.floor(year) + 'years ago'}`,
        feeling,
      };
    }
    return{
      time:undefined,
      feeling
    }
  }
};
