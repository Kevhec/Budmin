import { Ordinals } from '@lib/types';

function getOrdinalNumber(ordinal: Ordinals) {
  const ordinalsMap: Record<Ordinals, number> = {
    [Ordinals.FIRST]: 1,
    [Ordinals.SECOND]: 2,
    [Ordinals.THIRD]: 3,
    [Ordinals.FOURTH]: 4,
    [Ordinals.FIFTH]: 5,
  };

  return ordinalsMap[ordinal];
}

export default getOrdinalNumber;
