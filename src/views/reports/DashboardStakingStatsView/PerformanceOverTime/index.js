import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box, Card, CardHeader, CardContent, Divider, makeStyles } from '@material-ui/core';
import Chart from './Chart';

const useStyles = makeStyles(() => ({
  root: {},
  chart: {
    height: '100%',
  },
}));

const PerformanceOverTime = ({ className, ...rest }) => {
  const classes = useStyles();
  const performance = {
    thisWeek: {
      data: [],
      labels: [],
    },
    thisMonth: {
      data: [
        0, 19, 22, 29, 30, 30, 31, 30, 31, 31, 32, 32, 33, 33.5, 35, 36, 37, 38, 38, 39, 35, 35, 41,
        43,
      ],
      labels: [
        'Sep',
        '',
        '',
        '',
        'Oct',
        '',
        '',
        '',
        'Nov',
        '',
        '',
        '',
        'Dec',
        '',
        '',
        '',
        'Jan',
        '',
        '',
        '',
        'Feb',
        '',
        '',
        '',
      ],
    },
    thisYear: {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 31, 35],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Staked SJ Over Time" />
      <Divider />
      <CardContent>
        <PerfectScrollbar>
          <Box height={375} minWidth={300}>
            <Chart
              className={classes.chart}
              data={performance.thisMonth.data}
              labels={performance.thisMonth.labels}
            />
          </Box>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

PerformanceOverTime.propTypes = {
  className: PropTypes.string,
};

export default PerformanceOverTime;
