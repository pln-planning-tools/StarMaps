import { getDueDate } from '../parser';
import { GithubIssueDataWithGroupAndChildren, IssueData } from '../types';
import { calculateCompletionRate } from './calculateCompletionRate';
import { ErrorManager } from './errorManager';

export function addToChildren(
  data: GithubIssueDataWithGroupAndChildren[],
  parent: IssueData | GithubIssueDataWithGroupAndChildren = {} as IssueData | GithubIssueDataWithGroupAndChildren,
  errorManager: ErrorManager
): IssueData[] {

  if (Array.isArray(data)) {
    const parentAsGhIssueData = parent as GithubIssueDataWithGroupAndChildren;
    let parentDueDate = '';
    if (parentAsGhIssueData.body_html != null && parentAsGhIssueData.html_url != null) {
      parentDueDate = getDueDate(parentAsGhIssueData, errorManager).eta
    }
    const parentParsed: IssueData['parent'] = {
      state: parent.state,
      group: parent.group,
      title: parent.title,
      html_url: parent.html_url,
      labels: parent.labels,
      node_id: parent.node_id,
      completion_rate: calculateCompletionRate(parent),
      due_date: parentDueDate,
    };
    return data.map((item: GithubIssueDataWithGroupAndChildren): IssueData => ({
      labels: item.labels ?? [],
      completion_rate: calculateCompletionRate(item),
      due_date: getDueDate(item, errorManager).eta,
      html_url: item.html_url,
      group: item.group,
      title: item.title,
      state: item.state,
      node_id: item.node_id,
      parent: parentParsed,
      children: addToChildren(item.children, item, errorManager),
    }));
  }

  return [];
};
