import React from 'react';
import { Container, Alert, Navbar, Nav, Table, NavDropdown } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import { range } from 'lodash';

import axios from './client';
import Graph from './Graph';
import Loading from './Loading';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App({ location, location: { search }, history, ...rest }) {
  const [countries, setCountries] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [dates, setDates] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const urlParams = new URLSearchParams(search);
  const [ob, setOB] = React.useState(urlParams.get('observation_date'));
  const [mr, setMR] = React.useState(urlParams.get('max_results'));
  const [page, setPage] = React.useState(urlParams.get('page') || 1);
  const queryResolver = (ob, mr, page) => {
    const observation_date = ob ? `observation_date=${ob}` : null;
    const max_results = mr ? `max_results=${mr}` : null;
    const p = page ? `page=${page}` : null;
    const queries = [observation_date, max_results, p];
    return queries.length > 0 ? `?${queries.join('&')}` : ''
  }
  console.log('>>', rest)
  React.useEffect(() => {
    async function request() {
      setError(null)
      setLoading(true)
      await axios.get(`/top/confirmed/dates`).then(({ data }) => {
        setDates(data.dates)
      }).catch(err => {
        setDates([])
        setError(err.response.data)
      })
      await axios.get(`/top/confirmed${queryResolver(ob, mr, page)}`).then(({ data }) => {
        setCountries(data.countries)
        setTotal(data.total)
      }).catch(err => {
        console.log('ee', { ...err })
        setCountries([])
        setError(err.response ? err.response.data : err)
      })
      setLoading(false)
    }
    request()

  }, [ob, mr, page])

  const renderTableHeader = () => {
    const headers = ["Country", "Confirmed", "Deaths", "Recovered"]
    return headers.map(header => <th key={header}>{header}</th>)
  }
  const renderValue = (value, index) => {
    return value || '-'
  }
  const renderTableBody = () => {
    if (countries.length === 0) return <tr><td colSpan="8">No record(s) to display</td></tr>
    return countries.map(country => {
      const body = Object.values(country)
      return <tr key={`tr-${country.SNo}-${Math.random()}`}>
        {body.map((v, x) => <td key={`td-${country.SNo}-${country.ProvinceState}-${Math.random()}`}>
          {renderValue(v, x)}
        </td>)}
      </tr>
    })
  }
  const renderError = () => {
    if (!error) return null
    if (Array.isArray(error)) {
      const errs = error.map(err => <li>{err.message}</li>)
      return <Alert dismissible variant="danger" onClose={() => setError(null)}>
        Error:
        <ul>
          {errs}
        </ul>
      </Alert>
    }
    return <Alert dismissible variant="danger" onClose={() => setError(null)}>
      {error.message}
    </Alert>
  }

  const handlerNavMenus = (val, type) => {
    const arr = [ob, mr];
    if (type === 'ob') {
      setOB(val)
      arr[0] = val;
    } else {
      setMR(val)
      arr[1] = val;
    }
    history.push(`/${queryResolver(arr[0], arr[1])}`)
  }

  const renderPagination = () => {
    if (total > 0) return
    return <Pagination
      activePage={page}
      itemsCountPerPage={mr}
      totalItemsCount={total}
      pageRangeDisplayed={10}
      linkClass="page-link"
      innerClass="pagination pagination-sm"
      itemClass="page-item"
      onChange={(e) => {
        setPage(e)
        history.push(`/${queryResolver(ob, mr, e)}`)
      }}
    />
  }
  return (
    <>
      {loading && <Loading />}
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Countries affected by Covid-19</Navbar.Brand>
        <Nav className="mr-auto">
          <span>Date</span>
        </Nav>
        <Navbar.Collapse id="date-nav">
          <Nav>
            <NavDropdown title={ob || "Select"} id="date-nav-dp">
              {dates.map(date => <NavDropdown.Item onClick={() => {
                handlerNavMenus(date, 'ob')
              }} active={date === ob} key={date}>{date}</NavDropdown.Item>)}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <span>Max Results</span>
        </Nav>
        <Navbar.Collapse id="mr-nav">
          <Nav>
            <NavDropdown title={mr || "Select"} id="mr-nav-dp">
              {[5, 10, 20, 30, 50, 100, 200, 'Max'].map(num => <NavDropdown.Item onClick={() => {
                handlerNavMenus(num, 'mr')
              }} active={num === mr} key={num}>{num}</NavDropdown.Item>)}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <br />
      <Container>
        {renderError()}
        {countries.length > 0 && <Graph countries={countries} />}
        <Table hover size="sm">
          <thead>
            <tr>
              {renderTableHeader()}
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </Table>
        {renderPagination()}
      </Container>
    </>
  );
}

export default App;
