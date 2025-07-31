function getDateTimeDifference(date1: Date, date2: Date) {
  return Math.abs(date2.getTime() - date1.getTime());
}

export default getDateTimeDifference;
