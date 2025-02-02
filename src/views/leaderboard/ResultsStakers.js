import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import { convertLongStrToShort } from '../../utils/helpers';

const applyFilters = (stakersList, query) => {
  return stakersList.filter(entry => {
    let matches = true;

    if (query && !entry.account.toLowerCase().includes(query.toLowerCase())) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (stakersList, page, limit) => {
  return stakersList.slice(page * limit, page * limit + limit);
};

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius:"18px",
  },
  queryField: {
    width: 600,
    borderRadius:"18px",
  },
  rankCell: {
    width: 30,
    flexBasis: 30,
  },
}));

const ResultsStakers = ({ className, stakersList, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');

  const handleQueryChange = event => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = event => {
    setLimit(parseInt(event.target.value));
  };

  // Usually query is done on backend with indexing solutions
  const filteredStakersList = applyFilters(stakersList, query);
  const paginatedStakersList = applyPagination(filteredStakersList, page, limit);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box p={2}>
        <Box style={{borderRadius:"18px"}} display="flex" justifyContent="end " alignItems="center">
          <input style={{width:"100%" , padding:"14px 20px", height:"100%",borderRadius:"36px", border:"2px solid #f2f2f2"}} onChange={handleQueryChange}
            placeholder="Search address"
            value={query}
            />
        </Box>
      </Box>
      <PerfectScrollbar>
        <Box minWidth={300}>
          <Table>
            <TableHead>
              <TableRow style={{background: "#D4A674"}}>
                <TableCell style={{color:"white"}} className={classes.rankCell}>Rank</TableCell>
                <TableCell style={{color:"white"}} >Address</TableCell>
                <TableCell style={{color:"white"}} align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStakersList.map((entry, index) => {
                return (
                  <TableRow style={{margin:"12px 0px"}} hover key={entry.id}>
                    <TableCell className={classes.rankCell}>{index+1}</TableCell>
                    <TableCell>{convertLongStrToShort(entry.account, 6, 4)}</TableCell>
                    <TableCell align="right">{Math.floor(entry.amount)} SJ</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredStakersList.length}
            labelRowsPerPage={isMobile ? '#' : 'Rows per page'}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

ResultsStakers.propTypes = {
  className: PropTypes.string,
  stakersList: PropTypes.array.isRequired,
};

ResultsStakers.defaultProps = {
  stakersList: [],
};

export default ResultsStakers;
