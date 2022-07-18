import { StatisticsDataType } from '../components/statistics/statistics';

export function stringSort(dataToSort: StatisticsDataType[], sortType: 'asc' | 'desc', nameOfKeyInObjectToSort: string): StatisticsDataType[] {
  let sortedData = [...dataToSort];

  if (sortType === 'asc') {
    sortedData = sortedData.sort((a, b) => {
      if (
        a[nameOfKeyInObjectToSort as keyof StatisticsDataType].toString().localeCompare(b[nameOfKeyInObjectToSort as keyof StatisticsDataType].toLocaleString()) < 0
      ) {
        return -1;
      }
      if (
        a[nameOfKeyInObjectToSort as keyof StatisticsDataType].toString().localeCompare(b[nameOfKeyInObjectToSort as keyof StatisticsDataType].toLocaleString()) > 0
      ) {
        return 1;
      }
      return 0;
    });
  }
  if (sortType === 'desc') {
    sortedData = sortedData.sort((a, b) => {
      if (
        a[nameOfKeyInObjectToSort as keyof StatisticsDataType].toString().localeCompare(b[nameOfKeyInObjectToSort as keyof StatisticsDataType].toLocaleString()) > 0
      ) {
        return -1;
      }
      if (
        a[nameOfKeyInObjectToSort as keyof StatisticsDataType].toString().localeCompare(b[nameOfKeyInObjectToSort as keyof StatisticsDataType].toLocaleString()) < 0
      ) {
        return 1;
      }
      return 0;
    });
  }
  return sortedData;
}

export function numberSort(dataToSort: StatisticsDataType[], sortType: 'asc' | 'desc', nameOfKeyInObjectToSort: string): StatisticsDataType[] {
  let sortedData = [...dataToSort];
  if (sortType === 'asc') {
    sortedData = sortedData.sort((a, b) => {
      if (a[nameOfKeyInObjectToSort as keyof StatisticsDataType] < b[nameOfKeyInObjectToSort as keyof StatisticsDataType]) {
        return -1;
      }
      if (a[nameOfKeyInObjectToSort as keyof StatisticsDataType] > b[nameOfKeyInObjectToSort as keyof StatisticsDataType]) {
        return 1;
      }
      return 0;
    });
  }
  if (sortType === 'desc') {
    sortedData = sortedData.sort((a, b) => {
      if (a[nameOfKeyInObjectToSort as keyof StatisticsDataType] > b[nameOfKeyInObjectToSort as keyof StatisticsDataType]) {
        return -1;
      }
      if (a[nameOfKeyInObjectToSort as keyof StatisticsDataType] < b[nameOfKeyInObjectToSort as keyof StatisticsDataType]) {
        return 1;
      }
      return 0;
    });
  }
  return sortedData;
}
