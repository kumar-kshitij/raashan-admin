import React, { Component } from 'react';
import { Alert, Button, Card, CardBody, CardHeader, Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';
import ROUTES from '../../routes';
import { ROLES, CREATE_ADMIN_URL } from '../../constants';

export default class AddAdmin extends Component {
	constructor(props) {
		super(props);

		this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: null
    };
	}

	onSubmit = event => {
		event.preventDefault();
		this.setState({ error: null })

		const { name, email, password } = this.state;

		const roles = {};
    roles[ROLES.ADMIN] = ROLES.ADMIN;

    axios({
      method: 'POST',
      url: CREATE_ADMIN_URL,
      data: {
        email,
        password,
        name,
        roles
      }
    })
    .then(response => {
      if(response.data.success) {
        this.props.history.push(ROUTES.ADMIN_LIST.path);
      } else {
        this.setState({
          error: {
            message: response.data.message
          }
        });
      }
    })
    .catch(error => {
      this.setState({
        error: {
          message: error.message
        }
      });
    });
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { name, email, password, confirmPassword, error } = this.state;

		const isInvalid = password !== confirmPassword || password === '' || email === '' || name === '';

		return (
			<Card>
				<CardHeader>
					<h4>Add Admin</h4>
				</CardHeader>
				<CardBody>
					<Form onSubmit={this.onSubmit}>
						<FormGroup>
							<Label>Full name</Label>
							<Input type="text"
								name="name"
								value={name}
								onChange={this.onChange}
								placeholder="Enter full name"
							/>
						</FormGroup>
						<FormGroup>
							<Label>Email address</Label>
							<Input type="email"
								name="email"
								value={email}
								onChange={this.onChange}
								placeholder="Enter email address"
							/>
						</FormGroup>
						<FormGroup>
							<Label>Password</Label>
							<Input type="password"
								name="password"
								value={password}
								onChange={this.onChange}
								placeholder="Enter password"
							/>
						</FormGroup>
						<FormGroup>
							<Label>Confirm password</Label>
							<Input type="password"
								name="confirmPassword"
								value={confirmPassword}
								onChange={this.onChange}
								placeholder="Enter confirm password"
							/>
						</FormGroup>

						<Button type="submit" color="primary" disabled={isInvalid}>
							Add Admin
						</Button>

						{error && <Alert color="danger">{error.message}</Alert>}
					</Form>
				</CardBody>
			</Card>
		);
	}
}
