export function TimeStampConverter(timeStamp,Type){

    const stampDate = new Date(timeStamp),
    todayDate = new Date();

    var date = {
        time: stampDate.toLocaleString('en-AU'),
        toDate: stampDate.toDateString('en-AU'),
        hour:{
            stamp: stampDate.getHours(),
            now: todayDate.getHours()
        },
        day:{
            stamp: stampDate.getDay(),
            now: todayDate.getDay()
        },
        week:{
            stamp: stampDate.getDate(),
            now: todayDate.getDate()
        },
        month:{
            stamp: stampDate.getMonth(),
            now: todayDate.getMonth()
        },
        year:{
            stamp: stampDate.getFullYear(),
            now: todayDate.getFullYear()
        }
    }


    let yearD = date.year.stamp - date.year.now,
        monthD = date.month.stamp - date.month.now,
        weekD = date.week.stamp - date.week.now;
        dayD = date.day.stamp - date.day.now;

    let time1 = date.time.slice(12),
        time2 = time1.length-6;
        time3 = time1.match(/pm/g)?time1.slice(0,time2)+" pm":time1.slice(0,time2)+" am"


    switch(true){
        case yearD == 0 && monthD == 0 && weekD == 0:

            if(Type === "Profile" || Type == "Message"){
                return time3
            }

        case yearD == 0 && monthD == 0 && (weekD <= 0 && dayD <= 0 && Math.abs(weekD) <= 7):

            if(Type === "Profile"){
                return date.toDate.slice(0,3)

            }else if(Type === "Message"){
                return date.toDate.slice(0,3)+" "+time3
            }

        case yearD == 0:

            if(Type === "Profile"){
                return date.toDate.slice(3,11)

            }else if(Type === "Message"){
                return date.toDate.slice(3,11)+" "+time3
            }

        default:

            if(Type === "Profile"){
                return stampDate.toLocaleDateString()

            }else if(Type === "Message"){
                return stampDate.toLocaleDateString()+" "+time3
            }
    }

}

// console.log(TimeStampConverter(1550001556000,"Message"));

// Profile 
// TODAY 1:pm
// tHIS WEEK THU
// This > this week 23 may
// Year 20/3/2019


// Message
// Today-: 5:00 pm
// Withing week-: Web 8:34pm
// with mONTH-: 27 May, 8:34AM:
// with a year -->  13/2/2019, 11:04pm


// MessageHead
// active now 
// active 2m ago 
// active 2h ago 
// active yestarday
// Chatome