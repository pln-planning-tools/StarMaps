import { Box } from '@chakra-ui/react';
import { group } from 'd3';
import _ from 'lodash';
import { getTicks } from '../../lib/client/getTicks';
import { ViewMode } from '../../lib/enums';
import { formatDateArrayDayJs, getInternalLinkForIssue } from '../../lib/general';
import { DetailedViewGroup, IssueData } from '../../lib/types';

import { useViewMode } from '../../hooks/useViewMode';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupItem } from './group-item';
import { GroupWrapper } from './group-wrapper';
import { Headerline } from './headerline';
import { useEffect, useState } from 'react';
import NumSlider from '../inputs/NumSlider';
import { dayjs } from '../../lib/client/dayjs';
import { DEFAULT_TICK_COUNT } from '../../config/constants';
import { globalTimeScaler } from '../../lib/client/TimeScaler';

export function RoadmapDetailed({
  issueData
}: {
  issueData: IssueData;
}) {
  const [isDevMode, setIsDevMode] = useState(false);
  const viewMode = useViewMode();
  const newIssueData = issueData.children.map((v) => ({
    ...v,
    group: v.parent.title,
    children: v.children.map((x) => ({ ...x, group: x.parent.title })),
  }));

  const issueDataLevelOne: IssueData[] = newIssueData.map((v) => v.children.flat()).flat();

  const issueDataLevelOneGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOne, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    }),
  );

  const issueDataLevelOneIfNoChildren: IssueData[] = newIssueData.map((v) => ({ ...v, children: [v], group: v.title }));
  const issueDataLevelOneIfNoChildrenGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOneIfNoChildren, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    }),
  );

  let issuesGrouped: DetailedViewGroup[];
  if (viewMode === ViewMode.Detail) {
    issuesGrouped =
      (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
      issueDataLevelOneIfNoChildrenGrouped;
  } else {
    issuesGrouped = Array.from(
      group(issueData.children as IssueData[], (d) => d.group),
      ([key, value]) => ({
        groupName: key,
        items: value,
        url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
      }),
    );
  }

  const today = dayjs();
  let dates = formatDateArrayDayJs(issuesGrouped.map((v) => v.items.map((v) => v.due_date)).flat())
    .concat([today.toDate()]).filter((v) => dayjs(v).isValid())
  let minDate = dayjs.min([...dates.map(v => dayjs(v)), today.subtract(1, 'month')])
  let maxDate = dayjs.max([...dates.map(v => dayjs(v)), today.add(1, 'month')])
  let incrementMax = false

  while (maxDate.diff(minDate, 'months') < (3 * DEFAULT_TICK_COUNT)) {
    if (incrementMax) {
      maxDate = maxDate.add(1, 'quarter');
    } else {
      minDate = minDate.subtract(1, 'quarter');
    }
    incrementMax = !incrementMax;
  }
  dates.push(minDate.toDate())
  dates.push(maxDate.toDate())

  dates = dates.sort((a, b) => {
    return a.getTime() - b.getTime();
  });

  const [numHeaderTicks, setNumHeaderTicks] = useState(5);
  const [numGridCols, setNumGridCols] = useState(45);

  globalTimeScaler.setScale(dates, numGridCols * 1.09);

  const ticks = getTicks(dates, numGridCols - 1);
  const ticksHeader = getTicks(dates, numHeaderTicks - 1);

  return (
    <>
      {isDevMode && <NumSlider msg="how many header ticks" value={numHeaderTicks} min={5} max={60} setValue={setNumHeaderTicks}/>}
      {isDevMode && <NumSlider msg="how many grid columns" value={numGridCols} min={20} max={60} step={numHeaderTicks} setValue={setNumGridCols}/>}

      <Box className={styles.timelineBox}>
        <Grid ticksLength={numGridCols}>
          {ticksHeader.map((tick, index) => (

            <GridHeader key={index} tick={tick} index={index} numHeaderTicks={numHeaderTicks} numGridCols={numGridCols} timeScaler={globalTimeScaler}/>
          ))}

          <Headerline numGridCols={numGridCols} ticksRatio={3}/>
        </Grid>
        <Grid ticksLength={numGridCols} scroll={true}  renderTodayLine={true} >
          {_.reverse(Array.from(_.sortBy(issuesGrouped, ['groupName']))).map((group, index) => {
            return (
              <GroupWrapper key={index} >
                <GroupItem group={group} />
                {!!group.items &&
                  _.sortBy(group.items, ['title']).map((item, index) => {
                    return <GridRow key={index} timeScaler={globalTimeScaler} milestone={item} index={index} timelineTicks={ticks} numGridCols={numGridCols} numHeaderItems={numHeaderTicks}/>;
                  })}
              </GroupWrapper>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
