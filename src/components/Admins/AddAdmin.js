import React, { Component } from 'react';
import { Alert, Button, Card, CardBody, CardHeader, Form, FormGroup, Input, Label } from 'reactstrap';
import { firebase } from '../../index';
import ROUTES from '../../routes';
import { ROLES } from '../../constants';

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
    // FIXME: Fix logic to create new admin.
		firebase
			.doCreateUserWithEmailAndPassword(email, password)
			.then(authUser => {
        // Create a user in your Firebase realtime database
				return firebase
					.admin(authUser.user.uid)
					.set(
					{
						name,
						email,
						roles,
					},
					{ merge: true });
			})
			.then(() => {
				return firebase.doSendEmailVerification();
			})
			.then(() => {
				this.props.history.push(ROUTES.ADMIN_LIST.path);
			})
			.catch(error => {
				this.setState({ error });
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
