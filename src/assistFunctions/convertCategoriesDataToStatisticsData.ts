import { CategoryDataType } from '../assistFunctions/fetchData';
import { StatisticsDataType } from '../components/statistics/statistics';

export default function convertCategoriesDataToStatisticsData(categoriesData: CategoryDataType[]): StatisticsDataType[] {
  return [
    ...categoriesData.map((category) => {
      const categoryName = category.categoryName;
      const categoryCards = category.cards;

      return categoryCards.map((card) => {
        return {
          cardWordInEnglish: card.cardWordInEnglish,
          cardWordInPolish: card.cardWordInPolish,
          category: categoryName,
          clicksInLearnMode: 0,
          guessedInPlayMode: 0,
          mistakesInPlayMode: 0,
          percentOfCorrectAnswers: 0,
        };
      });
    }),
  ].reduce((a, b) => a.concat(b), []);
}
