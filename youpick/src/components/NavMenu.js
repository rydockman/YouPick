import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export class NavMenu extends Component {
    render() {
        return (
            <div>
                <Navbar bg="light">
                    <Navbar.Brand href="/">YouPick</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/signup">Signup</Nav.Link>
                        <Nav.Link href="/farmerprofile">Profile</Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search Farms</Button>
                    </Form>
                </Navbar>
            </div>
        )
    }
}

export default NavMenu
