type POI = {
  id: string;
  assetId?: string;
};

export function extractPOIs(value: string): POI[] {
  // value.match(/\$\{([^}]+)\}/g);
  const matches = value.match(/\$\{[^}]+\}/g);

  if (!matches) {
    return [];
  }

  return matches
    .map((match) => {
      const spl = match.trim().replace('${', '').replace('}', '').split(',');

      if (spl.length === 2) {
        return {
          id: spl[0].trim(),
          assetId: spl[1].trim(),
        };
      }

      return {
        id: spl[0].trim(),
      };
    })
    .filter(
      (value: POI, index, self) =>
        self.findIndex(
          (poi: POI) => poi?.id === value?.id && poi?.assetId === value?.assetId
        ) === index
    );
}

export function shortStringToBigIntUtil(convertableString: string) {
  if (!convertableString) {
    throw new Error('A non-empty string must be provided');
  }

  if (convertableString.length > 31) {
    const msg = `Short strings must have a max of ${31} characters.`;
    throw new Error(msg);
  }

  const invalidChars: { [key: string]: boolean } = {};
  const charArray = [];
  for (const c of convertableString.split('')) {
    const charCode = c.charCodeAt(0);
    if (charCode > 127) {
      invalidChars[c] = true;
    }
    charArray.push(charCode.toString(16));
  }

  const invalidCharArray = Object.keys(invalidChars);
  if (invalidCharArray.length) {
    const msg = `Non-standard-ASCII character${
      invalidCharArray.length === 1 ? '' : 's'
    }: ${invalidCharArray.join(', ')}`;
    throw new Error(msg);
  }

  return BigInt('0x' + charArray.join(''));
}

export function bigIntToShortStringUtil(convertableBigInt: BigInt) {
  return Buffer.from(convertableBigInt.toString(16), 'hex').toString();
}
