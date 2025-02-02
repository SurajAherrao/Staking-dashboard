import React from 'react';
import { makeStyles } from '@material-ui/core';
import Page from '../../../components/Page';
import Hero from './Hero';

const useStyles = makeStyles(() => ({
  root: {},
}));

const HomeView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="SJ Dashboard">
      <Hero />
    </Page>
  );
};

export default HomeView;
