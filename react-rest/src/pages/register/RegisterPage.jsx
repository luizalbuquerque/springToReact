import React from 'react';
import './RegisterPage.css';
import UserService from '../../services/user.service';
import { User } from '../../models/user';

class RegisterPage extends React.Component{

    constructor(props) {
        super(props);

        if (UserService.currentUserValue) {
            this.props.history.push('/profile');
        }

        this.state = {
            user: new User('', '', ''),
            submitted: false,
            loading: false,
            errorMessage: '',
        };
    }

    handleChange(e) {
        var { name, value } = e.target;
        var user = this.state.user;
        user[name] = value;
        this.setState({ user: user });
    }

    handleRegister(e) {
        e.preventDefault();
        this.setState({submitted: true });
        const { user } = this.state;

        //validate form
        if(!user.name || !user.password || !user.username) {
            return;
        }

        this.setState(({ loading: true }));
        UserService.register(user)
            .then(data => {
                this.props.history.push('/login');
            },
                error => {
                if (error && error.response && error.response.status === 409) {
                    this.setState({
                        errorMessage: 'Usuário não é valido.',
                        loading: false,
                    });
                } else {
                    this.setState({
                        errorMessage: 'Unexpected error occurred.',
                        loading: false,
                    });
                }
                });
    }

    render() {
        const { user, submitted, loading, errorMessage } = this.state;
        return (
            <div className="register-page">
                <div className="card">
                    <div className="header-container">
                        <i className="fa fa-user"/>
                    </div>

                    {errorMessage &&
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                    }

                    <form
                        name="form"
                        onSubmit={(e) => this.handleRegister(e)}
                        noValidate
                        className={submitted ? 'was-validated' : ''}>
                        <div className={'form-group'}>
                            <label htmlFor="username">Nome Completo: </label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Full Name"
                                required
                                value={user.name}
                                onChange={(e) => this.handleChange(e)}/>
                            <div className="invalid-feedback">
                                Requer nome completo.
                            </div>
                        </div>

                        <div className={'form-group'}>
                            <label htmlFor="username">Usuário: </label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                placeholder="Username"
                                required
                                value={user.username}
                                onChange={(e) => this.handleChange(e)}/>
                            <div className="invalid-feedback">
                                Requer um usuário valido.
                            </div>
                        </div>

                        <div className={'form-group'}>
                            <label htmlFor="Password">Senha: </label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Password"
                                required
                                value={user.password}
                                onChange={(e) => this.handleChange(e)}/>
                            <div className="invalid-feedback">
                                Requer senha.
                            </div>
                        </div>

                        <button
                            className="btn btn-primary btn-block"
                            onClick={() => this.setState({ submitted: true })}
                            disabled={loading}>
                            Cadastrar
                        </button>
                    </form>
                    <a href="/login" className="card-link">Já tenho conta!</a>
                </div>
            </div>
        );
    }
}

export { RegisterPage };
