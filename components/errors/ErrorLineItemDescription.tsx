import {Box, Flex, Text} from '@chakra-ui/react';

import { StarMapsIssueErrorsGrouped } from '../../lib/types';
import styles from './ErrorLineItemDescription.module.css';

export function ErrorLineItemDescription({error}: {error: StarMapsIssueErrorsGrouped}) {
  return (
    <>
      <Text as="b" className={styles.errorIssueDescriptionLabel}>Description:&nbsp;</Text>
      <br />
      {/* <Flex direction="column" verticalAlign="bottom"> */}
        {error.errors.map((errItem, index) => {
          return (
            <>
              <Text key={index} className={styles.errorIssueDescriptionText}>&nbsp;{errItem.message}; </Text>
              <br />
            </>
          );
        })}
      {/* </Flex> */}
    </>
  )
}
