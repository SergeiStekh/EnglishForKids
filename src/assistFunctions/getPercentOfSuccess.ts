export default function getPercentOfSuccess(right: number, wrong: number): number {
  return +((right / (right + wrong)) * 100).toFixed(2);
}
