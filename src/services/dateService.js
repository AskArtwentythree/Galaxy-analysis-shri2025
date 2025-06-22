export class DateService {
  static formatDayOfYear(dayNumber) {
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let remainingDays = dayNumber;
    let month = 0;

    while (remainingDays > daysInMonth[month]) {
      remainingDays -= daysInMonth[month];
      month++;
    }

    return `${remainingDays} ${months[month]}`;
  }

  static getCurrentDate() {
    return new Date().toLocaleDateString('ru-RU');
  }
}
