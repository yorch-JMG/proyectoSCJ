import './App.css';
import {Link, BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import WelcomeAdminComponent from './WelcomeAdminComponent';
import RegisterMember from './RegisterMember';
import RegisterEvent from './RegisterEvent';
import RegisterMeeting from './RegisterMeeting';
import RegisterLabReport from './RegisterLabReport';
import RegisterVisita from './RegisterVisit';
import AlterItems from './AlterItems';
import Axios from 'axios';
import {Navbar, Nav, Button} from 'react-bootstrap';
function RegisterDashboard() {
    Axios.defaults.withCredentials = true
    const handleLogOut = () => {
        Axios.get("http://localhost:3002/logout").then((response) => {
            console.log(response.data)

        })

    }

    return (
        <div>
            <header>
                <div className="opening-navbar-location">
                    <Navbar className="navbar-spacing" bg="light" expand="lg">
                        <Navbar.Brand href="/registerDashboard">SCJ</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav >
                                <Nav.Link href="/dashboard">Home</Nav.Link>
                                <Nav.Link href="/registerDashboard">Admin Dashboard</Nav.Link>
                                <Link to="/login">
                                    <Button onClick={handleLogOut}>Log Out</Button>
                                </Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </header>
            <body>
                <div className="parent">
                    <Router>
                        <WelcomeAdminComponent />
                        <Route path="/registerDashboard/registerMember" component={RegisterMember} />
                        <Route path="/registerDashboard/alterItems" component={AlterItems} />
                        <Route path="/registerDashboard/registerEvent" component={RegisterEvent} />
                        <Route path="/registerDashboard/registerMeeting" component={RegisterMeeting} />
                        <Route path="/registerDashboard/registerLabReport" component={RegisterLabReport} />
                        <Route path="/registerDashboard/registerVisit" component={RegisterVisita} />
                    </Router>
                </div>
            </body>
        </div>
    )

}



export default RegisterDashboard;

