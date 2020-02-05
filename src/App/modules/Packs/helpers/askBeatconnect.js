import config from '../../../../shared/config';
import store from '../../../../shared/store';

const getPacksDashboardData = async (mode, callBack) => {
  const { packs, weeklyPacks } = config.api;
  const { packsDashboardData } = store.getState().packs;

  const queries = [];
  if (!packsDashboardData.lastWeekOverview || packsDashboardData.lastWeekOverview[0] === 0) queries.push(weeklyPacks);
  if (!packsDashboardData[mode] || !packsDashboardData[mode].yearly) queries.push(`${packs}&m=${mode}`);

  if (queries.length) {
    const promises = queries.map(queryUrl => fetch(queryUrl));

    const results = await Promise.all(promises);

    const jsonResults = await Promise.all(results.filter(res => res.ok).map(res => res.json()));

    return callBack(jsonResults);
  }

  return packsDashboardData;
};

export default getPacksDashboardData;