import { StatisticsDataType } from '../components/statistics/statistics';

export default function updateStatistics(oldData: StatisticsDataType[], newData: StatisticsDataType[]): StatisticsDataType[] {
  return newData.map((data) => {
    const { cardWordInEnglish } = data;

    const wordIndexInOldData = oldData.findIndex((el) => el.cardWordInEnglish.toLowerCase() === cardWordInEnglish.toLowerCase());

    if (wordIndexInOldData === -1) {
      return data;
    } else {
      return {
        ...data,
        clicksInLearnMode: oldData[wordIndexInOldData].clicksInLearnMode,
        guessedInPlayMode: oldData[wordIndexInOldData].guessedInPlayMode,
        mistakesInPlayMode: oldData[wordIndexInOldData].mistakesInPlayMode,
        percentOfCorrectAnswers: oldData[wordIndexInOldData].percentOfCorrectAnswers,
      };
    }
  });
}
