/* eslint-disable no-undef */
// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  if (!address) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

export const filteredStakersList = stakerList => {
  let stakerMap = new Map();
  const stakersDepositData = stakerList?.stakeds;

  stakersDepositData?.forEach(stakerData => {
    let staker = stakerMap.get(stakerData.user);
    if (!staker) {
      stakerMap.set(stakerData.user, {
        value: BigInt(stakerData.amount),
      });
    } else {
      stakerMap.set(stakerData.user, {
        value: staker.value + BigInt(stakerData.amount),
      });
    }
  });
  let stakerArrayData = [];
  for (let [key, val] of stakerMap) {
    stakerArrayData.push({
      account: key,
      amount: parseInt(val.value / BigInt(10 ** 18)),
    });
  }
  return stakerArrayData;
};

export const convertLongStrToShort = (text, start = 4, end = 4) => {
  if (text) {
    let startCharacter = text.slice(0, start);
    let endCharacter = text.slice(-end);
    return startCharacter.concat('...', endCharacter);
  } else {
    return '...';
  }
};
