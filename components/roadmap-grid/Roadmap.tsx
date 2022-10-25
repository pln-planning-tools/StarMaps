import NextLink from 'next/link';

import { Box, GridItem, Link, Progress, Text } from '@chakra-ui/react';

import { group, rollup, sort } from 'd3';
import { closestIndexTo, format, formatISO, max, min, toDate } from 'date-fns';
import _ from 'lodash';
import { match } from 'path-to-regexp';
import React from 'react';

import { getClosest } from '../../lib/client/dateUtils';
import { dayjs } from '../../lib/client/dayjs';
import { getQuantiles } from '../../lib/client/getQuantiles';
import { getRange } from '../../lib/client/getRange';
import { timelineTicks } from '../../lib/client/timelineTicks';
import { IssueData } from '../../lib/types';
import { addOffset, slugsFromUrl, toTimestamp } from '../../utils/general';
import PageHeader from '../layout/PageHeader';
import RoadmapHeader from '../roadmap/RoadmapHeader';
import styles from './Roadmap.module.css';

const getUrlPathname = (url) => {
  try {
    const urlPathname = new URL(url).pathname;
    // console.log('urlPathname:', urlPathname);
    return urlPathname;
  } catch (error) {
    console.error('error:', error);
  }
};

function Header({ issueData }) {
  return (
    // <Text mb='8px' fontSize={40} fontWeight={600}>
    // {
    //   /* <NextLink href={issueData.html_url} passHref>
    //     <Link color='blue.500'>{issueData?.title}</Link>
    //   </NextLink> */
    // }
    // {issueData.title}
    // </Text>
    <RoadmapHeader issueData={issueData} />
  );
}

function GridHeader({ ticks, index }) {
  return (
    <>
      <div key={index} className={`${styles.item} ${styles.itemHeader}`}>
        {/* <span>{dayjs(timelineTick).utc().format('YYYY-MM-DD')}</span> */}
        <span>{`Q${dayjs(ticks).utc().format('Q YYYY')}`}</span>
      </div>
    </>
  );
}

function FirstHeaderItem() {
  return <div className={`${styles.item} ${styles.itemHeader}`}></div>;
}

function GroupItem({ showGroupRowTitle, issueData, group }) {
  let detailedViewClass = 'detailedView';
  if (!showGroupRowTitle) {
    detailedViewClass = '';
  }
  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>
        {!!showGroupRowTitle && (
          // <NextLink
          //   href={`/roadmap/github.com/${slugsFromUrl(getUrlPathname(issueData.html_url)).params.owner}/${
          //     slugsFromUrl(getUrlPathname(issueData.html_url)).params.repo
          //   }/issues/${slugsFromUrl(getUrlPathname(issueData.html_url)).params.issue_number}`}
          //   passHref
          // >
          //   <Link color='blue.500'>{group.groupName}</Link>
          // </NextLink>
          <Text>{group.groupName}</Text>
        )}
      </div>
    </div>
  );
}

function GridRow({
  milestone,
  index,
  timelineQuantiles,
}: {
  milestone: IssueData;
  index: number;
  timelineQuantiles: Date[];
}) {
  return (
    <div
      key={index}
      style={{
        gridColumn: `${getClosest(milestone.due_date, timelineQuantiles)} / span 1`,
        // background: `linear-gradient(to right, #e9c8ff ${Number(milestone.completion_rate.toString()).toFixed(
        //   0,
        // )}%, white ${100 - milestone.completion_rate}%)`,
        background: `linear-gradient(90deg, rgba(166, 255, 168, 0.4) ${parseInt(
          milestone.completion_rate.toString(0),
        )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString(0))}%)`,
      }}
      className={`${styles.item} ${styles.issueItem}`}
    >
      <div className={styles.milestoneTitleWrapper}>
        <NextLink
          href={`/roadmap/github.com/${slugsFromUrl(getUrlPathname(milestone.html_url)).params.owner}/${
            slugsFromUrl(getUrlPathname(milestone.html_url)).params.repo
          }/issues/${slugsFromUrl(getUrlPathname(milestone.html_url)).params.issue_number}`}
          passHref
        >
          <Link color='blue.500' className={styles.milestoneTitle}>
            {milestone.title}
          </Link>
        </NextLink>
      </div>
      <div className={styles.milestoneDate}>{milestone.due_date}</div>
      {/* <Progress colorScheme='green' height='26px' value={milestone.completion_rate} /> */}
      {/* <progress value='70' max='100'></progress> */}
      {/* <span className={styles.progress} /> */}
    </div>
  );
}

function TodayMarker() {
  return (
    <div className={styles.todayMarkerWrapper}>
      <div className={styles.todayMarker} style={{ gridColumn: '1/-1' }} />
      <div className={styles.todayMarkerText}>Today</div>
    </div>
  );
}

