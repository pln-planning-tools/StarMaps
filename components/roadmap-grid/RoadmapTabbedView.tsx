import {
  Box,
  Link,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';

import { TodayMarkerToggle } from './today-marker-toggle';
import { setViewMode, useViewMode } from '../../hooks/useViewMode';
import { DEFAULT_INITIAL_VIEW_MODE } from '../../lib/defaults';
import { ViewMode } from '../../lib/enums';
import { IssueDataViewInput } from '../../lib/types';
import Header from './header';
import styles from './Roadmap.module.css';
import { RoadmapDetailed } from './RoadmapDetailedView';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';

export function RoadmapTabbedView({
  issueDataState,
}: IssueDataViewInput): ReactElement {
  const globalLoadingState = useGlobalLoadingState();
  const viewMode = useViewMode() || DEFAULT_INITIAL_VIEW_MODE;
  const router = useRouter();
  if (issueDataState.children.length === 0 || globalLoadingState.get()) {
    return (<Spinner size="lg" />);
  }
  // Defining what tabs to show and in what order
  const tabs = ['Overview', 'Detailed View'] as const;

  // Mapping the views to the tabs
  const tabViewMap: Record<typeof tabs[number], ViewMode> = {
    'Overview': ViewMode.Simple,
    'Detailed View': ViewMode.Detail,
  };

  // Mapping the tabs to the views
  const tabViewMapInverse: Record<ViewMode, number> = tabs.reduce((acc, tab, index) => {
    acc[tabViewMap[tab]] = index;
    return acc;
  }, {} as Record<ViewMode, number>);

  const tabIndexFromViewMode = tabViewMapInverse[viewMode]

  const handleTabChange = (index: number) => {
    setViewMode(tabViewMap[tabs[index]]);
    router.push({
      hash: tabViewMap[tabs[index]],
    }, undefined, { shallow: true });
  }

  const renderTab = (title: string, index: number) => (
    <Tab
      key={index}
      _selected={{
        fontWeight: 'bold',
        textUnderlineOffset: '16px',
        textDecorationLine: 'underline',
        textDecorationThickness: '2px',
      }}
    >&nbsp;&nbsp;<Link href={'#' + tabViewMap[title]} className={styles.noDecoration}>{title}</Link>&nbsp;&nbsp;</Tab>
  );

  const renderTabPanel = (_title: string, index: number) => (
    <TabPanel key={index}>
      <RoadmapDetailed issueDataState={issueDataState} />
    </TabPanel>
  );

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header issueDataState={issueDataState} />
        <Flex align="center" justify="space-between">
          <Tabs variant='unstyled' onChange={handleTabChange} index={tabIndexFromViewMode} isLazy>
            <TabList display="flex" alignItems="center" justifyContent="space-between">
              <Flex>
                {tabs.map(renderTab)}
              </Flex>
              <TodayMarkerToggle />
            </TabList>
            <TabPanels>
              {tabs.map(renderTabPanel)}
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </>
  );
}
