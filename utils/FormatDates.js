const formatDate = (date) => {
  date = new Date(date);
  const year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
};
const getBetweenDates = (startDate, endDate) => {
  const dates = [];
  let jumpingDate = startDate.getTime();
  while (jumpingDate <= endDate.getTime() + 3600000) {
    dates.push(formatDate(jumpingDate));
    jumpingDate += 86400000;
  }
  return dates;
};
const formatSubgoalsForCalendar = (subgoals) => {
  const formattedSubgoals = {};
  subgoals.forEach((subgoal) => {
    if (!subgoal.start_date) {
      const date = formatDate(subgoal.end_date);
      if (formattedSubgoals.hasOwnProperty(date)) {
        formattedSubgoals[date].push({ name: subgoal.objective });
      } else {
        formattedSubgoals[date] = [{ name: subgoal.objective }];
      }
    } else {
      const dates = getBetweenDates(
        new Date(subgoal.start_date),
        new Date(subgoal.end_date)
      );
      dates.forEach((date, index) => {
        if (formattedSubgoals.hasOwnProperty(date)) {
          formattedSubgoals[date].push({
            name: `${subgoal.objective} - Day ${index + 1} of ${dates.length}`,
          });
        } else {
          formattedSubgoals[date] = [
            {
              name: `${subgoal.objective} - Day ${index + 1} of ${
                dates.length
              }`,
            },
          ];
        }
      });
    }
  });
  return formattedSubgoals;
};

const formatGoalsForCalendar = (goals) => {
  const formattedGoals = {};

  goals.forEach((goal) => {
    const startDate = formatDate(goal.start_date)
    const endDate = formatDate(goal.end_date)

    formattedGoals[startDate] = [{ name: `FIRST DAY ${goal.objective}` }];
    formattedGoals[endDate] = [{ name: `LAST DAY ${goal.objective}` }];
  })

  return formattedGoals;
}
export { formatSubgoalsForCalendar, formatGoalsForCalendar };
