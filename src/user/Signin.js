import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { signin, authenticate, isAuthenticated } from '../auth/helper';
import Base from '../core/Base'

const Signin = () => {
    const [values , setValues] = useState({
        name:"",
        email:"",
        password:"",
        error:"",
        success:false,
        loading:false,
        didRedirect:false
    })

    const { name, email, password, error, success , loading, didRedirect} = values;

    const handleChange = (name) =>
    (event) => {
      setValues({ ...values, error: false, [name]: event.target.value });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading:true })

        signin({ email, password })
          .then((data) => {
            console.log("DATA", data);
            if(data.token){
              authenticate(data, () => {
                console.log("token added")
                setValues({
                  ...values,
                  didRedirect:true
                })
              })
            } else{
              setValues({
                ...values,
                loading:false
              })
            }
  
          })
          .catch((e) => console.log(e));
      };
    
      const performRedirect = () => {
        if(isAuthenticated()){
          return <Redirect to="/"/>
        }
      }

      const loadingMessage =() =>{
        return(
          loading && (
            <div className="alert alert-info">
            
            </div>
          )
        )
      }

    const successMessage = () => {
        return (
          <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
              <div
                className="alert alert-success"
                style={{ display: success ? "" : "none" }}
              >
                New account created successfully. Please <Link
                  to="/signup"
                >
                  login now.
                </Link>
              </div>
            </div>
          </div>
        );
      };
    
      const errorMessage = () => {
        return (
          <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
              <div
                className="alert alert-danger"
                style={{ display: error ? "" : "none" }}
              >
                Check all fields again
              </div>
            </div>
          </div>
        );
      };
    
      const signInForm = () => {
        return (
          <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
              <form>
                
                <div className="form-group">
                  <label className="text-light">Email</label>
                  <input
                    className="form-control"
                    value={email}
                    onChange={handleChange("email")}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label className="text-light">password</label>
                  <input
                    className="form-control"
                    value={password}
                    onChange={handleChange("password")}
                    type="password"
                  />
                </div>
                <button
                  onClick={onSubmit}
                  className="btn btn-success btn-block"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        );
      };
    return (
        <Base title="signin page" description="Tshirt store">
            {loadingMessage()}
            
            {signInForm()}
            {performRedirect()}
        </Base>
    )
}

export default Signin
