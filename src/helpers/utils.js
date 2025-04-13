export const nameRegExp =
  /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+([\.]?[\s]?[A-Za-zÁÉÍÓÚáéíóú]+)+$/;

export const idUserRegExp = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;

export function setDateToDb(date) {
  const tempDate = new Date(date);
  const year = tempDate.getFullYear();
  const month = (tempDate.getMonth() + 1).toString().padStart(2, '0');
  const day = tempDate.getDate().toString().padStart(2, '0');
  const dateToDb = `${year}-${month}-${day}`;

  return dateToDb;
}

export function getDateFromDb(dbDate) {
  const [year, month, day] = dbDate.split('-');
  const date = new Date(`${month}/${day}/${year}`);

  return date;
}

export function setTimeToDb(time) {
  const tempTime = new Date(time);
  const hours = tempTime.getHours();
  const minutes = tempTime.getMinutes();
  const timeToDb = `${hours}:${minutes}`;

  return timeToDb;
}

export function getTimeFromDb(date, dbTime) {
  const [hours, minutes] = dbTime.split(':');
  const tempDate = new Date(date);

  tempDate.setHours(parseInt(hours));
  tempDate.setMinutes(parseInt(minutes));

  return tempDate;
}