function Grid({ children, ticks }) {
  return (
    <div
      // style={{ gridTemplateColumns: `repeat(${ticks.length + 1}, minmax(10px, 1fr))`, marginTop: '15px' }}
      style={{ gridTemplateColumns: `repeat(${ticks.length}, minmax(10px, 1fr))`, marginTop: '15px' }}
      className={styles.grid}
    >
      <TodayMarker />
      {children}
    </div>
  );
}

function GroupWrapper({ children, cssName = '', showGroupRowTitle = false }) {
  let viewModeClass = 'simpleView';
  if (!!showGroupRowTitle) {
    viewModeClass = 'detailedView';
  }
  return (
    <div
      className={`${styles.nested} ${styles.subgrid} ${styles.groupWrapper} ${styles[viewModeClass]} ${styles[cssName]}`}
    >
      {children}
    </div>
  );
}

export function Roadmap({ issueData, groupBy }: { issueData: IssueData; groupBy: string }) {
  // const showGroupRowTitle = !!(issueData.children.length > 1);
  // console.log('issueData:', issueData);
  // const groupedIssueData = _.groupBy(issueData.children as IssueData[], 'group');
  const detailedView = true;
  // let groupedIssueData;
  const groupedIssueData = Array.from(
    group(issueData.children as IssueData[], (d) => d.group),
    ([key, value]) => ({ groupName: key, items: value }),
  );
  console.log('groupedIssueData:', groupedIssueData);

  // const groupedIssueDataDetailedView = group(issueData.children as IssueData[], (d) =>
  //   d.children.map((v) => v.parent.title),
  // );
  const groupedIssueDataDetailedView = issueData.children.map((v) => ({
    groupName: v.title,
    items: v.children,
  }));
  console.log('groupedIssueDataDetailedView:', groupedIssueDataDetailedView);

  // console.log('issueData:', issueData);

  // const issuesDetailed = issueData.children.map((v) => ({ ...v, group: v.children.map((x) => x.parent.title)[0] }));
  // console.log('issuesDetailed:', issuesDetailed);

  // if (!!detailedView) {
  //   groupedIssueData = Array.from(
  //     group(issueData.children as IssueData[], (d) => d.children.map((v) => v.group)),
  //     ([key, value]) => ({ groupName: key, items: value }),
  //   );
  //   const groupedIssueDataWithThemes = group(issueData.children as IssueData[], (d) => d.parent.title);
  // }
  const showGroupRowTitle = !!(groupedIssueData.length > 1);
  const groupedIssueDataItems = groupedIssueData.map((v) => v.items);

  const hideMilestonesWithoutDate = true;
  const formatDate = (date): Date => dayjs(date).utc().toDate();
  const formatDateArray = (dates): Date[] => dates.map((date) => formatDate(date));
  const dates = formatDateArray(groupedIssueData.map((v) => v.items.map((v) => v.due_date)).flat());
  // console.log('dates:', dates);

  // const ticks = timelineTicks(dates);
  // console.log('ticks:', ticks);
  // const quantiles = getQuantiles(ticks);
  // const quantiles = getQuantiles(dates);
  const quarterTicks = formatDateArray([
    '2022-07-01T00:00:00.000Z', // Q1 2022 / 2022-01-01
    '2022-10-01T00:00:00.000Z', // Q2 2022 / 2022-04-01
    '2023-01-01T00:00:00.000Z', // Q3 2022 / 2022-07-01
    '2023-04-01T00:00:00.000Z', // Q4 2022 / 2022-10-01
    '2023-07-01T00:00:00.000Z', // Q1 2023 / 2023-01-01
  ]);
  // console.log('quarterTicks:', quarterTicks);

  // console.log('issueData:', issueData);
  return (
    <>
      <Box className={styles.timelineBox}>
        {!!issueData && <Header issueData={issueData} />}
        <Grid ticks={quarterTicks}>
          {/* <FirstHeaderItem /> */}
          {quarterTicks.map((tick, index) => (
            <GridHeader ticks={tick} index={index} />
          ))}
          {/* <GroupWrapper cssName='timelineHeaderLineWrapper'> */}
          <GroupWrapper cssName='timelineHeaderLineWrapper'>
            <GridItem style={{ gridRow: '2/span 1' }} className={styles.timelineHeaderLine} />
            {/* <div></div> */}
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
          </GroupWrapper>
          {!!issueData &&
            _.reverse(Array.from(_.sortBy(groupedIssueData, ['groupName']))).map((group, index) => {
              // console.log('group:', group);

              return (
                <GroupWrapper showGroupRowTitle={showGroupRowTitle}>
                  <GroupItem showGroupRowTitle={showGroupRowTitle} issueData={issueData} group={group} />
                  {!!group.items &&
                    _.sortBy(group.items, ['title']).map((item, index) => {
                      // console.log('item:', item);

                      return <GridRow milestone={item} index={index} timelineQuantiles={quarterTicks} />;
                    })}
                </GroupWrapper>
              );
            })}
        </Grid>
      </Box>
    </>
  );
}