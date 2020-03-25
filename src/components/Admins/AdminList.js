import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Table, UncontrolledTooltip } from 'reactstrap';
import axios from 'axios';
import { firebase } from '../../index';
import { DELETE_ADMIN_URL } from '../../constants';

export default class AdminList extends Component {
	constructor(props) {
		super(props);

    this.state = {
      loading: false,
      admins: [],
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.unsubscribe = firebase
			.admins()
			.onSnapshot(snapshot => {
				let admins = [];

				snapshot.forEach(doc => {
					admins.push({ ...doc.data(), uid: doc.id });
				});

				this.setState({
					admins,
					loading: false,
				});
			});
	}

	componentWillUnmount() {
		this.unsubscribe();
  }

  sendPasswordResetEmail = (email) => {
    let isConfirmed = window.confirm('Are you sure you want to send a password reset email to this admin?');
    if(isConfirmed) {
      firebase.doPasswordReset(email);
    }
  }

  deleteAdmin = (uid) => {
    let isConfirmed = window.confirm('Are you sure you want to delete this admin?');
    if(isConfirmed) {
      axios({
        method: 'POST',
        url: DELETE_ADMIN_URL,
        data: {
          uid
        }
      })
      .then(response => {
        window.alert(response.data.message);
      })
      .catch(error => {
        window.alert(error.message);
      });
    }
  }

	render() {
		const { admins, loading } = this.state;

		return (
			<Card>
				<CardHeader>
					<h4>Admins</h4>
				</CardHeader>
				<CardBody>
					{loading && <div className="animated fadeIn pt-3 text-center">Loading...</div>}
					<Table striped responsive>
						<thead>
							<tr>
								<th>UID</th>
								<th>Name</th>
								<th>Email</th>
								<th>Roles</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{admins.map((admin, idx) => (
								<tr key={admin.uid}>
									<td>{admin.uid}</td>
									<td>{admin.name}</td>
									<td>{admin.email}</td>
									<td>{Object.values(admin.roles).join(', ')}</td>
									<td>
                    <Button type="button"
                      id="sendPwdResetEmailBtn"
                      color="primary"
                      onClick={() => this.sendPasswordResetEmail(admin.email)}
                      style={{ marginRight: 5 }}
                    >
                      <i className="fa fa-envelope"></i>
                    </Button>
                    <UncontrolledTooltip target="sendPwdResetEmailBtn">
                      Send Password Reset Email
                    </UncontrolledTooltip>
                    <Button type="button"
                      id="deleteAdminBtn"
                      color="danger"
                      onClick={() => this.deleteAdmin(admin.uid)}
                    >
                      <i className="fa fa-trash"></i>
                    </Button>
                    <UncontrolledTooltip target="deleteAdminBtn">
                      Delete Admin
                    </UncontrolledTooltip>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		);
	}
}
