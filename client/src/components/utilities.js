export const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
export const shortWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getFirstDayOfMonth = (year, month) => {
    month++;
    return new Date(year + "-" + month + "-01").getDay();
}

export const getLastDateOfMonth = (year, month) => {
    if(month === 11) {
        month = -1;
    }
    month+=2;
    let date = new Date(year + "-" + month + "-01");
    date.setDate(0);
    return date.getDate();
}

export const getCompleteMonth = (year, month) => {
    let content = [];
    let currDay = 1;
    let firstDay = getFirstDayOfMonth(year, month);
    let lastDate = getLastDateOfMonth(year, month);

    while(currDay <= lastDate) {
        for(let i = 0; i < 7; i++) {
            if(currDay === 1) {
                if(i === firstDay) {
                    content.push(currDay)
                    currDay++;
                }  else {
                    content.push("");
                }
            } else if (currDay <= lastDate){
                content.push(currDay)
                currDay++;
            }
        }
    }   
    return content;
}

export const getDateUtil = (year, month, date) => {
    return new Date(year + "-" + (month + 1) + "-" + date);
}

export const getFirstLastDayOfWeek = (year, month, date) => {
    const newDate = getDateUtil(year, month, date);
    let firstDate = new Date(newDate.getTime() - newDate.getDay() * 24 * 60 * 60 * 1000);
    let lastDate = new Date(firstDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    return [
        {
            date: firstDate.getDate(), 
            month: firstDate.getMonth(),
            year: firstDate.getFullYear()
        },
        {
            date: lastDate.getDate(),
            month: lastDate.getMonth(),
            year: lastDate.getFullYear()
        }
    ];
}

export const getTodaysDateStr = () => {
    let date = new Date();
    let month = date.getMonth() + 1;
    if(month <= 9) month = "0" + month;
    let day = date.getDate();
    if(day <= 9) day = "0" + day;
    return date.getFullYear() + "-" + month + "-" + day;
}

export const getTimeStr = (hours, minutes) => {
    hours = hours.toString();
    if(hours.length === 1) hours = "0" + hours;
    minutes = minutes.toString();
    if(minutes.length === 1) minutes = "0" + minutes;
    return hours + ":" + minutes;
}

export const getDateStr = (year, month, date) => {
    month++;
    month = month.toString();
    if(month.length === 1) {
        month = "0" + month;
    }
    date = date.toString();
    if(date.length === 1) {
        date = "0" + date;
    }
    return year + "-" + month + "-" + date;
}

export const getTimeAMPM = (hours, minutes) => {
    let t = hours;
    minutes = minutes.toString();
    if(minutes.length === 1) {
        minutes = "0" + minutes;
    }
    if(t >= 12) {
        if(t !== 12)
            t = (t - 12).toString();
        else 
            t = t.toString();
        if(t.length === 1) t = "0" + t;
        t = t + ":" + minutes + "PM";
    } else {
        t = t.toString();
        if(t.length === 1) t = "0" + t;
        t = t + ":" + minutes + "AM";
    }
    return t;
}