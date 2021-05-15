import React, { Component } from 'react'
//import { Link } from 'react-router-dom';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/register_login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
              email: this.state.email,
              password: this.state.password
            }),
        });
        const body = await response.text();
        console.log(body)
        if(body.charAt(2) == "e"){
            alert("Wrong Password")
        }
        this.setState({ responseToPost: body });
      };

    render() {
        return (
            <html lang="en">
                <head>
                    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'/>
                    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"></link>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <title>Login</title>
                </head>
                <body>
                <form method = "post" onSubmit={this.handleSubmit} class="box">
                    <h1>You Pick</h1>
                    <p class="text-muted"> Please enter your login and password!</p> 
                    <input type="text" name="email" placeholder="Email" onChange={this.handleChange}/> 
                    <input type="password" name="password" placeholder="Password" onChange={this.handleChange}/> 
                    <input type="submit" value="Login"/>
                    <div class="col-md-12">
                        <ul class="social-network social-circle">
                            <li><a href="#placeholder" class="icoFacebook" title="Facebook"><i class="icon-facebook"></i></a></li>
                            <li><a href="localhost:8000/api/google" class="icoGoogle" title="Google"><i class="icon-google-plus"></i> </a></li>
                        </ul>
                    </div>
                    <div class="loginDiv"><a class="forgot text-muted" href="#placeholder">Forgot password?</a> </div>
                    <div class="loginDiv"><a href="/signup">New to You Pick? Sign Up!</a></div>
                    <div class="loginDiv"><a href="/" title="Back"><i class="icon-long-arrow-left"></i>Back to Home</a></div>
                </form>
                <script href="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
                <script href="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
                <script href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
            </body>
        </html>
        )
    }
}

export default Login
